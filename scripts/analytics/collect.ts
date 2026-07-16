// Observabilité — snapshot quotidien → historique JSON → digest hebdo email.
//
// Modes (argv) :
//   --snapshot : trafic GoatCounter (veille J-1) + SEO Search Console (jour finalisé J-3),
//                append à data/analytics-history.json.
//   --digest   : lit tout l'historique, calcule les tendances 7 j / 28 j, fait analyser par
//                LLM, envoie l'email (Resend). Interroge aussi GSC en direct pour les top requêtes.
//   --selftest : maths de tendance + déduplication + agrégation, sans réseau. Exit 0/1.
// Option : ANALYTICS_DRY_RUN=1 (log au lieu d'écrire/envoyer).
//
// Décalage GSC : les données SEO ne sont finalisées qu'après ~3 j. D'où le SEO à J-3 dans le
// snapshot (le trafic, lui, est complet dès J-1). Les deux séries persistent dans le même JSON
// committé — base time-series versionnée, ~100 Ko/an, lisible par un futur dashboard.
// Tourne dans GitHub Actions, jamais dans Next.js.

import assert from 'node:assert/strict'
import { createSign } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import OpenAI from 'openai'
import { Resend } from 'resend'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`)
  return value
}

const isoDay = (d: Date): string => d.toISOString().slice(0, 10)
const DRY_RUN = process.env.ANALYTICS_DRY_RUN === '1'
const HISTORY_FILE = 'data/analytics-history.json'

/** Jour (UTC) situé n jours avant aujourd'hui, format YYYY-MM-DD. */
function daysAgo(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return isoDay(d)
}

/** Fenêtre GoatCounter = la veille entière (UTC), bornes arrondies à l'heure. */
function yesterdayWindow(): { start: string; end: string; day: string } {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  const start = new Date(end.getTime() - 24 * 3600 * 1000)
  return { start: start.toISOString(), end: end.toISOString(), day: isoDay(start) }
}

const round1 = (n: number): number => Math.round(n * 10) / 10
const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

// ---------------------------------------------------------------------------
// Modèle de snapshot (normalisé, indépendant des fournisseurs)
// ---------------------------------------------------------------------------

interface TopItem {
  label: string
  count: number
}
/** SEO d'un jour finalisé. `date` (le jour GSC, ~J-3) diffère de la date du snapshot (J-1). */
interface SearchDay {
  date: string
  clicks: number
  impressions: number
  position: number
}
interface Snapshot {
  date: string // jour de trafic mesuré (J-1, UTC)
  metrics: { visitors: number; conversions: number }
  topPages: TopItem[]
  topReferrers: TopItem[]
  topCountries: TopItem[]
  search: SearchDay | null // null tant que GSC n'est pas configuré
}

// ---------------------------------------------------------------------------
// GoatCounter — trafic (API v0, Bearer)
// ---------------------------------------------------------------------------

const totalSchema = z.looseObject({ total: z.number() })
const hitsSchema = z.looseObject({
  hits: z.array(z.looseObject({ path: z.string(), count: z.number() })).default([]),
})
const gcStatsSchema = z.looseObject({
  stats: z
    .array(z.looseObject({ id: z.string().nullish(), name: z.string().nullish(), count: z.number() }))
    .default([]),
})

async function fetchGoatCounter(
  start: string,
  end: string,
): Promise<Pick<Snapshot, 'metrics' | 'topPages' | 'topReferrers' | 'topCountries'>> {
  const base = `${requireEnv('GOATCOUNTER_SITE').replace(/\/$/, '')}/api/v0`
  const token = requireEnv('GOATCOUNTER_TOKEN')

  // GoatCounter a un rate limit serré (~sous-seconde) ; on enchaîne 5 endpoints.
  // ponytail: retry sur 429/5xx, attente fixe 1 s (le hint est en centaines de ms).
  async function get(path: string, extra: Record<string, string> = {}): Promise<unknown> {
    const url = `${base}/${path}?${new URLSearchParams({ start, end, ...extra })}`
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = await fetch(url, {
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      })
      if ((res.status === 429 || res.status >= 500) && attempt < 4) {
        await new Promise((r) => setTimeout(r, 1000))
        continue
      }
      if (!res.ok) throw new Error(`GoatCounter ${path} ${res.status} : ${await res.text()}`)
      return res.json()
    }
    throw new Error(`GoatCounter ${path} : échec après retries`)
  }

  const total = totalSchema.parse(await get('stats/total'))
  const hits = hitsSchema.parse(await get('stats/hits', { limit: '10' }))
  const refs = gcStatsSchema.parse(await get('stats/toprefs', { limit: '10' }))
  const locs = gcStatsSchema.parse(await get('stats/locations', { limit: '10' }))
  // Conversions = event nommé 'contact-envoi' (formulaire envoyé), relu par nom.
  const conv = hitsSchema.parse(
    await get('stats/hits', { include_paths: 'contact-envoi', path_by_name: 'true' }),
  )

  return {
    metrics: { visitors: total.total, conversions: sum(conv.hits.map((h) => h.count)) },
    topPages: hits.hits.map((h) => ({ label: h.path, count: h.count })),
    topReferrers: refs.stats.map((s) => ({ label: s.name || s.id || '(direct)', count: s.count })),
    topCountries: locs.stats.map((s) => ({ label: s.name || s.id || '?', count: s.count })),
  }
}

// ---------------------------------------------------------------------------
// Search Console — SEO. Auth = JWT service account signé maison (node:crypto),
// aucune dépendance Google. Actif dès que GSC_SA_KEY est présent.
// ---------------------------------------------------------------------------

const GSC_SITE = process.env.GSC_SITE_URL || 'sc-domain:behaghel-avocat.com'
const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'

interface SaKey {
  client_email: string
  private_key: string
}
interface GscTotals {
  clicks: number
  impressions: number
  position: number
}

const gscRowSchema = z.looseObject({
  keys: z.array(z.string()).nullish(),
  clicks: z.number(),
  impressions: z.number(),
  ctr: z.number().nullish(),
  position: z.number(),
})
const gscResponseSchema = z.looseObject({ rows: z.array(gscRowSchema).default([]) })
type GscRow = z.infer<typeof gscRowSchema>

/** Échange le JWT signé contre un access_token OAuth (flux service account). */
async function gscToken(sa: SaKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const b64 = (o: unknown): string => Buffer.from(JSON.stringify(o)).toString('base64url')
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: sa.client_email,
    scope: GSC_SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`
  const signature = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url')

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  })
  if (!res.ok) throw new Error(`OAuth Google ${res.status} : ${await res.text()}`)
  return z.object({ access_token: z.string() }).parse(await res.json()).access_token
}

async function gscQuery(token: string, body: Record<string, unknown>): Promise<GscRow[]> {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE)}/searchAnalytics/query`
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`GSC query ${res.status} : ${await res.text()}`)
  return gscResponseSchema.parse(await res.json()).rows
}

function readSaKey(): SaKey | null {
  const raw = process.env.GSC_SA_KEY
  if (!raw) return null
  return JSON.parse(raw) as SaKey
}

/** SEO du jour finalisé J-3 (totaux), pour le snapshot quotidien. Null si GSC non configuré. */
async function fetchGscDay(): Promise<SearchDay | null> {
  const sa = readSaKey()
  if (!sa) return null
  const token = await gscToken(sa)
  const day = daysAgo(3)
  const rows = await gscQuery(token, { startDate: day, endDate: day, dimensions: [], rowLimit: 1 })
  const r = rows[0]
  return {
    date: day,
    clicks: r?.clicks ?? 0,
    impressions: r?.impressions ?? 0,
    position: r ? round1(r.position) : 0,
  }
}

/** Top requêtes sur 28 j finalisés, pour le digest (données courantes, non persistées). */
async function fetchTopQueries(): Promise<
  { query: string; clicks: number; impressions: number; position: number }[]
> {
  const sa = readSaKey()
  if (!sa) return []
  const token = await gscToken(sa)
  const rows = await gscQuery(token, {
    startDate: daysAgo(30),
    endDate: daysAgo(3),
    dimensions: ['query'],
    rowLimit: 10,
  })
  return rows.map((r) => ({
    query: r.keys?.[0] ?? '?',
    clicks: r.clicks,
    impressions: r.impressions,
    position: round1(r.position),
  }))
}

// ---------------------------------------------------------------------------
// Historique (fichier JSON committé)
// ---------------------------------------------------------------------------

function readHistory(): Snapshot[] {
  if (!existsSync(HISTORY_FILE)) return []
  const parsed: unknown = JSON.parse(readFileSync(HISTORY_FILE, 'utf8'))
  return Array.isArray(parsed) ? (parsed as Snapshot[]) : []
}

/** Append idempotent : un re-run le même jour remplace la ligne. Trié par date. */
function appendSnapshot(history: Snapshot[], snap: Snapshot): Snapshot[] {
  const rest = history.filter((s) => s.date !== snap.date)
  return [...rest, snap].sort((a, b) => a.date.localeCompare(b.date))
}

// ---------------------------------------------------------------------------
// Tendances (sommes glissantes 7 j / 28 j sur métriques additives)
// ---------------------------------------------------------------------------

interface Trend {
  last7: number
  prev7: number
  wowPct: number | null
  last28: number
  momPct: number | null
}

const pct = (cur: number, prev: number): number | null =>
  prev === 0 ? null : Math.round(((cur - prev) / prev) * 100)

function trend(history: Snapshot[], pick: (s: Snapshot) => number): Trend {
  const v = history.map(pick)
  const last7 = sum(v.slice(-7))
  const prev7 = sum(v.slice(-14, -7))
  const last28 = sum(v.slice(-28))
  const prev28 = sum(v.slice(-56, -28))
  return { last7, prev7, wowPct: pct(last7, prev7), last28, momPct: pct(last28, prev28) }
}

/** Position moyenne (métrique non additive) sur les N derniers jours où le SEO est présent. */
function avgPosition(history: Snapshot[], days: number): number | null {
  const vals = history
    .slice(-days)
    .map((s) => s.search?.position)
    .filter((p): p is number => typeof p === 'number' && p > 0)
  return vals.length === 0 ? null : round1(sum(vals) / vals.length)
}

/** Agrège un top (pages/référents/pays) sur les N derniers jours par label. */
function aggregateTop(history: Snapshot[], key: 'topPages' | 'topReferrers' | 'topCountries', days: number): TopItem[] {
  const totals = new Map<string, number>()
  for (const snap of history.slice(-days)) {
    for (const item of snap[key]) {
      totals.set(item.label, (totals.get(item.label) ?? 0) + item.count)
    }
  }
  return [...totals.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

// ---------------------------------------------------------------------------
// Digest : résumé chiffré → analyse LLM → email
// ---------------------------------------------------------------------------

interface SeoSummary {
  clicks: Trend
  impressions: Trend
  positionMoyenne7j: number | null
  topRequetes: { query: string; clicks: number; impressions: number; position: number }[]
}
interface Summary {
  jusquau: string
  jours: number
  visitors: Trend
  conversions: Trend
  tauxConversion7j: number | null
  topPages: TopItem[]
  topReferrers: TopItem[]
  topCountries: TopItem[]
  seo: SeoSummary | null
}

function buildSummary(
  history: Snapshot[],
  topQueries: SeoSummary['topRequetes'],
): Summary {
  const hasSeo = history.some((s) => s.search) || topQueries.length > 0
  const visitors = trend(history, (s) => s.metrics.visitors)
  const conversions = trend(history, (s) => s.metrics.conversions)
  return {
    jusquau: history.at(-1)?.date ?? '(aucune donnée)',
    jours: history.length,
    visitors,
    conversions,
    tauxConversion7j: visitors.last7 > 0 ? round1((conversions.last7 / visitors.last7) * 100) : null,
    topPages: aggregateTop(history, 'topPages', 7),
    topReferrers: aggregateTop(history, 'topReferrers', 7),
    topCountries: aggregateTop(history, 'topCountries', 7),
    seo: hasSeo
      ? {
          clicks: trend(history, (s) => s.search?.clicks ?? 0),
          impressions: trend(history, (s) => s.search?.impressions ?? 0),
          positionMoyenne7j: avgPosition(history, 7),
          topRequetes: topQueries,
        }
      : null,
  }
}

const insightSchema = z.object({ analyse: z.string(), recommandations: z.array(z.string()) })
type Insight = z.infer<typeof insightSchema>

const INSIGHT_JSON_SCHEMA = {
  type: 'object',
  properties: {
    analyse: { type: 'string', description: 'Analyse courte (3-5 phrases) des tendances fournies' },
    recommandations: {
      type: 'array',
      items: { type: 'string' },
      description: '2 à 4 recommandations concrètes, ancrées sur les chiffres — pas de généralités',
    },
  },
  required: ['analyse', 'recommandations'],
  additionalProperties: false,
} as const

const INSIGHT_SYSTEM = `Tu analyses l'audience hebdomadaire du site vitrine d'une avocate en droit des baux commerciaux (Lyon). Objectif du site : convertir en prise de rendez-vous. On te donne des chiffres réels : conversions (demandes de contact via le formulaire — LA métrique métier, le site vise la prise de RDV, avec le taux demandes/visiteurs), trafic (visiteurs, top pages, top référents, top pays) et SEO Search Console (clics, impressions, position moyenne, top requêtes), avec variations semaine/mois.
Règles : appuie CHAQUE observation sur un chiffre fourni (ex. « /honoraires : X vues, +Y% » ; « requête "bail commercial Lyon" : position 8,2 »). Signale hausses/baisses notables, référents intéressants (moteurs, IA génératives comme chatgpt.com/perplexity.ai), et requêtes SEO à fort potentiel (beaucoup d'impressions mais position >10 = page à renforcer). Priorise les conversions et leur taux — c'est l'objectif du site : un trafic ou un SEO en hausse SANS conversion est un signal à souligner. Propose des recommandations ACTIONNABLES et spécifiques à ces données ; bannis les généralités (« publiez plus »). Si le recul est insuffisant (peu de jours, variations nulles, SEO absent), dis-le franchement plutôt que d'inventer.`

async function analyze(summary: Summary): Promise<Insight> {
  requireEnv('OPENAI_API_KEY') // le SDK la lit seul
  const openai = new OpenAI()
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.3,
    messages: [
      { role: 'system', content: INSIGHT_SYSTEM },
      { role: 'user', content: JSON.stringify(summary) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'insight', strict: true, schema: INSIGHT_JSON_SCHEMA },
    },
  })
  const content = res.choices[0]?.message?.content
  if (!content) throw new Error('Analyse : réponse vide')
  return insightSchema.parse(JSON.parse(content))
}

const pctStr = (p: number | null): string => (p === null ? '—' : `${p >= 0 ? '+' : ''}${p} %`)
const topHtml = (items: TopItem[]): string =>
  items.length === 0 ? '<li>—</li>' : items.map((i) => `<li>${i.label} — <strong>${i.count}</strong></li>`).join('')

function seoHtml(seo: SeoSummary | null): string {
  if (!seo) return '<h3>SEO</h3><p>Search Console pas encore configuré.</p>'
  const queries =
    seo.topRequetes.map((q) => `<li>${q.query} — ${q.clicks} clic(s), pos. ${q.position}</li>`).join('') || '<li>—</li>'
  return `<h3>SEO (Search Console)</h3>
<p>Clics 7 j : <strong>${seo.clicks.last7}</strong> (${pctStr(seo.clicks.wowPct)}) · Impressions 7 j : <strong>${seo.impressions.last7}</strong> (${pctStr(seo.impressions.wowPct)}) · Position moyenne 7 j : <strong>${seo.positionMoyenne7j ?? '—'}</strong></p>
<h4>Top requêtes (28 j)</h4><ul>${queries}</ul>`
}

function digestHtml(s: Summary, insight: Insight): string {
  return `<p>Digest audience — données jusqu'au ${s.jusquau} (${s.jours} jour(s) d'historique).</p>
<h3>Demandes de contact (conversions)</h3>
<p>7 derniers jours : <strong>${s.conversions.last7}</strong> (${pctStr(s.conversions.wowPct)} sur 1 sem.) — taux : <strong>${s.tauxConversion7j ?? '—'} %</strong> des visiteurs.</p>
<h3>Visiteurs</h3>
<p>7 derniers jours : <strong>${s.visitors.last7}</strong> (préc. ${s.visitors.prev7}, ${pctStr(s.visitors.wowPct)} sur 1 sem., ${pctStr(s.visitors.momPct)} sur 4 sem.).</p>
<h3>Top pages (7 j)</h3><ul>${topHtml(s.topPages)}</ul>
<h3>Top référents (7 j)</h3><ul>${topHtml(s.topReferrers)}</ul>
<h3>Top pays (7 j)</h3><ul>${topHtml(s.topCountries)}</ul>
${seoHtml(s.seo)}
<h3>Analyse</h3><p>${insight.analyse}</p>
<h3>Recommandations</h3><ul>${insight.recommandations.map((r) => `<li>${r}</li>`).join('') || '<li>—</li>'}</ul>
<p style="color:#666;font-size:13px">Trafic GoatCounter (cookieless) + SEO Search Console. Analyse IA — piste, pas vérité.</p>`
}

function digestText(s: Summary, insight: Insight): string {
  const top = (items: TopItem[]): string => items.map((i) => `  ${i.label} — ${i.count}`).join('\n') || '  —'
  const seo = s.seo
    ? `SEO — clics 7j ${s.seo.clicks.last7} (${pctStr(s.seo.clicks.wowPct)}), impressions ${s.seo.impressions.last7} (${pctStr(s.seo.impressions.wowPct)}), position moy. ${s.seo.positionMoyenne7j ?? '—'}\nTop requêtes :\n${s.seo.topRequetes.map((q) => `  ${q.query} — ${q.clicks} clic(s), pos. ${q.position}`).join('\n') || '  —'}`
    : 'SEO — Search Console pas encore configuré.'
  return `Digest audience — jusqu'au ${s.jusquau} (${s.jours} j d'historique)

Demandes de contact (7 j) : ${s.conversions.last7} (${pctStr(s.conversions.wowPct)} 1sem) — taux ${s.tauxConversion7j ?? '—'} % des visiteurs

Visiteurs (7 j) : ${s.visitors.last7} (préc. ${s.visitors.prev7}, ${pctStr(s.visitors.wowPct)} 1sem, ${pctStr(s.visitors.momPct)} 4sem)

Top pages (7 j) :
${top(s.topPages)}

Top référents (7 j) :
${top(s.topReferrers)}

${seo}

Analyse :
${insight.analyse}

Recommandations :
${insight.recommandations.map((r) => `- ${r}`).join('\n') || '- —'}`
}

async function sendDigest(s: Summary, insight: Insight): Promise<void> {
  const resend = new Resend(requireEnv('RESEND_API_KEY'))
  const to = requireEnv('ANALYTICS_TO')
    .split(',')
    .map((x) => x.trim())
  const { error } = await resend.emails.send({
    from: 'Analytics behaghel <noreply@behaghel-avocat.com>',
    to,
    subject: `Digest audience — semaine du ${isoDay(new Date())}`,
    html: digestHtml(s, insight),
    text: digestText(s, insight),
  })
  if (error) throw new Error(`Resend : ${error.message}`)
  console.log(`Digest envoyé à ${to.join(', ')}`)
}

// ---------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------

/** GSC ne doit jamais faire échouer la chaîne : on log et on continue sans SEO. */
async function safeGsc<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    console.error(`GSC ${label} échec (ignoré) : ${e instanceof Error ? e.message : e}`)
    return fallback
  }
}

async function runSnapshot(): Promise<void> {
  const { start, end, day } = yesterdayWindow()
  const gc = await fetchGoatCounter(start, end)
  const search = await safeGsc('snapshot', fetchGscDay, null)
  const snap: Snapshot = { date: day, ...gc, search }
  console.log(`Snapshot ${day} : ${snap.metrics.visitors} visiteur(s), SEO ${search ? `J${search.date} ${search.clicks} clic(s)` : 'absent'}`)
  if (DRY_RUN) {
    console.log(JSON.stringify(snap, null, 2))
    return
  }
  const history = appendSnapshot(readHistory(), snap)
  writeFileSync(HISTORY_FILE, `${JSON.stringify(history, null, 2)}\n`, 'utf8')
  console.log(`Historique : ${history.length} jour(s) → ${HISTORY_FILE}`)
}

async function runDigest(): Promise<void> {
  const history = readHistory()
  const topQueries = await safeGsc('top requêtes', fetchTopQueries, [])
  const summary = buildSummary(history, topQueries)
  // <2 jours ET pas de SEO : rien à comparer → pas d'appel LLM, on envoie quand même (signal de vie).
  const insight: Insight =
    history.length >= 2 || summary.seo
      ? await analyze(summary)
      : { analyse: 'Pas encore assez de recul pour dégager une tendance.', recommandations: [] }
  if (DRY_RUN) {
    console.log(JSON.stringify(summary, null, 2))
    console.log(digestText(summary, insight))
    return
  }
  await sendDigest(summary, insight)
}

// ---------------------------------------------------------------------------
// Self-test (aucun réseau) — node … collect.ts --selftest
// ---------------------------------------------------------------------------

function selftest(): void {
  const base = (date: string, visitors: number, clicks?: number, conversions = 1): Snapshot => ({
    date,
    metrics: { visitors, conversions },
    topPages: [{ label: '/', count: visitors }],
    topReferrers: [],
    topCountries: [],
    search: clicks === undefined ? null : { date, clicks, impressions: clicks * 10, position: 8 },
  })

  // 14 jours : trafic 10/j puis 20/j → 7j courants 140 vs préc. 70 → +100 %.
  const hist = Array.from({ length: 14 }, (_, i) =>
    base(`2026-01-${String(i + 1).padStart(2, '0')}`, i < 7 ? 10 : 20, i < 7 ? 2 : 4),
  )
  const t = trend(hist, (s) => s.metrics.visitors)
  assert.equal(t.last7, 140, 'somme 7 j courants')
  assert.equal(t.prev7, 70, 'somme 7 j précédents')
  assert.equal(t.wowPct, 100, 'variation semaine trafic')

  const tc = trend(hist, (s) => s.search?.clicks ?? 0)
  assert.equal(tc.last7, 28, 'somme clics SEO 7 j')
  assert.equal(tc.wowPct, 100, 'variation semaine SEO')
  assert.equal(avgPosition(hist, 7), 8, 'position moyenne')

  assert.equal(trend(hist, (s) => s.metrics.conversions).last7, 7, 'somme conversions 7 j')
  assert.equal(buildSummary(hist, []).tauxConversion7j, 5, 'taux de conversion 7/140')

  // Append : même date remplace, nouvelle date ajoute.
  assert.equal(appendSnapshot(hist.slice(), base('2026-01-14', 99)).length, 14, 'dédup même jour')
  assert.equal(appendSnapshot(hist.slice(), base('2026-02-01', 5)).length, 15, 'ajout nouveau jour')

  // Agrégation top sur 7 j : '/' présent chaque jour.
  const agg = aggregateTop(hist, 'topPages', 7)
  assert.equal(agg[0]?.label, '/', 'top page agrégée')
  assert.equal(agg[0]?.count, 140, 'top page cumulée 7 j')

  // SEO absent → seo null.
  assert.equal(buildSummary([base('2026-03-01', 5)], []).seo, null, 'seo null sans données')

  console.log('selftest OK')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const arg = process.argv.find((a) => ['--snapshot', '--digest', '--selftest'].includes(a))
  if (arg === '--selftest') return selftest()
  if (arg === '--snapshot') return runSnapshot()
  if (arg === '--digest') return runDigest()
  throw new Error('Usage : collect.ts --snapshot | --digest | --selftest')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

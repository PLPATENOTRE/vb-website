// Observabilité trafic — snapshot quotidien → historique JSON → digest hebdo email.
//
// Deux modes (argv) :
//   --snapshot : lit GoatCounter (+ GSC si dispo) pour la veille, append à data/analytics-history.json.
//   --digest   : lit tout l'historique, calcule les tendances, fait analyser par LLM, envoie l'email.
//   --selftest : vérifie la maths de tendance + la déduplication, sans réseau. Exit 0/1.
// Option : ANALYTICS_DRY_RUN=1 (log au lieu d'écrire/envoyer).
//
// Pourquoi un historique JSON commité : GoatCounter garde tout, mais on veut UNE série cohérente
// (trafic + SEO) pour la tendance long terme, lisible aussi par un futur dashboard. Git = base
// time-series : versionnée, gratuite, ~100 Ko/an. Tourne dans GitHub Actions, jamais dans Next.js.

import assert from 'node:assert/strict'
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

/** Fenêtre = la veille entière, en UTC, bornes arrondies à l'heure (exigence GoatCounter). */
function yesterdayWindow(): { start: string; end: string; day: string } {
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  const start = new Date(end.getTime() - 24 * 3600 * 1000)
  return { start: start.toISOString(), end: end.toISOString(), day: isoDay(start) }
}

// ---------------------------------------------------------------------------
// Modèle de snapshot (normalisé, indépendant des fournisseurs)
// ---------------------------------------------------------------------------

interface TopItem {
  label: string
  count: number
}
interface SearchData {
  clicks: number
  impressions: number
  ctr: number
  position: number
  topQueries: { query: string; clicks: number; impressions: number; position: number }[]
}
interface Snapshot {
  date: string // jour mesuré (YYYY-MM-DD, UTC)
  metrics: { pageviews: number }
  topPages: TopItem[]
  topReferrers: TopItem[]
  topCountries: TopItem[]
  search: SearchData | null
}

// ---------------------------------------------------------------------------
// GoatCounter — trafic (API v0, Bearer)
// ---------------------------------------------------------------------------

const totalSchema = z.looseObject({ total: z.number() })
const hitsSchema = z.looseObject({
  hits: z.array(z.looseObject({ path: z.string(), count: z.number() })).default([]),
})
// toprefs / locations partagent la forme { stats: [{ id?, name?, count }] }.
const statsSchema = z.looseObject({
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

  async function get(path: string, extra: Record<string, string> = {}): Promise<unknown> {
    const params = new URLSearchParams({ start, end, ...extra })
    const res = await fetch(`${base}/${path}?${params}`, {
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    })
    if (!res.ok) throw new Error(`GoatCounter ${path} ${res.status} : ${await res.text()}`)
    return res.json()
  }

  const total = totalSchema.parse(await get('stats/total'))
  const hits = hitsSchema.parse(await get('stats/hits', { limit: '10' }))
  const refs = statsSchema.parse(await get('stats/toprefs', { limit: '10' }))
  const locs = statsSchema.parse(await get('stats/locations', { limit: '10' }))

  return {
    metrics: { pageviews: total.total },
    topPages: hits.hits.map((h) => ({ label: h.path, count: h.count })),
    topReferrers: refs.stats.map((s) => ({ label: s.name || s.id || '(direct)', count: s.count })),
    topCountries: locs.stats.map((s) => ({ label: s.name || s.id || '?', count: s.count })),
  }
}

// ---------------------------------------------------------------------------
// Search Console — SEO. Optionnel : câblé quand GSC_SA_KEY + type de propriété
// sont confirmés. Absent → null, et le digest s'adapte (greffe additive, zéro reprise).
// ponytail: stub volontaire. Upgrade = JWT service account (node:crypto) + Search Analytics API.
// ---------------------------------------------------------------------------

async function fetchSearchConsole(_start: string, _end: string): Promise<SearchData | null> {
  if (!process.env.GSC_SA_KEY) return null
  console.log('GSC_SA_KEY présent mais collecteur SEO pas encore câblé — ignoré.')
  return null
}

// ---------------------------------------------------------------------------
// Historique (fichier JSON commité)
// ---------------------------------------------------------------------------

function readHistory(): Snapshot[] {
  if (!existsSync(HISTORY_FILE)) return []
  const parsed: unknown = JSON.parse(readFileSync(HISTORY_FILE, 'utf8'))
  return Array.isArray(parsed) ? (parsed as Snapshot[]) : []
}

/** Append idempotent : un re-run le même jour remplace la ligne, ne la double pas. Trié par date. */
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

function trend(history: Snapshot[], pick: (s: Snapshot) => number): Trend {
  const v = history.map(pick)
  const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)
  const pct = (cur: number, prev: number): number | null =>
    prev === 0 ? null : Math.round(((cur - prev) / prev) * 100)
  const last7 = sum(v.slice(-7))
  const prev7 = sum(v.slice(-14, -7))
  const last28 = sum(v.slice(-28))
  const prev28 = sum(v.slice(-56, -28))
  return { last7, prev7, wowPct: pct(last7, prev7), last28, momPct: pct(last28, prev28) }
}

/** Agrège un top (pages/référents/pays) sur les N derniers jours par label. */
function aggregateTop(history: Snapshot[], key: keyof Snapshot, days: number): TopItem[] {
  const totals = new Map<string, number>()
  for (const snap of history.slice(-days)) {
    for (const item of snap[key] as TopItem[]) {
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

interface Summary {
  jusquau: string
  jours: number
  pageviews: Trend
  topPages: TopItem[]
  topReferrers: TopItem[]
  topCountries: TopItem[]
}

function buildSummary(history: Snapshot[]): Summary {
  return {
    jusquau: history.at(-1)?.date ?? '(aucune donnée)',
    jours: history.length,
    pageviews: trend(history, (s) => s.metrics.pageviews),
    topPages: aggregateTop(history, 'topPages', 7),
    topReferrers: aggregateTop(history, 'topReferrers', 7),
    topCountries: aggregateTop(history, 'topCountries', 7),
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

const INSIGHT_SYSTEM = `Tu analyses le trafic hebdomadaire du site vitrine d'une avocate en droit des baux commerciaux (Lyon). Objectif du site : convertir en prise de rendez-vous. On te donne des chiffres réels (pages vues, variations semaine/mois, top pages, top référents, top pays).
Règles : appuie CHAQUE observation sur un chiffre fourni (ex. « /honoraires : X vues, +Y% »). Signale les hausses/baisses notables et les référents intéressants (moteurs, IA génératives comme chatgpt.com/perplexity.ai, réseaux). Propose des recommandations ACTIONNABLES et spécifiques à ces données ; bannis les conseils génériques (« publiez plus »). Si le recul est insuffisant (peu de jours, variations nulles), dis-le franchement plutôt que d'inventer une tendance.`

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
  items.length === 0
    ? '<li>—</li>'
    : items.map((i) => `<li>${i.label} — <strong>${i.count}</strong></li>`).join('')

function digestHtml(s: Summary, insight: Insight): string {
  return `<p>Digest trafic — données jusqu'au ${s.jusquau} (${s.jours} jour(s) d'historique).</p>
<h3>Pages vues</h3>
<p>7 derniers jours : <strong>${s.pageviews.last7}</strong> (semaine préc. ${s.pageviews.prev7}, ${pctStr(s.pageviews.wowPct)} sur 1 sem., ${pctStr(s.pageviews.momPct)} sur 4 sem.).</p>
<h3>Top pages (7 j)</h3><ul>${topHtml(s.topPages)}</ul>
<h3>Top référents (7 j)</h3><ul>${topHtml(s.topReferrers)}</ul>
<h3>Top pays (7 j)</h3><ul>${topHtml(s.topCountries)}</ul>
<h3>Analyse</h3><p>${insight.analyse}</p>
<h3>Recommandations</h3><ul>${insight.recommandations.map((r) => `<li>${r}</li>`).join('') || '<li>—</li>'}</ul>
<p style="color:#666;font-size:13px">Analyse générée par IA à partir de données GoatCounter (cookieless). À prendre comme piste, pas comme vérité.</p>`
}

function digestText(s: Summary, insight: Insight): string {
  const top = (items: TopItem[]): string =>
    items.map((i) => `  ${i.label} — ${i.count}`).join('\n') || '  —'
  return `Digest trafic — jusqu'au ${s.jusquau} (${s.jours} j d'historique)

Pages vues (7 j) : ${s.pageviews.last7} (préc. ${s.pageviews.prev7}, ${pctStr(s.pageviews.wowPct)} 1sem, ${pctStr(s.pageviews.momPct)} 4sem)

Top pages (7 j) :
${top(s.topPages)}

Top référents (7 j) :
${top(s.topReferrers)}

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
    subject: `Digest trafic — semaine du ${isoDay(new Date())}`,
    html: digestHtml(s, insight),
    text: digestText(s, insight),
  })
  if (error) throw new Error(`Resend : ${error.message}`)
  console.log(`Digest envoyé à ${to.join(', ')}`)
}

// ---------------------------------------------------------------------------
// Modes
// ---------------------------------------------------------------------------

async function runSnapshot(): Promise<void> {
  const { start, end, day } = yesterdayWindow()
  const gc = await fetchGoatCounter(start, end)
  const search = await fetchSearchConsole(start, end)
  const snap: Snapshot = { date: day, ...gc, search }
  console.log(`Snapshot ${day} : ${snap.metrics.pageviews} pages vues`)
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
  const summary = buildSummary(history)
  // <2 jours : rien à comparer → on n'appelle pas le LLM, on envoie quand même (signal de vie).
  const insight: Insight =
    history.length >= 2
      ? await analyze(summary)
      : { analyse: "Pas encore assez de recul pour dégager une tendance.", recommandations: [] }
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
  const base = (date: string, pageviews: number): Snapshot => ({
    date,
    metrics: { pageviews },
    topPages: [{ label: '/', count: pageviews }],
    topReferrers: [],
    topCountries: [],
    search: null,
  })
  // 14 jours : 10/j puis 20/j → semaine courante 140 vs préc. 70 → +100 %.
  const hist = Array.from({ length: 14 }, (_, i) =>
    base(`2026-01-${String(i + 1).padStart(2, '0')}`, i < 7 ? 10 : 20),
  )
  const t = trend(hist, (s) => s.metrics.pageviews)
  assert.equal(t.last7, 140, 'somme 7 j courants')
  assert.equal(t.prev7, 70, 'somme 7 j précédents')
  assert.equal(t.wowPct, 100, 'variation semaine')

  // Append : même date remplace, nouvelle date ajoute.
  assert.equal(appendSnapshot(hist.slice(), base('2026-01-14', 99)).length, 14, 'dédup même jour')
  assert.equal(appendSnapshot(hist.slice(), base('2026-02-01', 5)).length, 15, 'ajout nouveau jour')

  // Agrégation top sur 7 j : '/' présent chaque jour.
  const agg = aggregateTop(hist, 'topPages', 7)
  assert.equal(agg[0]?.label, '/', 'top page agrégée')
  assert.equal(agg[0]?.count, 140, 'top page cumulée 7 j')

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

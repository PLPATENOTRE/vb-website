// Veille jurisprudence baux commerciaux — Phase 1 : collecte → scoring → digest email.
//
// Chaîne : Judilibre (arrêts Cass. publiés au Bulletin, 7 derniers jours)
//   → filtre mots-clés baux commerciaux (déterministe)
//   → scoring de pertinence (Claude API, sorties structurées)
//   → email digest (Resend) à VEILLE_TO.
//
// Exécution : node --experimental-strip-types scripts/veille/digest.ts
//   --selftest : vérifie le filtre sans appel réseau, exit 0/1.
// Env requis : PISTE_CLIENT_ID, PISTE_CLIENT_SECRET (OAuth Judilibre),
//   ANTHROPIC_API_KEY (scoring), RESEND_API_KEY + VEILLE_TO (email).
// Options : VEILLE_DRY_RUN=1 (log au lieu d'envoyer), VEILLE_DAYS (fenêtre, défaut 8).
//
// Tourne dans GitHub Actions (cron hebdo) — jamais dans le site Next.js.

import { z } from 'zod'

// ---------------------------------------------------------------------------
// Config & helpers
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`)
  return value
}

const JUDILIBRE_BASE =
  process.env.JUDILIBRE_BASE_URL ?? 'https://api.piste.gouv.fr/cassation/judilibre/v1.0'
const PISTE_TOKEN_URL = 'https://oauth.piste.gouv.fr/api/oauth/token'

/** Fenêtre de collecte en jours (8 par défaut : cron hebdo + marge). */
const WINDOW_DAYS = Number(process.env.VEILLE_DAYS ?? 8)

const isoDate = (d: Date): string => d.toISOString().slice(0, 10)

// ---------------------------------------------------------------------------
// Judilibre — OAuth PISTE + export des décisions récentes
// ---------------------------------------------------------------------------

const tokenSchema = z.object({ access_token: z.string() })

async function getPisteToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: requireEnv('PISTE_CLIENT_ID'),
    client_secret: requireEnv('PISTE_CLIENT_SECRET'),
    scope: 'openid',
  })
  const res = await fetch(PISTE_TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`OAuth PISTE ${res.status} : ${await res.text()}`)
  return tokenSchema.parse(await res.json()).access_token
}

// Champs utiles d'une décision (schéma volontairement lâche : l'API en renvoie plus).
const decisionSchema = z.looseObject({
  id: z.string(),
  chamber: z.string().nullish(),
  number: z.string().nullish(),
  ecli: z.string().nullish(),
  decision_date: z.string().nullish(),
  themes: z.array(z.string()).nullish(),
  summary: z.string().nullish(),
  text: z.string().nullish(),
})
export type Decision = z.infer<typeof decisionSchema>

const exportSchema = z.looseObject({
  total: z.number().nullish(),
  results: z.array(decisionSchema).default([]),
})

/**
 * Décisions AJOUTÉES à la base Judilibre dans la fenêtre (date_type=creation_date) :
 * pas de déduplication à gérer, contrairement à un filtre sur la date de décision
 * (les arrêts sont souvent publiés plusieurs semaines après avoir été rendus).
 * Chambres : 3e civile (baux) + commerciale. Publication : Bulletin (portée de principe).
 */
async function fetchRecentDecisions(token: string): Promise<Decision[]> {
  const end = new Date()
  const start = new Date(end.getTime() - WINDOW_DAYS * 24 * 3600 * 1000)

  const all: Decision[] = []
  for (let batch = 0; batch < 10; batch++) {
    const params = new URLSearchParams({
      type: 'arret',
      date_type: 'creation_date',
      date_start: isoDate(start),
      date_end: isoDate(end),
      batch_size: '100',
      batch: String(batch),
    })
    // Paramètres multiples : répétition de la clé (convention Judilibre).
    params.append('chamber', 'civ3')
    params.append('chamber', 'comm')
    params.append('publication', 'b')

    const res = await fetch(`${JUDILIBRE_BASE}/export?${params}`, {
      headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Judilibre /export ${res.status} : ${await res.text()}`)
    const page = exportSchema.parse(await res.json())
    all.push(...page.results)
    if (page.results.length < 100) break
  }
  return all
}

// ---------------------------------------------------------------------------
// Filtre baux commerciaux (déterministe, avant tout appel LLM)
// ---------------------------------------------------------------------------

const KEYWORDS = [
  'bail commercial',
  'baux commerciaux',
  'l. 145-',
  'l.145-',
  "indemnité d'éviction",
  'fonds de commerce',
  'déplafonnement',
  'valeur locative',
  'loyer commercial',
  'déspécialisation',
  'bail dérogatoire',
  'droit au renouvellement',
]

/** Minuscules + apostrophes typographiques normalisées, pour un match fiable. */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/[’ʼ]/g, "'")
}

export function isRelevant(d: Decision): boolean {
  const haystack = normalize(
    [d.themes?.join(' '), d.summary, d.text?.slice(0, 20_000)].filter(Boolean).join(' '),
  )
  return KEYWORDS.some((kw) => haystack.includes(kw))
}

// ---------------------------------------------------------------------------
// Self-test (aucun appel réseau) — `node … digest.ts --selftest`
// ---------------------------------------------------------------------------

function selftest(): void {
  const oui: Decision = {
    id: 'a',
    summary: 'Sur l’indemnité d’éviction due au preneur…', // apostrophes typographiques
  }
  const ouiTexte: Decision = { id: 'b', text: 'aux termes de l’article L. 145-14 du code…' }
  const non: Decision = { id: 'c', summary: 'Cautionnement et procédure collective.' }
  if (!isRelevant(oui)) throw new Error('selftest : apostrophe typographique non matchée')
  if (!isRelevant(ouiTexte)) throw new Error('selftest : référence L. 145- non matchée')
  if (isRelevant(non)) throw new Error('selftest : faux positif')
  console.log('selftest OK')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (process.argv.includes('--selftest')) {
    selftest()
    return
  }

  console.log(`Fenêtre : ${WINDOW_DAYS} jours — chambres civ3+comm, Bulletin`)
  const token = await getPisteToken()
  const decisions = await fetchRecentDecisions(token)
  const candidates = decisions.filter(isRelevant)
  console.log(`${decisions.length} décision(s) collectée(s), ${candidates.length} retenue(s)`)
  for (const d of candidates) {
    console.log(`- ${d.chamber ?? '?'} ${d.decision_date ?? '?'} n° ${d.number ?? d.id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

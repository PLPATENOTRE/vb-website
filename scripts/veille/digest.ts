// Veille jurisprudence baux commerciaux — Phase 1 : collecte → scoring → digest email.
//
// Chaîne : Judilibre (arrêts Cass. publiés au Bulletin, 7 derniers jours)
//   → filtre mots-clés baux commerciaux (déterministe)
//   → scoring de pertinence (OpenAI gpt-4.1-mini, structured outputs)
//   → email digest (Resend) à VEILLE_TO.
//
// Exécution : node --experimental-strip-types scripts/veille/digest.ts
//   --selftest : vérifie le filtre sans appel réseau, exit 0/1.
// Env requis : PISTE_CLIENT_ID, PISTE_CLIENT_SECRET (OAuth Judilibre),
//   OPENAI_API_KEY (scoring), RESEND_API_KEY + VEILLE_TO (email).
// Options : VEILLE_DRY_RUN=1 (log au lieu d'envoyer), VEILLE_DAYS (fenêtre, défaut 8).
//
// Tourne dans GitHub Actions (cron hebdo) — jamais dans le site Next.js.

import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import OpenAI from 'openai'
import { Resend } from 'resend'
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

/** Fenêtre de collecte en jours (8 par défaut : cron hebdo + marge).
 *  `|| 8` et non `?? 8` : une string vide (dispatch sans valeur) → Number('')=0 → repli sur 8. */
const WINDOW_DAYS = Number(process.env.VEILLE_DAYS) || 8

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
 * Décisions AJOUTÉES à la base Judilibre dans la fenêtre (date_type=creation) :
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
      // Pas de filtre `type` : les décisions Cass. sont typées `other` dans Judilibre,
      // `type=arret` ne ramène rien. Chambre + publication suffisent à cibler.
      date_type: 'creation',
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
// Scoring de pertinence (OpenAI gpt-4.1-mini, structured outputs strict)
// ---------------------------------------------------------------------------

const scoreResultSchema = z.object({
  scores: z.array(
    z.object({
      id: z.string(),
      score: z.number(),
      pourquoi: z.string(),
      angle: z.string(),
    }),
  ),
})
type Scored = Decision & { score: number; pourquoi: string; angle: string }

// JSON Schema envoyé à l'API (contraintes numériques non supportées → bornes en description).
const SCORE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    scores: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: "id Judilibre de la décision, recopié tel quel" },
          score: { type: 'integer', description: 'pertinence de 0 (hors sujet) à 10 (majeur)' },
          pourquoi: { type: 'string', description: 'justification en une phrase' },
          angle: { type: 'string', description: "angle d'article suggéré, une phrase" },
        },
        required: ['id', 'score', 'pourquoi', 'angle'],
        additionalProperties: false,
      },
    },
  },
  required: ['scores'],
  additionalProperties: false,
} as const

const SCORING_SYSTEM = `Tu évalues des arrêts de la Cour de cassation pour la veille éditoriale
d'une avocate dont la pratique est : baux commerciaux (négociation, vie du bail, contentieux,
fin de bail, indemnité d'éviction) et cession de fonds de commerce. Elle publie des articles
courts commentant les arrêts importants pour ses clients (bailleurs ET preneurs, commerçants,
investisseurs). Pour chaque décision fournie, note la pertinence de 0 à 10 :
10 = revirement ou précision de principe en plein cœur de sa matière ;
5 = intéressant mais périphérique ; 0 = hors sujet. Propose un angle d'article concret
(la question pratique que l'arrêt tranche). Réponds pour TOUTES les décisions fournies.`

async function scoreCandidates(candidates: Decision[]): Promise<Scored[]> {
  requireEnv('OPENAI_API_KEY') // le SDK la lit seul ; échec précoce si absente
  const openai = new OpenAI()

  const payload = candidates.map((d) => ({
    id: d.id,
    chambre: d.chamber,
    date: d.decision_date,
    numero: d.number,
    themes: d.themes,
    sommaire: d.summary,
    extrait: d.text?.slice(0, 4_000),
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0, // scoring déterministe autant que possible
    messages: [
      { role: 'system', content: SCORING_SYSTEM },
      { role: 'user', content: JSON.stringify(payload) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'scores', strict: true, schema: SCORE_JSON_SCHEMA },
    },
  })

  const message = response.choices[0]?.message
  if (message?.refusal) throw new Error(`Scoring refusé : ${message.refusal}`)
  const content = message?.content
  if (!content) {
    throw new Error(`Scoring : réponse vide (finish_reason=${response.choices[0]?.finish_reason})`)
  }
  const parsed = scoreResultSchema.parse(JSON.parse(content))

  const byId = new Map(parsed.scores.map((s) => [s.id, s]))
  return candidates
    .map((d) => {
      const s = byId.get(d.id)
      return { ...d, score: s?.score ?? 0, pourquoi: s?.pourquoi ?? '', angle: s?.angle ?? '' }
    })
    .sort((a, b) => b.score - a.score)
}

// ---------------------------------------------------------------------------
// Digest email (Resend) — envoyé même vide : signal que la chaîne est vivante
// ---------------------------------------------------------------------------

/** Page publique de la décision sur le site de la Cour de cassation. */
const decisionUrl = (d: Decision): string => `https://www.courdecassation.fr/decision/${d.id}`

const CHAMBRES: Record<string, string> = {
  civ3: '3e chambre civile',
  comm: 'Chambre commerciale',
}

/** Nb max de décisions détaillées dans le corps du mail (les autres = simple compteur). */
const MAX_LISTED = 5

/** Un brouillon d'article est créé pour toute décision de score STRICTEMENT supérieur. */
const DRAFT_MIN_SCORE = 7

/** Nom de fichier .txt sûr pour une décision. */
function attachmentName(d: Decision): string {
  const base = `${d.chamber ?? 'cass'}-${d.decision_date ?? ''}-${d.number ?? d.id}`
  return `${base.replace(/[^\w.-]+/g, '_')}.txt`
}

function digestHtml(scored: Scored[], examined: number): string {
  if (scored.length === 0) {
    return `<p>Rien de pertinent cette semaine — 0 décision retenue sur ${examined} examinée(s) (Cass. civ. 3e + com., Bulletin).</p>`
  }
  const shown = scored.slice(0, MAX_LISTED)
  const items = shown
    .map(
      (d) => `<li style="margin-bottom:14px">
  <strong>[${d.score}/10]</strong> ${CHAMBRES[d.chamber ?? ''] ?? d.chamber ?? '?'} — ${d.decision_date ?? '?'} —
  <a href="${decisionUrl(d)}">n° ${d.number ?? d.id}</a> — texte intégral en pièce jointe<br>
  ${d.pourquoi}<br>
  <em>Angle d'article : ${d.angle}</em>${d.score > DRAFT_MIN_SCORE ? '<br><strong>→ brouillon créé dans Keystatic (à relire)</strong>' : ''}
</li>`,
    )
    .join('\n')
  const extra = scored.length - shown.length
  const extraNote =
    extra > 0
      ? `<p>+${extra} autre(s) décision(s) retenue(s), non détaillée(s) ici (score inférieur).</p>`
      : ''
  return `<p>${scored.length} décision(s) pertinente(s) sur ${examined} examinée(s) cette semaine :</p>
<ol>${items}</ol>${extraNote}
<p style="color:#666;font-size:13px">Veille automatique Judilibre (Cass. civ. 3e + com., Bulletin) — scores et angles générés par IA, à vérifier avant toute rédaction.</p>`
}

function digestText(scored: Scored[], examined: number): string {
  if (scored.length === 0) {
    return `Rien de pertinent cette semaine — 0 décision retenue sur ${examined} examinée(s).`
  }
  const shown = scored.slice(0, MAX_LISTED)
  const body = shown
    .map(
      (d) =>
        `[${d.score}/10] ${d.chamber ?? '?'} ${d.decision_date ?? '?'} n° ${d.number ?? d.id}\n${decisionUrl(d)}\n${d.pourquoi}\nAngle : ${d.angle}${d.score > DRAFT_MIN_SCORE ? '\n→ brouillon créé dans Keystatic (à relire)' : ''}`,
    )
    .join('\n\n')
  const extra = scored.length - shown.length
  return extra > 0 ? `${body}\n\n+${extra} autre(s) décision(s) retenue(s), non détaillée(s).` : body
}

async function sendDigest(scored: Scored[], examined: number): Promise<void> {
  const resend = new Resend(requireEnv('RESEND_API_KEY'))
  const to = requireEnv('VEILLE_TO').split(',').map((s) => s.trim())
  const semaine = isoDate(new Date())

  // PJ .txt : uniquement les décisions détaillées dans le corps (les MAX_LISTED premières),
  // et seulement si le texte intégral est disponible (Judilibre le fournit dans /export).
  const attachments = scored
    .slice(0, MAX_LISTED)
    .filter((d) => d.text?.trim())
    .map((d) => ({ filename: attachmentName(d), content: Buffer.from(d.text as string, 'utf8') }))

  const { error } = await resend.emails.send({
    from: 'Veille baux commerciaux <noreply@behaghel-avocat.com>',
    to,
    subject: `Veille jurisprudence — ${scored.length} décision(s) — semaine du ${semaine}`,
    html: digestHtml(scored, examined),
    text: digestText(scored, examined),
    ...(attachments.length > 0 ? { attachments } : {}),
  })
  if (error) throw new Error(`Resend : ${error.message}`)
  console.log(`Digest envoyé à ${to.join(', ')} (${attachments.length} PJ)`)
}

// ---------------------------------------------------------------------------
// Brouillons d'articles (draft:true) — écrits pour les décisions score > 7.
// Le CONTENU est un squelette : la vraie rédaction viendra dans une phase suivante.
// On écrit le fichier ; le commit/push est fait par une étape git du workflow.
// ---------------------------------------------------------------------------

const ARTICLES_DIR = 'src/content/articles'

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents (diacritiques combinants)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/** Scalaire YAML sûr (double-quoted : échappe " \\ et les sauts de ligne). */
const yamlStr = (s: string): string => JSON.stringify(s)

// -- Rédaction de l'article (LLM, ancrée sur le texte intégral de l'arrêt) --

const SERVICE_PAGES = [
  '/baux-commerciaux/negociation',
  '/baux-commerciaux/vie-du-bail',
  '/baux-commerciaux/contentieux',
  '/baux-commerciaux/fin-de-bail',
  '/baux-commerciaux/cession-fonds-actions',
  '/baux-commerciaux/formations',
]

const articleSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  body_markdown: z.string(),
})
type Article = z.infer<typeof articleSchema>

const ARTICLE_JSON_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: "La question concrète que l'arrêt tranche" },
    excerpt: { type: 'string', description: 'Réponse directe en 1-2 phrases (le chapô)' },
    body_markdown: { type: 'string', description: 'Corps de l\'article en Markdown simple' },
  },
  required: ['title', 'excerpt', 'body_markdown'],
  additionalProperties: false,
} as const

const GEN_SYSTEM = `Tu es avocate en droit des baux commerciaux. À partir du TEXTE INTÉGRAL d'un arrêt de la Cour de cassation fourni, rédige un article court de blog juridique pour le site du cabinet, destiné à ses clients (bailleurs ET preneurs, commerçants, investisseurs).

Règles de fond (impératives) :
- Fonde TOUT ce que tu affirmes SUR CET ARRÊT strictement sur le texte fourni : la solution retenue, les articles visés, les faits. N'invente JAMAIS un numéro d'article, une date, un montant, une règle ou une portée qui ne figure pas dans le texte.
- Contexte juridique général (définitions, mécanismes) : factuel et standard ; en cas de doute, reste général plutôt que précis.
- Contenu factuel et pédagogique — jamais un avis juridique personnalisé.
- Déontologie : n'emploie jamais « spécialiste » ni « spécialisé » (dis « expert »).

Format de sortie :
- title : la QUESTION concrète que l'arrêt tranche (pas « Commentaire de l'arrêt… »).
- excerpt : la réponse directe, 1-2 phrases.
- body_markdown : Markdown SIMPLE UNIQUEMENT — titres ## et ###, **gras**, *italique*, listes à puces, liens [texte](/chemin), citations avec >, séparateur ---. INTERDIT : tableaux, images, blocs de code (\`\`\`), titres de niveau 1 (#).
  Structure : réponse directe d'entrée de jeu, puis « Ce que dit l'arrêt », puis « Ce que ça change en pratique », et termine par 1 à 2 liens internes vers la page service la plus pertinente parmi : ${SERVICE_PAGES.join(', ')}.`

async function generateArticle(openai: OpenAI, d: Scored): Promise<Article> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.3,
    messages: [
      { role: 'system', content: GEN_SYSTEM },
      {
        role: 'user',
        content: JSON.stringify({
          chambre: d.chamber,
          date: d.decision_date,
          numero: d.number,
          angle_suggere: d.angle,
          texte_integral: d.text,
        }),
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'article', strict: true, schema: ARTICLE_JSON_SCHEMA },
    },
  })
  const content = res.choices[0]?.message?.content
  if (!content) throw new Error('Génération article : réponse vide')
  return articleSchema.parse(JSON.parse(content))
}

// -- Passe anti-hallucination : liste les affirmations non étayées par la source --

const checkSchema = z.object({
  verdict: z.enum(['ok', 'a_verifier']),
  problemes: z.array(z.object({ extrait: z.string(), probleme: z.string() })),
})
type Checks = z.infer<typeof checkSchema>

const CHECK_JSON_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['ok', 'a_verifier'] },
    problemes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          extrait: { type: 'string', description: "Passage de l'article en cause" },
          probleme: { type: 'string', description: 'En quoi ce n\'est pas étayé par la source' },
        },
        required: ['extrait', 'probleme'],
        additionalProperties: false,
      },
    },
  },
  required: ['verdict', 'problemes'],
  additionalProperties: false,
} as const

const CHECK_SYSTEM = `Tu vérifies un brouillon d'article juridique contre le TEXTE SOURCE d'un arrêt. 
Liste UNIQUEMENT les affirmations de l'article qui attribuent à CET arrêt un élément (solution, numéro d'article, fait, date, montant, portée) NON étayé par le texte source. 
Ignore le contexte juridique général s'il est correct. Pour chaque problème : l'extrait fautif + la nature du problème. 
Si tout est étayé, renvoie une liste vide et verdict "ok" ; sinon verdict "a_verifier".`

async function verifyArticle(openai: OpenAI, d: Scored, article: Article): Promise<Checks> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0,
    messages: [
      { role: 'system', content: CHECK_SYSTEM },
      { role: 'user', content: JSON.stringify({ article, texte_source: d.text }) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'verification', strict: true, schema: CHECK_JSON_SCHEMA },
    },
  })
  const content = res.choices[0]?.message?.content
  if (!content) throw new Error('Vérification article : réponse vide')
  return checkSchema.parse(JSON.parse(content))
}

// -- Assemblage du .mdoc --

function draftMdoc(d: Scored, article: Article | null, checks: Checks | null): string {
  const chambre = CHAMBRES[d.chamber ?? ''] ?? d.chamber ?? 'Cour de cassation'
  const source = `Source : [${chambre} — n° ${d.number ?? d.id}](${decisionUrl(d)}), arrêt du ${d.decision_date ?? '?'}.`
  const front = (title: string, excerpt: string, readingTime: string) => `---
title: ${yamlStr(title)}
publishedDate: ${isoDate(new Date())}
category: "Jurisprudence"
readingTime: ${yamlStr(readingTime)}
excerpt: ${yamlStr(excerpt)}
featured: false
draft: true
---`

  // Fallback : pas de texte source → squelette minimal (rare).
  if (!article) {
    return `${front(d.angle || `Décision ${d.number ?? d.id}`, d.pourquoi || 'Brouillon à compléter.', '')}

> Brouillon — texte de l'arrêt indisponible, à rédiger manuellement.

${source}
`
  }

  const words = article.body_markdown.split(/\s+/).filter(Boolean).length
  const readingTime = `${Math.max(1, Math.round(words / 200))} min de lecture`
  const caveat =
    checks?.verdict === 'a_verifier' && checks.problemes.length > 0
      ? `**⚠️ À vérifier avant publication** — points possiblement non étayés par l'arrêt :\n\n${checks.problemes
        .map((p) => `- « ${p.extrait} » — ${p.probleme}`)
        .join('\n')}\n\n---\n\n`
      : ''

  return `${front(article.title, article.excerpt, readingTime)}

> Brouillon généré automatiquement — à relire et vérifier avant publication.

${caveat}${article.body_markdown}

---

${source}
`
}

/**
 * Pour chaque décision score>7 : rédige l'article (ancré sur le texte de l'arrêt) + vérifie,
 * puis écrit le .mdoc (draft:true). En dry-run : génère + affiche, n'écrit rien.
 * Ne clobbe jamais un fichier existant. Retourne les slugs créés.
 */
async function writeDrafts(draftable: Scored[], dryRun: boolean): Promise<string[]> {
  if (draftable.length === 0) return []
  const openai = new OpenAI()
  const created: string[] = []
  for (const d of draftable) {
    // ponytail: slug stable par décision (chambre+numéro) → dédup par existence de fichier
    // (fenêtre 8 j > cron 7 j = chevauchement possible). Limite : si Victoire renomme le slug
    // à la publication, un doublon peut réapparaître (suppression d'un clic).
    const slug = slugify(`${d.chamber ?? 'cass'}-${d.number ?? d.id}`)
    const file = join(ARTICLES_DIR, `${slug}.mdoc`)
    if (!dryRun && existsSync(file)) {
      console.log(`  brouillon déjà présent, ignoré : ${slug}`)
      continue
    }
    // ponytail: on fait confiance à l'instruction pour rester en Markdown simple ; un rare
    // nœud non supporté serait vu par Victoire à la relecture. Sanitize à ajouter si besoin.
    const article = d.text?.trim() ? await generateArticle(openai, d) : null
    const checks = article ? await verifyArticle(openai, d, article) : null
    const mdoc = draftMdoc(d, article, checks)
    if (dryRun) {
      console.log(`\n----- BROUILLON (dry-run) ${slug} — vérif : ${checks?.verdict ?? 'squelette'} -----`)
      console.log(mdoc)
      continue
    }
    writeFileSync(file, mdoc, 'utf8')
    created.push(slug)
    console.log(`  brouillon créé : ${file} (vérif : ${checks?.verdict ?? 'squelette'})`)
  }
  return created
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

  const scored = candidates.length > 0 ? await scoreCandidates(candidates) : []
  for (const d of scored) {
    console.log(`- [${d.score}/10] ${d.chamber ?? '?'} ${d.decision_date ?? '?'} n° ${d.number ?? d.id} — ${d.angle}`)
  }

  const draftable = scored.filter((d) => d.score > DRAFT_MIN_SCORE)

  if (process.env.VEILLE_DRY_RUN === '1') {
    console.log(
      `\nDRY RUN — email non envoyé. ${draftable.length} brouillon(s) prévisualisé(s) (score > ${DRAFT_MIN_SCORE}) :`,
    )
    await writeDrafts(draftable, true)
    console.log('\nAperçu texte du mail :\n')
    console.log(digestText(scored, decisions.length))
    return
  }

  const created = await writeDrafts(draftable, false)
  console.log(`${created.length} brouillon(s) écrit(s) (score > ${DRAFT_MIN_SCORE}).`)
  await sendDigest(scored, decisions.length)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

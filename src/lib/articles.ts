import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../../keystatic.config'

// Lecture build-time des articles Keystatic (stockage local).
const reader = createReader(process.cwd(), keystaticConfig)

export interface ArticleListItem {
  slug: string
  title: string
  publishedDate: string
  category: string
  readingTime: string
  excerpt: string
  featured: boolean
  coverImage: string | null
}

// Les brouillons (draft:true, générés par la veille) sont exclus PARTOUT côté public :
// liste, accueil, « à lire aussi », generateStaticParams (pas de page détail) et sitemap.
// Ils ne restent visibles/éditables que dans l'éditeur Keystatic.
export async function getAllArticles(): Promise<ArticleListItem[]> {
  const entries = await reader.collections.articles.all()
  return entries
    .filter((e) => !e.entry.draft)
    .map((e) => ({
      slug: e.slug,
      title: e.entry.title,
      publishedDate: e.entry.publishedDate ?? '',
      category: e.entry.category,
      readingTime: e.entry.readingTime,
      excerpt: e.entry.excerpt,
      featured: e.entry.featured,
      coverImage: e.entry.coverImage,
    }))
    .sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1))
}

// Dérivé de getAllArticles → hérite du filtre brouillons (utilisé par
// generateStaticParams ET le sitemap : un brouillon n'a donc aucune URL publique).
export async function getArticleSlugs(): Promise<string[]> {
  return (await getAllArticles()).map((a) => a.slug)
}

const MOIS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

// 'YYYY-MM-DD' -> '27 novembre 2025'. Pas de Date() (rendu statique déterministe).
export function formatFrenchDate(iso: string): string {
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const [y, m, d] = parts
  const mois = MOIS_FR[Number.parseInt(m, 10) - 1]
  if (!mois) return iso
  return `${Number.parseInt(d, 10)} ${mois} ${y}`
}

// --- FAQ dérivée du corps (pour le JSON-LD FAQPage) ---
// Pas de champ FAQ dédié dans Keystatic : on extrait les paires Q/R directement
// de la section « FAQ » rédigée dans le contenu. Une seule source de vérité.
interface DocNode {
  type?: string
  level?: number
  text?: string
  children?: DocNode[]
}

// Texte brut d'un nœud (récursif : traverse liens, gras, listes…).
function nodeText(node: DocNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

// Extrait les questions/réponses de la section FAQ. Retourne [] si absente.
// Convention : un H2 « FAQ » (ou « Questions fréquentes »), puis des H3 (questions)
// suivis de paragraphes (réponse). La section s'arrête au H2 suivant.
export function extractFaq(content: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(content)) return []
  const nodes = content as DocNode[]
  const start = nodes.findIndex(
    (n) => n.type === 'heading' && /^(faq|questions? fréquentes?)/i.test(nodeText(n).trim()),
  )
  if (start === -1) return []

  const faq: { question: string; answer: string }[] = []
  let current: { question: string; answer: string } | null = null
  for (const node of nodes.slice(start + 1)) {
    if (node.type === 'heading') {
      if ((node.level ?? 1) <= 2) break // H2 suivant = fin de la FAQ
      if (current) faq.push(current)
      current = { question: nodeText(node).trim(), answer: '' }
    } else if (current) {
      const text = nodeText(node).trim()
      if (text) current.answer = current.answer ? `${current.answer} ${text}` : text
    }
  }
  if (current) faq.push(current)
  return faq.filter((qa) => qa.question && qa.answer)
}

// Retourne les métadonnées + le contenu résolu (DocumentElement[]) pour le rendu.
export async function getArticle(slug: string) {
  const entry = await reader.collections.articles.read(slug)
  if (!entry) return null
  if (entry.draft) return null // brouillon → 404 même si l'URL est devinée
  const content = await entry.content()
  return {
    slug,
    title: entry.title,
    publishedDate: entry.publishedDate ?? '',
    category: entry.category,
    readingTime: entry.readingTime,
    excerpt: entry.excerpt,
    coverImage: entry.coverImage,
    content,
  }
}

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

export async function getAllArticles(): Promise<ArticleListItem[]> {
  const entries = await reader.collections.articles.all()
  return entries
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

export async function getArticleSlugs(): Promise<string[]> {
  return reader.collections.articles.list()
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

// Retourne les métadonnées + le contenu résolu (DocumentElement[]) pour le rendu.
export async function getArticle(slug: string) {
  const entry = await reader.collections.articles.read(slug)
  if (!entry) return null
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

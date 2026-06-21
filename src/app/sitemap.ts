import type { MetadataRoute } from 'next'
import { getArticleSlugs } from '@/lib/articles'
import { SECTEURS } from '@/lib/secteurs-data'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'

// Sitemap dynamique — routes réelles (CLAUDE.md §4) + secteurs + articles Keystatic.
const STATIC_PATHS = [
  '/',
  '/a-propos',
  '/baux-commerciaux',
  '/baux-commerciaux/negociation',
  '/baux-commerciaux/vie-du-bail',
  '/baux-commerciaux/contentieux',
  '/baux-commerciaux/fin-de-bail',
  '/baux-commerciaux/cession-fonds-actions',
  '/baux-commerciaux/formations',
  '/honoraires',
  '/contact',
  '/actualites',
  '/mentions-legales',
  '/confidentialite',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getArticleSlugs()
  const paths = [
    ...STATIC_PATHS,
    ...SECTEURS.map((s) => s.canonical),
    ...slugs.map((slug) => `/actualites/${slug}`),
  ]
  return paths.map((path) => ({ url: `${SITE.url}${path}` }))
}

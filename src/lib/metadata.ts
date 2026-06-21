import type { Metadata } from 'next'
import { SITE } from './site'

interface PageMetaInput {
  /** Titre EXACT de la maquette (inclut « | Victoire Behaghel »). Posé en absolu. */
  title: string
  description: string
  /** Chemin absolu depuis la racine, ex. '/baux-commerciaux/negociation'. */
  path: string
  ogType?: 'website' | 'article'
  /** Chemin image OG sous /assets, ex. '/assets/og-negociation.jpg'. */
  ogImage?: string
}

// Helper generateMetadata — title/description/canonical/openGraph (CLAUDE.md §5).
export function pageMetadata({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = '/assets/og-accueil.jpg',
}: PageMetaInput): Metadata {
  const url = `${SITE.url}${path}`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'fr_FR',
    },
    twitter: { card: 'summary_large_image' },
  }
}

import type { Metadata } from 'next'
import { SITE } from './site'

/** Image d'aperçu social unique du site — générée par `scripts/og-image.mjs`. */
export const OG_DEFAUT = '/assets/og-default.jpg'

interface PageMetaInput {
  /** Titre EXACT de la maquette (inclut « | Victoire Behaghel »). Posé en absolu. */
  title: string
  description: string
  /** Chemin absolu depuis la racine, ex. '/baux-commerciaux/negociation'. */
  path: string
  ogType?: 'website' | 'article'
  /**
   * Chemin image OG sous /assets. Le défaut couvre tout le site ; ne le surcharger
   * que si la page possède un visuel propre (cas des articles avec `coverImage`).
   */
  ogImage?: string
}

// Helper generateMetadata — title/description/canonical/openGraph (CLAUDE.md §5).
export function pageMetadata({
  title,
  description,
  path,
  ogType = 'website',
  ogImage = OG_DEFAUT,
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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          // L'alt décrit l'image réellement servie : le visuel de marque par défaut,
          // ou la couverture de l'article quand la page en fournit une.
          alt:
            ogImage === OG_DEFAUT
              ? 'Victoire Behaghel, avocate en baux commerciaux au Barreau de Lyon'
              : title,
        },
      ],
      locale: 'fr_FR',
    },
    twitter: { card: 'summary_large_image' },
  }
}

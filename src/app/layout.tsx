import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE } from '@/lib/site'
import '@/styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Avocate en baux commerciaux à Lyon — Conseil & contentieux | Victoire Behaghel',
    template: '%s — Victoire Behaghel, Avocate',
  },
  description:
    'Cabinet Victoire Behaghel, avocate dédiée au bail commercial : conseil et contentieux à chaque étape. Lyon, partout en France.',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: SITE.name },
  twitter: { card: 'summary_large_image' },
}

// Root layout minimal : le chrome public (Header/Footer) vit dans (site)/layout.tsx,
// pour que /keystatic et /api n'en héritent pas.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

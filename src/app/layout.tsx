import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

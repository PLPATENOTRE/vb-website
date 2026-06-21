import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/styles/globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://behaghel-avocat.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Victoire Behaghel — Avocate en baux commerciaux à Lyon',
    template: '%s — Victoire Behaghel, Avocate',
  },
  description:
    'Cabinet Victoire Behaghel, avocate dédiée au bail commercial : conseil et contentieux à chaque étape. Lyon, partout en France.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

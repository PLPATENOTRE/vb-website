import type { Metadata } from 'next'
import { SecteurView } from '@/components/pages/SecteurView'
import { pageMetadata } from '@/lib/metadata'
import { getSecteur } from '@/lib/secteurs-data'

const secteur = getSecteur('hotelier')

export const dynamic = 'force-static'

export const metadata: Metadata = pageMetadata({
  title: secteur.title,
  description: secteur.description,
  path: secteur.canonical,
  ogType: 'article',
  ogImage: `/assets/og-${secteur.slug}.jpg`,
})

export default function Page() {
  return <SecteurView secteur={secteur} />
}

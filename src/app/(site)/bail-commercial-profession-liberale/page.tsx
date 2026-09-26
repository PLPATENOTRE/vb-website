import type { Metadata } from 'next'
import { SecteurView } from '@/components/pages/SecteurView'
import { pageMetadata } from '@/lib/metadata'
import { getSecteur } from '@/lib/secteurs-data'

const secteur = getSecteur('profession-liberale')

export const dynamic = 'force-static'

export const metadata: Metadata = pageMetadata({
  title: secteur.title,
  description: secteur.description,
  path: secteur.canonical,
})

export default function Page() {
  return <SecteurView secteur={secteur} />
}

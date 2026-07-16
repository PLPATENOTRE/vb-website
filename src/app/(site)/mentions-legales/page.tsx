import type { Metadata } from 'next'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { pageMetadata } from '@/lib/metadata'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata: Metadata = pageMetadata({
  title: 'Mentions légales | Victoire Behaghel, Avocate',
  description:
    'Mentions légales du cabinet Victoire Behaghel, avocate en baux commerciaux au Barreau de Lyon.',
  path: '/mentions-legales',
})

// Stub structuré — contenu réel à compléter par le cabinet (CLAUDE.md §6 : ne rien inventer).
export default function MentionsLegalesPage() {
  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Mentions légales', href: '/mentions-legales' },
        ]}
      />
      <section className="mx-auto max-w-[820px] px-6 py-12 md:px-14">
        <h1 className="mb-8 font-cormorant text-[44px] font-semibold leading-none text-forest md:text-[56px]">
          Mentions légales
        </h1>
        <div className="flex flex-col gap-8 font-mulish text-[16px] leading-[1.85] text-[#3f4d44]">
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">Éditeur</h2>
            <p className="m-0">
              {SITE.founder}, {SITE.jobTitle}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.postalCode} {SITE.address.city}
              <br />
              Téléphone : {SITE.phoneDisplay}
              <br />
              Barreau et numéro d&apos;inscription : [À compléter]
              <br />
              SIRET / TVA intracommunautaire : [À compléter]
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">
              Directrice de la publication
            </h2>
            <p className="m-0">{SITE.founder}</p>
          </div>
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">
              Hébergement
            </h2>
            <p className="m-0">
              Google Firebase App Hosting (Google Cloud), [adresse de l&apos;hébergeur à compléter].
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">
              Propriété intellectuelle
            </h2>
            <p className="m-0">
              L&apos;ensemble des contenus de ce site (textes, identité visuelle) est protégé. Toute
              reproduction sans autorisation est interdite.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

import Link from 'next/link'
import { ContactForm } from '@/components/forms/ContactForm'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { pageMetadata } from '@/lib/metadata'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Contact — Prenons rendez-vous | Victoire Behaghel, Avocate',
  description:
    'Décrivez votre situation en quelques lignes : premier échange gratuit, sans engagement. Avocate en baux commerciaux à Lyon, intervention partout en France.',
  path: '/contact',
  ogType: 'website',
  ogImage: '/assets/og-contact.jpg',
})

export default function ContactPage() {
  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />

      {/* Intro */}
      <section className="mx-auto max-w-[1280px] px-6 pb-2 pt-14 md:px-14">
        <p className="mb-[18px] font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Contact
        </p>
        <h1 className="mb-4 font-cormorant text-[52px] font-semibold leading-[1] tracking-[-0.5px] text-forest md:text-[74px]">
          Prenons rendez-vous
        </h1>
        <p className="m-0 max-w-[620px] font-mulish text-[16px] leading-[1.8] text-[#4f574f]">
          Décrivez votre situation en quelques lignes : je reviens vers vous rapidement pour
          convenir d'un premier échange.
        </p>
      </section>

      {/* Grille contact */}
      <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-12 md:px-14">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.1fr]">
          {/* Colonne gauche — coordonnées */}
          <div className="flex flex-col gap-8">
            {/* Adresse */}
            <div>
              <p className="mb-2 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                Adresse
              </p>
              <address className="not-italic font-cormorant text-[24px] leading-[1.4] text-forest">
                ALGYR Centre d'affaires
                <br />
                20, boulevard Eugène Deruelle
                <br />
                {SITE.address.postalCode} {SITE.address.city}
              </address>
            </div>

            {/* Téléphone + Réseau */}
            <div className="flex flex-wrap gap-12">
              <div>
                <p className="mb-2 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                  Téléphone
                </p>
                <a
                  href={`tel:${SITE.phone}`}
                  className="font-cormorant text-[24px] text-forest transition-colors hover:text-rose"
                >
                  {SITE.phoneDisplay}
                </a>
              </div>
              <div>
                <p className="mb-2 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                  Réseau
                </p>
                <Link
                  href={SITE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-cormorant text-[24px] text-forest transition-colors hover:text-rose"
                >
                  LinkedIn
                </Link>
              </div>
            </div>

            {/* Placeholder plan */}
            <div className="flex h-[300px] items-center justify-center rounded-lg bg-sand">
              <span className="rounded bg-cream/80 px-3 py-1 font-mulish text-[11px] uppercase tracking-[2px] text-[#9b9588]">
                Plan — Lyon 3ᵉ
              </span>
            </div>

            {/* Intervention France */}
            <div className="rounded-lg bg-sand px-6 py-6">
              <p className="mb-1.5 font-cormorant text-[22px] font-semibold text-forest">
                Intervention partout en France
              </p>
              <p className="m-0 font-mulish text-[14px] leading-[1.7] text-[#4f574f]">
                Basée à Lyon, je me déplace dans vos locaux pour comprendre le contexte de chaque
                dossier.
              </p>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <ContactForm />
        </div>
      </section>
    </>
  )
}

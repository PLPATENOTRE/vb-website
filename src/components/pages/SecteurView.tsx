import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import type { Secteur } from '@/lib/secteurs-data'

interface SecteurViewProps {
  secteur: Secteur
}

// Rendu partagé des 7 pages secteur. Le routage est assuré par 7 dossiers
// explicites bail-commercial-<slug>/ (les segments dynamiques Next ne peuvent
// pas mixer texte statique + crochet dans un même segment).
export function SecteurView({ secteur: s }: SecteurViewProps) {
  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Baux commerciaux', href: '/baux-commerciaux' },
          { name: s.h1, href: s.canonical },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-14 md:px-14">
        <p className="mb-4 font-mulish text-xs uppercase tracking-[3px] text-rose">{s.surtitre}</p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[52px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          {s.h1}
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[19px] leading-[1.7] text-[#4f574f]">
          {s.chapo}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-full bg-forest px-8 py-4 font-mulish text-sm font-bold uppercase tracking-[1.4px] text-cream transition-opacity hover:opacity-90"
          >
            {s.ctaLabel}
          </a>
          <a
            href="/baux-commerciaux"
            className="border-b border-rose pb-1 font-mulish text-sm font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
          >
            Toutes les expertises
          </a>
        </div>
      </section>

      {/* En bref */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-11 md:px-14">
        <EnBref items={s.enBref} />
      </section>

      {/* Body + sidebar */}
      <section className="mx-auto grid max-w-[1080px] gap-16 px-6 pb-[70px] pt-2 md:px-14 lg:grid-cols-[1fr_300px]">
        <div>
          {s.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="mb-4 mt-[46px] font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
                {section.heading}
              </h2>
              {section.body.split('\n\n').map((para) => (
                <p
                  key={para}
                  className="mb-[18px] font-mulish text-[17px] leading-[1.85] text-[#3f4d44]"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Sticky sidebar CTA */}
        <aside>
          <div className="sticky top-[104px] flex flex-col gap-6">
            <div className="rounded-[10px] bg-forest p-7">
              <p className="mb-3 font-cormorant text-2xl font-semibold leading-tight text-cream">
                Analyser votre bail
              </p>
              <p className="mb-5 font-mulish text-sm leading-[1.7] text-[#9fb0a4]">
                Un premier échange pour faire le point sur votre situation.
              </p>
              <a
                href="/contact"
                className="block rounded-full bg-mint py-3 text-center font-mulish text-xs font-bold uppercase tracking-[1.2px] text-forest-dark transition-opacity hover:opacity-90"
              >
                Prendre rendez-vous
              </a>
            </div>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <FaqSection items={s.faq} />

      {/* Service JSON-LD */}
      <JsonLd
        data={serviceJsonLd({
          name: s.serviceName,
          description: s.serviceDescription,
          path: s.canonical,
        })}
      />

      {/* CTA bas de page */}
      <CtaBox />
    </>
  )
}

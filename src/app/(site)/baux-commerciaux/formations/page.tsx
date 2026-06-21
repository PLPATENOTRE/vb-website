import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Formations sur le bail commercial — Avocate à Lyon | Victoire Behaghel',
  description:
    'Formations sur mesure sur le bail commercial pour équipes, réseaux et gestionnaires : statut, clauses sensibles, révision du loyer, fin de bail. Cas pratiques, en intra ou à distance. Lyon, partout en France.',
  path: '/baux-commerciaux/formations',
  ogType: 'article',
  ogImage: '/assets/og-formations.jpg',
})

const EN_BREF_ITEMS = [
  {
    label: 'Pour qui',
    content: 'Réseaux, foncières, gestionnaires, équipes immobilières ou juridiques',
  },
  {
    label: 'Format',
    content: 'Sur mesure, en intra-entreprise ou à distance, cas pratiques',
  },
  {
    label: 'Thèmes',
    content: 'Statut, clauses, charges, révision, fin de bail, éviction',
  },
  {
    label: 'Où',
    content: 'Cabinet à Lyon — intervention partout en France',
  },
]

const FAQ_ITEMS = [
  {
    question: "À qui s'adressent les formations ?",
    answer:
      'Aux équipes confrontées au bail commercial : réseaux, foncières, gestionnaires, services immobiliers ou juridiques, organisations professionnelles.',
  },
  {
    question: 'Les sessions sont-elles personnalisées ?',
    answer:
      'Oui : le programme part de vos enjeux et de cas pratiques réels, en intra ou à distance, avec une durée adaptée.',
  },
  {
    question: 'Quels thèmes sont couverts ?',
    answer:
      "Statut, clauses sensibles, charges, révision et indexation, cession, fin de bail et indemnité d'éviction.",
  },
]

export default function FormationsPage() {
  return (
    <>
      {/* JSON-LD Service */}
      <JsonLd
        data={serviceJsonLd({
          name: 'Formation sur le bail commercial',
          description:
            'Sessions de formation sur mesure sur le bail commercial, fondées sur des cas pratiques, en intra-entreprise ou à distance.',
          path: '/baux-commerciaux/formations',
          serviceType: 'Formation sur le bail commercial',
        })}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1080px] px-6 pt-8 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            { name: 'Formations', href: '/baux-commerciaux/formations' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-8 md:px-14">
        <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Expertise · Transmission
        </p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[42px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          Formations sur le bail commercial
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          Donner à vos équipes les bons réflexes sur le bail commercial : sessions sur mesure,
          ancrées dans des cas concrets, pour décider plus vite et limiter les risques.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
          >
            Demander un programme
          </a>
          <a
            href="/baux-commerciaux"
            className="border-b border-rose pb-1 font-mulish text-[14px] font-semibold tracking-[1px] text-forest"
          >
            Toutes les expertises
          </a>
        </div>
      </section>

      {/* En bref */}
      <section className="mx-auto max-w-[1080px] px-6 pt-10 md:px-14">
        <EnBref items={EN_BREF_ITEMS} />
      </section>

      {/* Body + Aside */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 pt-2 md:px-14">
        <div className="grid gap-[60px] lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div>
            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              À qui s'adressent ces formations ?
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Aux organisations qui vivent quotidiennement avec le bail commercial : réseaux et
              enseignes, foncières et bailleurs, gestionnaires de patrimoine, services immobiliers
              ou juridiques, et organisations professionnelles souhaitant outiller leurs membres. Le
              contenu s'adapte au niveau et aux fonctions des participants.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Une pédagogie par cas concrets
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Plutôt qu'un exposé théorique, je pars de situations réelles : une clause à
              interpréter, une révision à anticiper, un congé à sécuriser. Les participants
              repartent avec des réflexes opérationnels et des points de vigilance directement
              utilisables.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Thèmes abordés
            </h2>
            <ul className="mb-5 space-y-[10px]">
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                Le statut des baux commerciaux : ce qui est d'ordre public, ce qui se négocie.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                Les clauses sensibles : destination, charges (loi Pinel), travaux, garanties.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                La vie du bail : révision triennale, indexation (ILC, ILAT), cession, sous-location.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                La fin de bail : renouvellement, congé, refus et indemnité d'éviction.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                Les réflexes en cas de litige et l'articulation amiable / judiciaire.
              </li>
            </ul>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Un format sur mesure
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Durée, niveau et exemples sont définis avec vous, en amont. Les sessions se tiennent
              en intra-entreprise ou à distance. Décrivez votre besoin : je vous propose un
              programme adapté.
            </p>

            {/* FAQ */}
            <FaqSection items={FAQ_ITEMS} title="Questions fréquentes" />
          </div>

          {/* Aside */}
          <aside>
            <div className="flex flex-col gap-6 lg:sticky lg:top-[104px]">
              {/* CTA card */}
              <div className="rounded-[10px] bg-forest p-[26px]">
                <p className="mb-3 font-cormorant text-[24px] font-semibold leading-[1.15] text-cream">
                  Former vos équipes ?
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Parlez-moi de vos enjeux : je construis un programme sur mesure.
                </p>
                <a
                  href="/contact"
                  className="block rounded-[30px] bg-mint py-[13px] text-center font-mulish text-[13px] font-bold uppercase tracking-[1.2px] text-forest-dark"
                >
                  Demander un programme
                </a>
                <p className="mt-3 text-center font-mulish text-[13px] text-[#9fb0a4]">
                  06 50 05 89 73
                </p>
              </div>

              {/* Related expertises */}
              <div>
                <p className="mb-4 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                  Expertises liées
                </p>
                <a
                  href="/baux-commerciaux/negociation"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Négociation du contrat de bail
                </a>
                <a
                  href="/baux-commerciaux/vie-du-bail"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  La vie du bail
                </a>
                <a
                  href="/baux-commerciaux/fin-de-bail"
                  className="block border-b border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Fin de bail &amp; indemnité d'éviction
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA bottom */}
      <CtaBox />
    </>
  )
}

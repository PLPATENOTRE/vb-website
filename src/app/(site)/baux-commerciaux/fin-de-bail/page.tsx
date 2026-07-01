import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: "Renouvellement, congé et indemnité d'éviction — Avocate Lyon | Victoire Behaghel",
  description:
    "Fin de bail commercial : renouvellement, congé, refus de renouvellement et indemnité d'éviction (art. L.145-14). Anticiper les délais et sécuriser la procédure. Avocate à Lyon, partout en France.",
  path: '/baux-commerciaux/fin-de-bail',
  ogType: 'article',
  ogImage: '/assets/og-fin-de-bail.jpg',
})

const EN_BREF_ITEMS = [
  {
    label: 'Pour qui',
    content: "Toute partie à l'approche de l'échéance de son bail.",
  },
  {
    label: 'Ce que je traite',
    content: "Renouvellement, congé, refus, indemnité d'éviction.",
  },
  {
    label: 'Quand',
    content: "Plusieurs mois avant l'échéance, les délais sont stricts.",
  },
  {
    label: 'Où',
    content: 'Cabinet à Lyon, intervention partout en France.',
  },
]

const FAQ_ITEMS = [
  {
    question: "Quel délai pour donner congé d'un bail commercial ?",
    answer:
      "Le congé doit en principe être donné au moins six mois à l'avance et pour l'échéance, par acte d'huissier (commissaire de justice) ou, dans certains cas, par lettre recommandée. Les délais sont stricts : mieux vaut les anticiper.",
  },
  {
    question: "Qu'est-ce que l'indemnité d'éviction ?",
    answer:
      "Si le bailleur refuse le renouvellement sans motif grave et légitime ni droit de reprise, il doit en principe verser au preneur une indemnité d'éviction (article L.145-14 du Code de commerce), destinée à réparer le préjudice lié à la perte du local et du fonds.",
  },
  {
    question: 'Le renouvellement du bail commercial est-il automatique ?',
    answer:
      "Non. Le preneur bénéficie d'un droit au renouvellement, mais celui-ci suppose le respect de la procédure (demande de renouvellement ou congé avec offre). À défaut, le bail se prolonge tacitement.",
  },
]

export default function FinDeBailPage() {
  return (
    <>
      {/* JSON-LD Service */}
      <JsonLd
        data={serviceJsonLd({
          name: "Fin de bail commercial : renouvellement, congé, indemnité d'éviction",
          description:
            "Renouvellement du bail, congé, refus de renouvellement et indemnité d'éviction.",
          path: '/baux-commerciaux/fin-de-bail',
          serviceType: "Fin de bail commercial : renouvellement, congé, indemnité d'éviction",
        })}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1080px] px-6 pt-8 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            { name: 'Fin de bail', href: '/baux-commerciaux/fin-de-bail' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-8 md:px-14">
        <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Expertise · Conseil &amp; contentieux
        </p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[42px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          Fin de bail : renouvellement, congé et indemnité d&apos;éviction
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          L&apos;échéance du bail est un moment décisif, encadré par des délais stricts.
          J&apos;anticipe la procédure de renouvellement ou de congé et, en cas de refus, défends
          votre droit à l&apos;indemnité d&apos;éviction.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
          >
            Préparer mon échéance
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
              Le droit au renouvellement
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Au terme du bail, le preneur bénéficie en principe d&apos;un{' '}
              <strong>droit au renouvellement</strong>, pilier de la « propriété commerciale ». Ce
              droit n&apos;est toutefois pas automatique : il suppose de respecter la procédure, par
              une demande de renouvellement émanant du preneur ou un congé avec offre de
              renouvellement délivré par le bailleur.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Le congé et ses délais
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Le <strong>congé</strong>&nbsp;met fin au bail à l&apos;échéance. Il doit en principe
              être donné <strong>au moins six mois à l&apos;avance</strong>, par acte de commissaire
              de justice (huissier) ou, dans certains cas, par lettre recommandée. Le non-respect
              des délais ou des formes peut rendre le congé inopérant : l&apos;anticipation est
              essentielle.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Le refus de renouvellement et l&apos;indemnité d&apos;éviction
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Le bailleur peut refuser le renouvellement, mais ce refus a un coût : sauf motif grave
              et légitime ou droit de reprise, il doit verser une{' '}
              <strong>indemnité d&apos;éviction</strong> (article L.145-14 du Code de commerce).
              Celle-ci vise à réparer le préjudice subi par le preneur : valeur du fonds, frais de
              réinstallation, indemnités accessoires. Son évaluation est souvent au cœur de la
              négociation ou du contentieux.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Mon intervention
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              J&apos;établis le calendrier des échéances, sécurise les actes (demande, congé,
              réponse), évalue l&apos;opportunité de chaque option et défends, le cas échéant, le
              montant de l&apos;indemnité d&apos;éviction devant le juge.
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
                  Une échéance approche ?
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Anticipons le calendrier pour préserver vos droits.
                </p>
                <a
                  href="/contact"
                  className="block rounded-[30px] bg-mint py-[13px] text-center font-mulish text-[13px] font-bold uppercase tracking-[1.2px] text-forest-dark"
                >
                  Prendre rendez-vous
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
                  href="/baux-commerciaux/contentieux"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Contentieux du bail commercial
                </a>
                <a
                  href="/baux-commerciaux/vie-du-bail"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Révision &amp; indexation du loyer
                </a>
                <a
                  href="/baux-commerciaux/negociation"
                  className="block border-b border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Négociation du contrat de bail
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

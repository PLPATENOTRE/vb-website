import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Négociation du bail commercial — Avocate à Lyon | Victoire Behaghel',
  description:
    'Sécuriser votre bail commercial avant la signature : destination, charges (loi Pinel), indexation, garanties, durée. Conseil et rédaction par une avocate dédiée. Lyon, partout en France.',
  path: '/baux-commerciaux/negociation',
  ogType: 'article',
  ogImage: '/assets/og-negociation.jpg',
})

const EN_BREF_ITEMS = [
  {
    label: 'Pour qui',
    content: 'Toute partie à un bail commercial, avant de signer ou de renouveler',
  },
  {
    label: 'Ce que je traite',
    content: 'Destination, durée, loyer & charges, travaux, garanties, indexation',
  },
  {
    label: 'Quand',
    content: 'Idéalement avant toute signature ou engagement ferme',
  },
  {
    label: 'Où',
    content: 'Cabinet à Lyon — intervention partout en France',
  },
]

const FAQ_ITEMS = [
  {
    question: 'Peut-on négocier un bail commercial type ?',
    answer:
      "Oui. Au-delà du statut d'ordre public, de nombreuses clauses — charges, travaux, garanties, indexation, destination — se négocient avant la signature.",
  },
  {
    question: 'Qui paie quelles charges ?',
    answer:
      "Depuis la loi Pinel (2014), le bail doit lister précisément charges, impôts et travaux ; certaines dépenses, dont les grosses réparations de l'article 606, ne peuvent être mises à la charge du preneur.",
  },
  {
    question: 'Quelle durée pour un bail commercial ?',
    answer:
      'En principe neuf ans, avec le plus souvent une faculté de résiliation à chaque échéance triennale (bail « 3-6-9 »).',
  },
]

export default function NegociationPage() {
  return (
    <>
      {/* JSON-LD Service */}
      <JsonLd
        data={serviceJsonLd({
          name: 'Négociation du contrat de bail commercial',
          description:
            "Conseil, négociation et rédaction des clauses d'un bail commercial avant signature : destination, durée, loyer et charges, travaux, garanties.",
          path: '/baux-commerciaux/negociation',
          serviceType: 'Négociation du contrat de bail commercial',
        })}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1080px] px-6 pt-8 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            { name: 'Négociation du bail', href: '/baux-commerciaux/negociation' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-8 md:px-14">
        <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Expertise · Conseil
        </p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[42px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          Négociation du contrat de bail commercial
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          Un bail commercial engage votre entreprise sur neuf ans. Avant la signature, chaque clause
          — destination, charges, indexation, garanties — pèse sur votre activité. Je négocie et
          sécurise votre bail pour qu'il protège durablement vos intérêts.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
          >
            Faire relire mon bail
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
              Pourquoi négocier son bail commercial ?
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Le bail commercial est régi par un statut protecteur d'ordre public (articles L.145-1
              et suivants du Code de commerce), mais il laisse une large place à la liberté
              contractuelle. Beaucoup de clauses déterminantes — répartition des charges, travaux,
              conditions de cession, indexation du loyer — se décident au moment de la rédaction.
              Une fois le bail signé, ces équilibres sont difficiles à corriger.
            </p>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Intervenir en amont, c'est éviter qu'une clause défavorable ne se transforme, des
              années plus tard, en contentieux coûteux.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Les clauses à sécuriser en priorité
            </h2>
            <ul className="mb-5 space-y-[10px]">
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                <strong>La destination des lieux</strong> : elle délimite l'activité autorisée. Une
                rédaction trop étroite freine l'évolution de votre activité (question de la
                déspécialisation).
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                <strong>La répartition des charges</strong> : depuis la loi Pinel du 18 juin 2014,
                le bail doit comporter un inventaire précis ; certaines dépenses, dont les grosses
                réparations de l'article 606 du Code civil, ne peuvent être imputées au preneur.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                <strong>La clause d'indexation</strong> (échelle mobile) : choix de l'indice (ILC,
                ILAT), base et périodicité — une rédaction imprécise peut être contestée.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                <strong>Les travaux et l'état des lieux</strong> : un état des lieux d'entrée et de
                sortie est désormais requis ; la prise en charge des travaux doit être clairement
                définie.
              </li>
              <li className="font-mulish text-[16px] leading-[1.7] text-[#3f4d44]">
                <strong>Les garanties et la clause résolutoire</strong> : dépôt de garantie,
                caution, et conditions de mise en jeu de la résiliation.
              </li>
            </ul>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Comment je vous accompagne
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              J'analyse le projet de bail clause par clause, j'identifie les points de vigilance au
              regard de votre activité, puis je négocie les ajustements utiles avec l'autre partie
              et rédige, le cas échéant, les avenants nécessaires. L'objectif : un contrat clair,
              équilibré et adapté à la réalité de votre exploitation.
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
                  Un bail à signer ?
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Faites-le relire avant de vous engager. Premier échange pour faire le point.
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
                  href="/baux-commerciaux/vie-du-bail"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Vie du bail : révision &amp; indexation
                </a>
                <a
                  href="/baux-commerciaux/contentieux"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Contentieux du bail commercial
                </a>
                <a
                  href="/baux-commerciaux/fin-de-bail"
                  className="block border-b border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Fin de bail : renouvellement ou congé
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

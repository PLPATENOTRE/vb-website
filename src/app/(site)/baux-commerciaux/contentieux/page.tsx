import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Contentieux du bail commercial — Avocate à Lyon | Victoire Behaghel',
  description:
    'Fixation judiciaire du loyer, impayés et clause résolutoire, indemnités : défense de vos intérêts devant le juge des loyers commerciaux et le tribunal. Avocate dédiée, Lyon et partout en France.',
  path: '/baux-commerciaux/contentieux',
  ogType: 'article',
  ogImage: '/assets/og-contentieux.jpg',
})

const EN_BREF_ITEMS = [
  {
    label: 'Pour qui',
    content: 'Toute partie confrontée à un litige sur son bail commercial',
  },
  {
    label: 'Ce que je traite',
    content: 'Fixation du loyer, impayés, clause résolutoire, indemnités',
  },
  {
    label: 'Quand',
    content: 'Dès la naissance du désaccord, ou à réception d’un acte',
  },
  {
    label: 'Où',
    content: 'Cabinet à Lyon — intervention partout en France',
  },
]

const FAQ_ITEMS = [
  {
    question: 'Qui fixe le loyer en cas de désaccord ?',
    answer:
      'Le juge des loyers commerciaux, après une procédure spécifique débutant par un mémoire préalable, en référence à la valeur locative.',
  },
  {
    question: "J'ai reçu un commandement de payer, que faire ?",
    answer:
      "Réagir sans attendre : le commandement ouvre en principe un délai d'un mois. Contestation, négociation ou demande de délais en référé sont possibles pour préserver le bail.",
  },
  {
    question: 'Combien de temps dure une procédure ?',
    answer:
      'Cela dépend du litige : un référé se traite en quelques semaines, une procédure au fond avec expertise sur plusieurs mois.',
  },
]

export default function ContentieuxPage() {
  return (
    <>
      {/* JSON-LD Service */}
      <JsonLd
        data={serviceJsonLd({
          name: 'Contentieux du bail commercial',
          description:
            'Fixation judiciaire du loyer, impayés et clause résolutoire, indemnités : représentation devant le juge des loyers commerciaux et le tribunal.',
          path: '/baux-commerciaux/contentieux',
          serviceType: 'Contentieux du bail commercial',
        })}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1080px] px-6 pt-8 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            { name: 'Contentieux du bail', href: '/baux-commerciaux/contentieux' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-8 md:px-14">
        <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Expertise · Contentieux
        </p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[42px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          Contentieux du bail commercial
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          Lorsque le dialogue ne suffit plus, je défends vos intérêts devant les juridictions
          compétentes : fixation du loyer, impayés, indemnités. Avec rigueur, et toujours en
          cherchant la voie la plus efficace pour votre activité.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
          >
            Exposer mon litige
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
              La fixation judiciaire du loyer
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              En cas de désaccord sur le montant du loyer — lors d'une révision ou d'un
              renouvellement — la décision revient au <strong>juge des loyers commerciaux</strong>.
              La procédure obéit à un formalisme strict : elle débute par un{' '}
              <strong>mémoire préalable</strong> et s'appuie sur l'analyse de la valeur locative
              (caractéristiques du local, facteurs de commercialité, prix pratiqués). Une expertise
              judiciaire est fréquente.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Impayés et clause résolutoire
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Le défaut de paiement peut entraîner la délivrance d'un{' '}
              <strong>commandement de payer visant la clause résolutoire</strong>, qui ouvre en
              principe un délai d'un mois pour régulariser. Réagir vite est déterminant : selon la
              situation, il est possible de contester l'acte, de négocier un échéancier ou de
              solliciter des délais en référé pour suspendre les effets de la clause.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Indemnités et autres litiges
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Le contentieux couvre aussi l'indemnité d'éviction en cas de refus de renouvellement,
              les désordres et travaux, ou encore les manquements aux obligations du bail. Pour la
              fin de bail, voir l'expertise dédiée.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Amiable ou judiciaire ?
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Tout litige n'a pas vocation à aller au procès. J'évalue d'abord la solidité de votre
              position, puis je privilégie l'accord lorsqu'il protège vos intérêts, et je plaide
              avec détermination lorsqu'il faut les défendre.
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
                  Un litige en cours ?
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Le temps compte. Exposez votre situation au plus tôt.
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
                  Révision &amp; indexation du loyer
                </a>
                <a
                  href="/baux-commerciaux/fin-de-bail"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Fin de bail &amp; indemnité d'éviction
                </a>
                <a
                  href="/actualites"
                  className="block border-b border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Lire : fixation judiciaire du loyer
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

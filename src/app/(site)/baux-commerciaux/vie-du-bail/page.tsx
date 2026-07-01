import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

const PATH = '/baux-commerciaux/vie-du-bail'

export const metadata = pageMetadata({
  title: 'Révision, indexation et cession du bail commercial — Avocate Lyon | Victoire Behaghel',
  description:
    "Révision triennale, clause d'indexation (ILC, ILAT), cession de bail, sous-location, déspécialisation : accompagnement juridique à chaque étape de la vie de votre bail commercial. Lyon, partout en France.",
  path: PATH,
  ogType: 'article',
  ogImage: '/assets/og-vie-du-bail.jpg',
})

const enBrefItems = [
  {
    label: 'Pour qui',
    content: 'Toute partie confrontée à une étape de la vie de son bail.',
  },
  {
    label: 'Ce que je traite',
    content: 'Révision, indexation, cession, sous-location, déspécialisation.',
  },
  {
    label: 'Quand',
    content: "À l'approche d'une révision, d'une cession ou d'un changement d'activité.",
  },
]

const faqItems = [
  {
    question: "Quel indice s'applique à l'indexation d'un bail commercial ?",
    answer:
      "Le plus souvent l'indice des loyers commerciaux (ILC) pour les activités commerciales et artisanales, et l'indice des loyers des activités tertiaires (ILAT) pour les bureaux et activités tertiaires. Ces indices sont publiés par l'INSEE ; l'indice retenu et la périodicité doivent figurer au bail.",
  },
  {
    question: 'Le loyer peut-il augmenter librement lors de la révision triennale ?',
    answer:
      "Non. La révision triennale est en principe encadrée par une règle de plafonnement liée à la variation de l'indice, sauf exceptions (modification notable des facteurs locaux de commercialité, par exemple), qui peuvent justifier une révision à la valeur locative.",
  },
  {
    question: "Peut-on céder son bail commercial sans l'accord du bailleur ?",
    answer:
      "La cession du bail avec le fonds de commerce ne peut en principe pas être interdite, mais le bail peut prévoir des conditions (clause d'agrément, garantie du cédant). La cession du seul droit au bail est davantage encadrée par les clauses du contrat.",
  },
]

export default function VieduBailPage() {
  return (
    <>
      <div className="mx-auto max-w-[1080px] px-6 pt-14 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            { name: 'La vie du bail', href: PATH },
          ]}
        />

        {/* Hero */}
        <section className="pb-0 pt-6">
          <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
            Expertise &middot; Conseil
          </p>
          <h1 className="mb-5 max-w-[880px] font-cormorant text-[48px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
            Accompagnement tout au long de la vie du bail
          </h1>
          <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
            Un bail commercial vit&nbsp;: le loyer se révise, les indices varient,
            l&rsquo;entreprise se cède ou réoriente son activité. Je vous accompagne à chaque
            opération &mdash; du conseil ponctuel à la rédaction d&rsquo;avenants &mdash; pour
            garder un bail maîtrisé.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/contact"
              className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
            >
              Poser ma question
            </a>
            <a
              href="/baux-commerciaux"
              className="border-b border-rose pb-[3px] font-mulish text-[14px] font-semibold tracking-[1px] text-forest"
            >
              Toutes les expertises
            </a>
          </div>
        </section>
      </div>

      {/* En bref */}
      <div className="mx-auto max-w-[1080px] px-6 pt-11 md:px-14">
        <EnBref items={enBrefItems} />
      </div>

      {/* Body + sidebar */}
      <div className="mx-auto max-w-[1080px] px-6 pb-20 pt-2 md:px-14">
        <div className="grid gap-16 md:grid-cols-[1fr_300px] md:items-start">
          {/* Main content */}
          <div>
            <h2 className="mb-4 mt-12 font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Révision et indexation du loyer
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Deux mécanismes font évoluer le loyer. La <strong>révision triennale</strong>{' '}
              (articles L.145-37 et suivants du Code de commerce) peut être demandée à
              l&rsquo;expiration de chaque période de trois ans&nbsp;; elle est en principe encadrée
              par une règle de plafonnement. La <strong>clause d&rsquo;indexation</strong> (échelle
              mobile), elle, joue automatiquement selon la variation d&rsquo;un indice.
            </p>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Les indices de référence sont publiés par l&rsquo;INSEE&nbsp;: l&rsquo;
              <strong>ILC</strong> (indice des loyers commerciaux) pour les activités commerciales
              et artisanales, l&rsquo;<strong>ILAT</strong> (activités tertiaires) pour les bureaux.
              Je vérifie la validité de la clause, le bon indice et le calcul appliqué &mdash; une
              indexation mal rédigée ou mal calculée peut être contestée.
            </p>

            <h2 className="mb-4 mt-12 font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Céder son bail ou son fonds de commerce
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              La cession peut porter sur le fonds de commerce (le bail suit alors le fonds) ou sur
              le seul droit au bail. Le contrat encadre souvent l&rsquo;opération&nbsp;: clause
              d&rsquo;agrément, information du bailleur, garantie solidaire du cédant.
              J&rsquo;analyse ces clauses et sécurise l&rsquo;acte de cession.
            </p>

            <h2 className="mb-4 mt-12 font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Sous-location et déspécialisation
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              La <strong>sous-location</strong> est en principe interdite, sauf clause contraire ou
              accord du bailleur. La <strong>déspécialisation</strong> &mdash; adjoindre ou changer
              d&rsquo;activité &mdash; obéit à une procédure précise (déspécialisation partielle ou
              plénière) qu&rsquo;il faut respecter pour éviter la contestation. Je vous guide sur la
              marche à suivre et les notifications requises.
            </p>

            <FaqSection items={faqItems} title="Questions fréquentes" />
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-[104px] flex flex-col gap-6">
              <div className="rounded-[10px] bg-forest p-7">
                <p className="mb-2 font-cormorant text-[24px] font-semibold leading-[1.15] text-cream">
                  Une révision, une cession&nbsp;?
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Vérifions ensemble le calcul ou la clause avant de décider.
                </p>
                <a
                  href="/contact"
                  className="block rounded-[30px] bg-mint py-3 text-center font-mulish text-[13px] font-bold uppercase tracking-[1.2px] text-forest-dark"
                >
                  Prendre rendez-vous
                </a>
                <p className="mt-3 text-center font-mulish text-[13px] text-[#9fb0a4]">
                  06 50 05 89 73
                </p>
              </div>

              <div>
                <p className="mb-4 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                  Expertises liées
                </p>
                <a
                  href="/baux-commerciaux/negociation"
                  className="block border-t border-[#E0DDD2] py-3 font-cormorant text-[20px] font-semibold leading-[1.25] text-forest transition-colors hover:text-rose"
                >
                  Négociation du contrat de bail
                </a>
                <a
                  href="/baux-commerciaux/contentieux"
                  className="block border-t border-[#E0DDD2] py-3 font-cormorant text-[20px] font-semibold leading-[1.25] text-forest transition-colors hover:text-rose"
                >
                  Contentieux du bail commercial
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="mx-auto max-w-[1080px] px-6 pb-20 md:px-14">
        <CtaBox />
      </div>

      <JsonLd
        data={serviceJsonLd({
          name: 'La vie du bail commercial',
          description:
            'Révision triennale et indexation du loyer, cession de bail ou de fonds, sous-location, déspécialisation.',
          path: PATH,
          serviceType: 'Accompagnement de la vie du bail commercial',
        })}
      />
    </>
  )
}

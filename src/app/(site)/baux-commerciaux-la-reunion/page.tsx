import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Baux commerciaux à La Réunion — Avocate au Barreau de Lyon | Victoire Behaghel',
  description:
    "Le statut des baux commerciaux s'applique à La Réunion comme en métropole. Négociation, révision du loyer, contentieux, fin de bail : avocate au Barreau de Lyon, partout en France.",
  path: '/baux-commerciaux-la-reunion',
  ogType: 'article',
})

const EN_BREF_ITEMS = [
  {
    label: 'Pour qui',
    content: 'Commerçants, restaurateurs, bailleurs et investisseurs exerçant à La Réunion.',
  },
  {
    label: 'Ce que je traite',
    content: 'Négociation, révision du loyer, contentieux, renouvellement, cession de fonds.',
  },
  {
    label: 'Quand',
    content: "À la signature du bail, en cours de bail, ou dès la naissance d'un litige.",
  },
]

const FAQ_ITEMS = [
  {
    question: "Le droit des baux commerciaux est-il le même à La Réunion qu'en métropole ?",
    answer:
      "Oui. La Réunion est un département français : le statut des baux commerciaux (articles L.145-1 et suivants du Code de commerce) s'y applique à l'identique, sans régime dérogatoire propre au territoire.",
  },
  {
    question: 'Une avocate inscrite au Barreau de Lyon peut-elle intervenir à La Réunion ?',
    answer:
      "Oui. Un avocat français peut intervenir sur l'ensemble du territoire, départements d'outre-mer compris : c'est le même droit français qui s'applique. Le lieu d'inscription au barreau ne limite pas le périmètre d'intervention en conseil.",
  },
  {
    question: "Les indices ILC et ILAT s'appliquent-ils aux loyers réunionnais ?",
    answer:
      "Oui. La révision et l'indexation des loyers commerciaux à La Réunion reposent sur les mêmes indices publiés par l'INSEE (ILC pour le commerce, ILAT pour le tertiaire) qu'en métropole.",
  },
]

export default function ReunionPage() {
  return (
    <>
      {/* JSON-LD Service */}
      <JsonLd
        data={serviceJsonLd({
          name: 'Baux commerciaux à La Réunion',
          description:
            'Conseil et contentieux en droit des baux commerciaux pour les acteurs économiques de La Réunion : négociation, révision du loyer, fin de bail, cession de fonds.',
          path: '/baux-commerciaux-la-reunion',
          serviceType: 'Droit des baux commerciaux',
        })}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1080px] px-6 pt-8 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            { name: 'Baux commerciaux à La Réunion', href: '/baux-commerciaux-la-reunion' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-8 md:px-14">
        <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Baux commerciaux · La Réunion
        </p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[42px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          Baux commerciaux à La Réunion
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          À La Réunion comme en métropole, le bail commercial obéit au même droit. J&apos;accompagne
          les commerçants, bailleurs et investisseurs réunionnais à chaque étape, de la négociation
          du bail au contentieux, en tant qu&apos;avocate au Barreau de Lyon.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
          >
            Prendre rendez-vous
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
              Le même statut des baux commerciaux qu&apos;en métropole
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              La Réunion est un <strong>département d&apos;outre-mer</strong> : le droit français y
              est le droit commun. Le statut des baux commerciaux (articles L.145-1 et suivants du
              Code de commerce): durée du bail, plafonnement, droit au renouvellement, indemnité
              d&apos;éviction s&apos;y applique donc <strong>à l&apos;identique</strong>, sans
              régime dérogatoire propre au territoire.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Ce que je traite pour les commerces réunionnais
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Négociation et rédaction du bail, révision et indexation du loyer (ILC, ILAT),
              contentieux devant le juge des loyers commerciaux, renouvellement, congé et indemnité
              d&apos;éviction, cession de fonds de commerce : le même accompagnement qu&apos;en
              métropole, ajusté à votre dossier. Voir{' '}
              <a href="/baux-commerciaux" className="text-forest underline decoration-rose">
                l&apos;ensemble des expertises
              </a>
              .
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
                  Un bail à La Réunion ?
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Exposez votre situation : premier échange gratuit, sans engagement.
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
                  href="/baux-commerciaux/negociation"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Négociation du bail
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
                  Fin de bail &amp; indemnité d&apos;éviction
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

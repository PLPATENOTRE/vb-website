import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { localBusinessJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Avocate en baux commerciaux à Lyon — Conseil & contentieux | Victoire Behaghel',
  description:
    'Cabinet Victoire Behaghel, avocate dédiée au bail commercial : négociation, vie du bail, contentieux, renouvellement et congé. Basée à Lyon, intervention partout en France. Prise de rendez-vous.',
  path: '/',
  ogType: 'website',
  ogImage: '/assets/og-accueil.jpg',
})

// Aperçu compact des expertises (remplace la bande photo) — labels courts + 1 ligne.
const apercu = [
  {
    num: '01',
    label: 'Négociation du bail',
    desc: 'Sécuriser les clauses avant la signature.',
    href: '/baux-commerciaux/negociation',
  },
  {
    num: '02',
    label: 'Vie du bail',
    desc: 'Révision, indexation, cession, sous-location.',
    href: '/baux-commerciaux/vie-du-bail',
  },
  {
    num: '03',
    label: 'Contentieux',
    desc: 'Défendre vos intérêts devant le juge.',
    href: '/baux-commerciaux/contentieux',
  },
  {
    num: '04',
    label: 'Fin de bail',
    desc: 'Renouvellement, congé, indemnité d’éviction.',
    href: '/baux-commerciaux/fin-de-bail',
  },
  {
    num: '05',
    label: 'Cession de fonds & d’actions',
    desc: 'Sécuriser la transmission de l’activité.',
    href: '/baux-commerciaux/cession-fonds-actions',
  },
  {
    num: '06',
    label: 'Formations',
    desc: 'Monter en compétence sur le bail.',
    href: '/baux-commerciaux/formations',
  },
]

const ARTICLE_TITLES = [
  'Expertise amiable et fixation judiciaire du loyer commercial : ce que deux arrêts récents changent pour vous',
  "Le plafond du loyer du bail commercial à 3,5 % s'applique-t-il à la révision triennale ?",
  "La clause d'indexation dans votre bail commercial",
] as const

const ARTICLE_DATES = ['15 avril 2026', '30 janvier 2026', '27 novembre 2025'] as const

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />

      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-6 pb-14 pt-[84px] md:grid md:grid-cols-[1.35fr_0.9fr] md:items-center md:gap-14 md:px-14">
        <div>
          <p className="mb-[22px] font-mulish text-[13px] uppercase tracking-[3px] text-rose">
            Conseil &amp; contentieux · Lyon, partout en France
          </p>
          <h1 className="m-0 mb-6 font-cormorant text-[40px] font-semibold leading-[1.02] tracking-[-0.5px] text-forest md:whitespace-nowrap md:text-[64px]">
            Victoire Behaghel
          </h1>
          <p className="m-0 mb-[34px] max-w-[540px] font-cormorant text-[22px] italic leading-[1.4] text-[#5b6b60] md:text-[27px]">
            Avocate en baux commerciaux. Je sécurise vos intérêts à chaque étape de la vie du bail.
          </p>
          <div className="flex flex-wrap items-center gap-6 md:gap-[26px]">
            <Link
              href="/contact"
              className="rounded-full bg-forest px-[34px] py-4 font-mulish text-sm font-semibold uppercase tracking-[1.4px] text-cream transition-opacity hover:opacity-90"
            >
              Prendre rendez-vous
            </Link>
            <Link
              href="/a-propos"
              className="border-b border-rose pb-[3px] font-mulish text-sm font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
            >
              Découvrir le cabinet
            </Link>
          </div>
        </div>
        {/* Portrait — Victoire Behaghel (image portrait, bonnes dimensions) */}
        <img
          src="/assets/photo_accueil_portrait_2x.webp"
          alt="Victoire Behaghel, avocate en baux commerciaux à Lyon"
          width={900}
          height={1030}
          className="mt-10 h-[420px] w-full rounded object-cover object-top md:mt-0 md:h-[520px]"
        />
      </section>

      {/* Aperçu des expertises — rangée 6 colonnes (remplace la bande photo).
          gap-px + bg sur le conteneur = filets fins entre cellules, quel que soit le wrap. */}
      <section className="border-y border-[#EEEBE2] bg-sand">
        <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
                Les expertises
              </p>
              <h2 className="m-0 font-cormorant text-[34px] font-semibold leading-tight text-forest md:text-[42px]">
                Le bail commercial, de A à Z
              </h2>
            </div>
            <Link
              href="/baux-commerciaux"
              className="border-b border-rose pb-[3px] font-mulish text-sm font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
            >
              Toutes les expertises
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
            {apercu.map(({ num, label, desc, href }) => (
              <Link
                key={num}
                href={href}
                className="border-[#E0DDD2] border-t bg-sand px-6 py-9 transition-colors first:border-t-0 hover:bg-[#efece3] sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l lg:border-t-0 lg:[&:not(:first-child)]:border-l"
              >
                <span className="font-cormorant text-[24px] italic tracking-wide text-rose">
                  {num}
                </span>
                <h3 className="mt-3 mb-2.5 font-cormorant text-[27px] font-semibold leading-[1.12] text-forest">
                  {label}
                </h3>
                <p className="m-0 font-mulish text-[17px] leading-[1.7] text-[#6b726b]">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="flex justify-center px-6 py-24">
        <blockquote className="m-0 max-w-[1000px] text-center font-cormorant text-[26px] font-medium italic leading-[1.45] text-forest md:text-[34px]">
          <span
            className="leading-none text-rose"
            style={{ fontSize: '54px', verticalAlign: '-12px' }}
          >
            &ldquo;
          </span>{' '}
          Le bail commercial engage durablement les parties et conditionne la vie de
          l&apos;entreprise. J&apos;accompagne et défends vos intérêts à chaque étape de sa vie,
          pour des relations sécurisées et équilibrées.{' '}
          <span
            className="leading-none text-rose"
            style={{ fontSize: '54px', verticalAlign: '-24px' }}
          >
            &rdquo;
          </span>
        </blockquote>
      </section>

      {/* Le cabinet — fond taupe pour couper avec la citation et les actualités */}
      <section className="border-y border-[#EEEBE2] bg-sand">
        <div className="mx-auto max-w-[1280px] px-6 py-[84px] md:px-14">
          <p className="mb-[14px] font-mulish text-[12px] uppercase tracking-[3px] text-rose">
            Le cabinet
          </p>
          <h2 className="m-0 mb-6 font-cormorant text-[38px] font-semibold leading-[1.05] text-forest md:text-[46px]">
            Un accompagnement sur mesure
          </h2>
          <p className="m-0 mb-[18px] max-w-[900px] font-mulish text-[17px] leading-[1.85] text-[#4f574f]">
            J&apos;interviens à chaque étape de la vie du bail commercial — négociation, cession,
            révision, renouvellement — en conseil comme en contentieux (loyers, indemnités…), auprès
            d&apos;acteurs de tous secteurs : artisans, commerçants, industriels, investisseurs.
          </p>
          <p className="m-0 mb-7 max-w-[900px] font-mulish text-[17px] leading-[1.85] text-[#4f574f]">
            Attachée à comprendre la réalité de chaque dossier, je privilégie un accompagnement de
            proximité, sur mesure. Basée à Lyon, j&apos;interviens partout en France.
          </p>
          <Link
            href="/a-propos"
            className="border-b border-rose pb-[3px] font-mulish text-sm font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
          >
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Actualités */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 md:px-14">
        <div className="mb-[42px] flex flex-wrap items-end justify-between gap-4">
          <h2 className="m-0 font-cormorant text-[38px] font-semibold text-forest md:text-[46px]">
            Dernières actualités
          </h2>
          <Link
            href="/actualites"
            className="border-b border-rose pb-[3px] font-mulish text-sm font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
          >
            Toutes les actualités
          </Link>
        </div>
        <div className="grid gap-9 md:grid-cols-3">
          {ARTICLE_DATES.map((date, i) => (
            <article key={date} className="flex flex-col gap-[18px]">
              {/* Vignette — asset non disponible */}
              <div className="flex h-[210px] items-center justify-center rounded bg-sand">
                <span className="font-mulish text-[11px] uppercase tracking-[2px] text-[#9b9588]">
                  Vignette
                </span>
              </div>
              <time className="font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                {date}
              </time>
              <h3 className="m-0 font-cormorant text-[22px] font-semibold leading-[1.25] text-forest md:text-[25px]">
                {ARTICLE_TITLES[i]}
              </h3>
              <Link
                href="/actualites"
                className="self-start border-b border-rose pb-[2px] font-mulish text-[13px] font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
              >
                Lire l&apos;article
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <CtaBox />
    </>
  )
}

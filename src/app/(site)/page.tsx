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

const expertises = [
  { num: '01', label: 'Négociation du contrat de bail', href: '/baux-commerciaux/negociation' },
  {
    num: '02',
    label: 'Accompagnement tout au long de la vie du bail',
    href: '/baux-commerciaux/vie-du-bail',
  },
  { num: '03', label: 'Contentieux du bail commercial', href: '/baux-commerciaux/contentieux' },
  {
    num: '04',
    label: 'Fin de bail : renouvellement ou congé',
    href: '/baux-commerciaux/fin-de-bail',
  },
  { num: '05', label: 'Formations', href: '/baux-commerciaux/formations' },
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
        {/* Portrait — Victoire Behaghel */}
        <img
          src="/assets/photo_accueil_light.webp"
          alt="Victoire Behaghel, avocate en baux commerciaux à Lyon"
          width={520}
          height={480}
          className="mt-10 h-[320px] w-full rounded object-cover md:mt-0 md:h-[480px]"
        />
      </section>

      {/* Citation — avant la photo des rues de Lyon */}
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

      {/* Bande photo rue */}
      <div className="mx-auto max-w-[1280px] px-6 md:px-14">
        <img
          src="/assets/photo_rue.webp"
          alt="Rue commerçante — illustration du droit des baux commerciaux"
          width={1168}
          height={380}
          className="w-full rounded object-cover"
          style={{ height: '380px' }}
        />
      </div>

      {/* Le cabinet — texte pleine largeur (sans photo) */}
      <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-14">
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
      </section>

      {/* Expertises */}
      <section className="border-y border-[#EEEBE2] bg-sand">
        <div className="mx-auto max-w-[1280px] px-6 py-[84px] md:px-14">
          <div className="mb-[42px] flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
                Les expertises
              </p>
              <h2 className="m-0 font-cormorant text-[38px] font-semibold text-forest md:text-[46px]">
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
          <div className="flex flex-col">
            {expertises.map(({ num, label, href }, i) => (
              <Link
                key={num}
                href={href}
                className={`grid grid-cols-[56px_1fr] items-baseline gap-7 border-t border-[#E0DDD2] py-[26px] transition-opacity hover:opacity-70 md:grid-cols-[64px_1fr]${i === expertises.length - 1 ? ' border-b' : ''}`}
              >
                <span className="font-cormorant text-[28px] text-rose md:text-[34px]">{num}</span>
                <span className="font-cormorant text-[24px] font-semibold text-forest md:text-[30px]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
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

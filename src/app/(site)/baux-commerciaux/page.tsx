import Link from 'next/link'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { RevealSection } from '@/components/ui/RevealSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Baux commerciaux — Expertises | Victoire Behaghel, Avocate',
  description:
    'Accompagnement complet en droit des baux commerciaux : négociation, vie du bail, contentieux, fin de bail, cession de fonds et formations. Lyon.',
  path: '/baux-commerciaux',
  ogImage: '/assets/og-baux-commerciaux.jpg',
})

const expertises = [
  {
    num: '01',
    title: 'Négociation du contrat de bail',
    description:
      'Sécuriser les clauses dès la signature, pour un bail équilibré sur toute sa durée.',
    keywords: ['Destination des lieux', 'Répartition des charges', 'Travaux & état des lieux'],
    href: '/baux-commerciaux/negociation',
    bg: 'bg-cream',
  },
  {
    num: '02',
    title: 'Accompagnement tout au long du bail',
    description:
      'Vous épauler à chaque décision, des opérations courantes aux choix les plus structurants.',
    keywords: ['Révision & indexation', 'Cession de bail', 'Sous-location'],
    href: '/baux-commerciaux/vie-du-bail',
    bg: 'bg-sand',
  },
  {
    num: '03',
    title: 'Contentieux du bail commercial',
    description: 'Défendre vos intérêts devant le juge, avec rigueur et détermination.',
    keywords: ['Fixation du loyer', 'Impayés', 'Indemnités'],
    href: '/baux-commerciaux/contentieux',
    bg: 'bg-cream',
  },
  {
    num: '04',
    title: 'Fin de bail : renouvellement ou congé',
    description: "Anticiper l'échéance et sécuriser la procédure pour préserver vos droits.",
    keywords: ['Renouvellement', 'Congé', "Indemnité d'éviction"],
    href: '/baux-commerciaux/fin-de-bail',
    bg: 'bg-sand',
  },
  {
    num: '05',
    title: 'Cession de fonds ou de titres',
    description: 'Accompagner la transmission du fonds de commerce ou des titres de société.',
    keywords: ['Cession de fonds', 'Cession de titres', 'Garanties'],
    href: '/baux-commerciaux/cession-fonds-actions',
    bg: 'bg-cream',
  },
  {
    num: '06',
    title: 'Formations',
    description: 'Transmettre les clés du bail commercial à vos équipes, par des cas concrets.',
    keywords: ['Sessions sur mesure', 'Cas pratiques'],
    href: '/baux-commerciaux/formations',
    bg: 'bg-sand',
  },
] as const

const sectors = [
  {
    label: 'Commerçants',
    description: 'Destination, charges de galerie, cession du fonds',
    href: '/bail-commercial-commercant',
  },
  {
    label: 'Restaurateurs',
    description: 'Destination, travaux, terrasse, bail dérogatoire',
    href: '/bail-commercial-restaurateur',
  },
  {
    label: 'Professions libérales',
    description: "Bail pro vs commercial, droits à l'échéance",
    href: '/bail-commercial-profession-liberale',
  },
  {
    label: 'Investisseurs',
    description: 'Rédaction, garanties, révision, refus de renouvellement',
    href: '/bail-commercial-investisseur',
  },
  {
    label: 'Industriels',
    description: 'Destination, travaux lourds, ILAT, ICPE',
    href: '/bail-commercial-industriel',
  },
  {
    label: 'Hôteliers',
    description: "Fonds hôtelier, mise aux normes, indemnité d'éviction",
    href: '/bail-commercial-hotelier',
  },
  {
    label: 'Logisticiens',
    description: 'Entrepôt, ILAT, travaux, clause de sortie triennale',
    href: '/bail-commercial-entrepot-logistique',
  },
] as const

export default function BauxCommerciauxPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: 'Droit des baux commerciaux',
          description:
            'Accompagnement complet en droit des baux commerciaux : négociation, contentieux, renouvellement, cession et formations.',
          path: '/baux-commerciaux',
        })}
      />

      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Baux commerciaux', href: '/baux-commerciaux' },
        ]}
      />

      {/* Hero intro */}
      <section className="mx-auto max-w-[760px] px-10 pb-2 pt-24 text-center">
        <p className="mb-[22px] font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Les expertises
        </p>
        <h1 className="mb-6 font-cormorant text-[52px] font-semibold leading-[1.02] tracking-[-0.5px] text-forest md:text-[72px]">
          Le bail commercial,
          <br />
          de A à Z
        </h1>
        <p className="mx-auto max-w-[560px] font-mulish text-[17px] leading-[1.8] text-[#4f574f]">
          Un accompagnement complet à chaque étape de la vie de votre bail — du conseil en amont à
          la défense de vos intérêts devant le juge.
        </p>
        <div
          aria-hidden="true"
          className="mx-auto mt-12"
          style={{
            width: '1px',
            height: '64px',
            background: 'linear-gradient(#CE899E, transparent)',
          }}
        />
      </section>

      {/* Expertises list */}
      <section>
        {expertises.map((expertise, i) => (
          <div key={expertise.num}>
            <RevealSection className={`${expertise.bg} px-6 py-[74px] text-center`}>
              <p
                className="mb-[14px] font-cormorant text-[40px] italic leading-none text-rose"
                aria-hidden="true"
              >
                {expertise.num}
              </p>
              <h2 className="mx-auto mb-[18px] max-w-[640px] font-cormorant text-[36px] font-semibold leading-[1.08] text-forest md:text-[46px]">
                {expertise.title}
              </h2>
              <p className="mx-auto max-w-[520px] font-mulish text-[18px] leading-[1.7] text-[#4f574f]">
                {expertise.description}
              </p>
              <div className="mt-[30px]">
                <p className="mb-4 font-mulish text-[11px] uppercase tracking-[3px] text-rose">
                  Notamment
                </p>
                <ul className="flex flex-wrap justify-center gap-[10px] list-none p-0 m-0">
                  {expertise.keywords.map((kw) => (
                    <li
                      key={kw}
                      className="rounded-[30px] border border-[#E6E3D9] bg-white px-4 py-2 font-mulish text-[13.5px] tracking-[0.3px] text-[#41504a] shadow-[0_1px_2px_rgba(46,71,57,0.04)]"
                    >
                      {kw}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={expertise.href}
                className="mt-7 inline-block border-b border-rose pb-[3px] font-mulish text-[14px] font-semibold uppercase tracking-[1.2px] text-forest transition-colors hover:text-rose"
              >
                Découvrir l&apos;expertise →
              </Link>
            </RevealSection>

            {/* Divider between expertises (not after the last one) */}
            {i < expertises.length - 1 && (
              <div
                aria-hidden="true"
                className={`flex justify-center ${
                  i % 2 === 0
                    ? 'bg-gradient-to-b from-cream to-sand'
                    : 'bg-gradient-to-b from-sand to-cream'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      width: '1px',
                      height: '46px',
                      background: 'linear-gradient(rgba(206,137,158,0), rgba(206,137,158,0.9))',
                    }}
                  />
                  <div
                    className="my-[9px] bg-rose"
                    style={{ width: '8px', height: '8px', transform: 'rotate(45deg)' }}
                  />
                  <div
                    style={{
                      width: '1px',
                      height: '46px',
                      background: 'linear-gradient(rgba(206,137,158,0.9), rgba(206,137,158,0))',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Pour quel profil */}
      <section className="border-t border-[#EEEBE2] bg-sand">
        <div className="mx-auto max-w-[1280px] px-6 py-[84px] md:px-14">
          <div className="mb-12 text-center">
            <p className="mb-3 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
              Pour quel profil ?
            </p>
            <h2 className="m-0 font-cormorant text-[36px] font-semibold text-forest md:text-[46px]">
              J&apos;accompagne tous les acteurs du bail commercial
            </h2>
          </div>
          <ul className="grid list-none p-0 m-0 grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((sector) => (
              <li key={sector.href}>
                <Link
                  href={sector.href}
                  className="flex h-full flex-col gap-[10px] rounded-[6px] border border-[#E8E5DC] bg-cream px-6 py-[26px] no-underline transition-shadow hover:shadow-md"
                >
                  <span className="font-cormorant text-[24px] font-semibold leading-[1.15] text-forest">
                    {sector.label}
                  </span>
                  <span className="font-mulish text-[14px] leading-[1.6] text-[#6B7670]">
                    {sector.description}
                  </span>
                  <span className="mt-auto pt-2 font-mulish text-[13px] text-rose">
                    Voir la page →
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <div className="flex h-full flex-col justify-center gap-[10px] rounded-[6px] bg-mint px-6 py-[26px]">
                <span className="font-cormorant text-[24px] font-semibold leading-[1.15] text-forest">
                  Votre profil n&apos;est pas listé ?
                </span>
                <Link
                  href="/contact"
                  className="mt-[6px] self-start border-b border-rose pb-[2px] font-mulish text-[13px] font-semibold tracking-[1px] text-forest"
                >
                  Parlons de votre situation →
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <CtaBox
        title="Un besoin précis ?"
        text="Décrivez votre situation : je vous indique les options et la marche à suivre lors d'un premier échange."
      />
    </>
  )
}

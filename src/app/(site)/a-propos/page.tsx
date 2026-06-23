import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { CtaBox } from '@/components/ui/CtaBox'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'À propos — Victoire Behaghel, Avocate',
  description:
    'Découvrez Victoire Behaghel, avocate dédiée au droit des baux commerciaux à Lyon. Conseil et contentieux pour commerçants, artisans, bailleurs et investisseurs, partout en France.',
  path: '/a-propos',
  ogImage: '/assets/og-a-propos.jpg',
})

const PRINCIPLES = [
  {
    num: '01',
    title: 'De bout en bout',
    text: "Du bail commercial à la cession du fonds ou des titres, j'interviens sur l'ensemble du cycle de vie de l'actif — sans rupture entre les étapes, sans perte de contexte.",
  },
  {
    num: '02',
    title: 'Au plus près du dossier',
    text: "Comprendre l'activité, les locaux, le contexte économique de chaque client — c'est la condition d'un conseil utile, pas seulement correct.",
  },
  {
    num: '03',
    title: 'Un cap clair',
    text: "Trouver l'accord lorsqu'il protège vos intérêts, défendre avec détermination lorsqu'il faut les faire valoir. Sans ambiguïté sur l'objectif.",
  },
]

export default function AProposPage() {
  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'À propos', href: '/a-propos' },
        ]}
      />

      {/* Intro */}
      <section className="mx-auto max-w-[1280px] px-6 pb-7 pt-18 md:px-14">
        <p className="mb-[18px] font-mulish text-xs uppercase tracking-[3px] text-rose">
          Le cabinet
        </p>
        <h1 className="m-0 max-w-[900px] font-cormorant text-[52px] font-semibold leading-none tracking-[-0.5px] text-forest md:text-[74px]">
          Du bail à la cession, un accompagnement complet
        </h1>
      </section>

      {/* Portrait + bio */}
      <section className="mx-auto max-w-[1280px] gap-16 px-6 pb-24 pt-10 md:grid md:grid-cols-[0.9fr_1.1fr] md:px-14">
        {/* Portrait — Me Victoire Behaghel */}
        <img
          src="/assets/photo_portrait_victoire.webp"
          alt="Victoire Behaghel, avocate en baux commerciaux à Lyon"
          width={797}
          height={1056}
          className="mb-10 h-[360px] w-full rounded object-cover object-top md:sticky md:top-[110px] md:mb-0 md:h-[600px]"
        />

        {/* Bio */}
        <div>
          <p className="mb-8 font-cormorant text-[22px] italic leading-[1.4] text-[#5b6b60] md:text-[28px]">
            Du bail commercial à la cession du fonds ou des titres, je couvre l'ensemble du cycle de
            vie de l'actif commercial — pour des décisions éclairées et des relations sécurisées.
          </p>
          <p className="mb-[18px] font-mulish text-[16px] leading-[1.85] text-[#4f574f]">
            J'interviens à chaque étape — négociation, signature, révision, renouvellement, fin de
            bail — en conseil comme en contentieux. Lorsque l'activité se transmet, j'accompagne
            également la cession du fonds de commerce et la cession des titres de la société, en
            sécurisant le sort du bail et les garanties associées.
          </p>
          <p className="mb-[18px] font-mulish text-[16px] leading-[1.85] text-[#4f574f]">
            J'accompagne des acteurs de tous secteurs — artisans, commerçants, hôteliers,
            industriels, investisseurs — confrontés à un enjeu sur leur local ou leur activité : une
            clause à sécuriser, un loyer à fixer, une indemnité à défendre, une transmission à
            structurer.
          </p>
          <p className="mb-9 font-mulish text-[16px] leading-[1.85] text-[#4f574f]">
            Concentrée sur cette matière, je maîtrise ses subtilités et ses évolutions de
            jurisprudence. Basée à Lyon, j'interviens partout en France.
          </p>

          {/* Key figures */}
          <div className="flex flex-wrap gap-12 border-t border-[#E4E2DA] pt-[30px]">
            <div>
              <div className="font-cormorant text-[40px] font-semibold text-forest">100 %</div>
              <div className="font-mulish text-[13px] tracking-[1px] text-[#6B7670]">
                immobilier commercial
              </div>
            </div>
            <div>
              <div className="font-cormorant text-[40px] font-semibold text-forest">Lyon</div>
              <div className="font-mulish text-[13px] tracking-[1px] text-[#6B7670]">
                et partout en France
              </div>
            </div>
            <div>
              <div className="font-cormorant text-[40px] font-semibold text-forest">Conseil</div>
              <div className="font-mulish text-[13px] tracking-[1px] text-[#6B7670]">
                &amp; contentieux
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approche — 3 principes. mb = intervalle cream avant le CTA (séparation visuelle). */}
      <section className="mb-16 border-t border-[#EEEBE2] bg-sand md:mb-24">
        <div className="mx-auto max-w-[1280px] px-6 py-20 md:px-14 md:py-[84px]">
          <p className="mb-3 font-mulish text-xs uppercase tracking-[3px] text-rose">
            Mon approche
          </p>
          <h2 className="mb-12 mt-0 font-cormorant text-[36px] font-semibold text-forest md:text-[46px]">
            Trois principes de travail
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.num}>
                <div className="mb-3.5 font-cormorant text-[30px] text-rose">{p.num}</div>
                <h3 className="mb-3 mt-0 font-cormorant text-[24px] font-semibold leading-[1.2] text-forest md:text-[27px]">
                  {p.title}
                </h3>
                <p className="m-0 font-mulish text-[15px] leading-[1.8] text-[#4f574f]">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBox
        title="Échangeons sur votre situation"
        text="Un premier rendez-vous permet d'identifier les enjeux de votre bail et la marche à suivre."
      />
    </>
  )
}

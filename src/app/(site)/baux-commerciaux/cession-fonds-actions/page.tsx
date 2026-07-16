import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { serviceJsonLd } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: `Cession de fonds de commerce et cession d'actions — Avocate au Barreau de Lyon | Victoire Behaghel`,
  description: `Cession de fonds de commerce ou cession de titres (actions, parts sociales) : enjeux pour le bail commercial, garanties, sort des contrats. Conseil par une avocate experte au Barreau de Lyon. Partout en France.`,
  path: '/baux-commerciaux/cession-fonds-actions',
  ogType: 'article',
  ogImage: '/assets/og-cession-fonds-actions.jpg',
})

const EN_BREF_ITEMS = [
  {
    label: 'Pour qui',
    content: `Cédants et acquéreurs d'une activité commerciale, locaux compris.`,
  },
  {
    label: 'Ce que je traite',
    content: `Sort du bail, clauses d'agrément, garantie du cédant, clause de changement de contrôle.`,
  },
  {
    label: 'Quand',
    content: `Dès la structuration du projet, avant la signature de tout acte.`,
  },
]

const FAQ_ITEMS = [
  {
    question: `Quelle différence entre cession de fonds de commerce et cession d'actions ?`,
    answer: `La cession de fonds de commerce porte sur les éléments incorporels et corporels de l'activité (clientèle, enseigne, matériel, droit au bail). La cession d'actions ou de parts sociales porte sur les titres de la société qui exploite le fonds : l'acquéreur reprend la société avec l'ensemble de son actif et de son passif. Les conséquences sur le bail commercial diffèrent substantiellement.`,
  },
  {
    question: `Le bail commercial est-il automatiquement transmis lors d'une cession de fonds ?`,
    answer: `En principe oui : la cession du fonds de commerce emporte celle du bail, et le bailleur ne peut l'interdire. Le bail peut toutefois prévoir des conditions (information du bailleur, agrément, garantie solidaire du cédant). Ces clauses doivent être vérifiées avant la signature de l'acte.`,
  },
  {
    question: `Lors d'une cession d'actions, le bailleur doit-il être informé ?`,
    answer: `Lors d'une cession de titres, c'est la société locataire qui change de mains, pas le bail lui-même. Le bail n'est donc pas formellement cédé. Toutefois, certains baux prévoient des clauses de changement de contrôle (change of control) qui imposent l'information ou l'agrément du bailleur en cas de cession de la majorité des titres.`,
  },
]

export default function CessionFondsActionsPage() {
  return (
    <>
      {/* JSON-LD Service */}
      <JsonLd
        data={serviceJsonLd({
          name: `Cession de fonds de commerce et cession de titres — bail commercial`,
          description: `Conseil sur la cession de fonds de commerce et la cession de titres : sort du bail commercial, garanties, conditions contractuelles.`,
          path: '/baux-commerciaux/cession-fonds-actions',
          serviceType: `Cession de fonds de commerce et cession de titres — bail commercial`,
        })}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1080px] px-6 pt-8 md:px-14">
        <BreadcrumbNav
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Les expertises', href: '/baux-commerciaux' },
            {
              name: `Cession de fonds & d'actions`,
              href: '/baux-commerciaux/cession-fonds-actions',
            },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1080px] px-6 pb-0 pt-8 md:px-14">
        <p className="mb-4 font-mulish text-[12px] uppercase tracking-[3px] text-rose">
          Expertise · Conseil
        </p>
        <h1 className="mb-6 max-w-[880px] font-cormorant text-[42px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[58px]">
          Cession de fonds de commerce &amp; cession d&apos;actions
        </h1>
        <p className="mb-8 max-w-[760px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          Vendre une activité commerciale peut passer par deux voies très différentes : la cession
          du fonds de commerce ou la cession des titres de la société. Les conséquences sur le bail
          commercial, les garanties et la fiscalité divergent. Je vous aide à choisir la bonne
          structure et à sécuriser l&apos;opération.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href="/contact"
            className="rounded-[32px] bg-forest px-8 py-4 font-mulish text-[14px] font-bold uppercase tracking-[1.4px] text-cream"
          >
            Analyser mon projet de cession
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

      {/* Comparatif fonds vs titres */}
      <section className="mx-auto max-w-[1080px] px-6 pt-10 md:px-14">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Option A — fonds de commerce */}
          <div className="overflow-hidden rounded-[8px] border border-[#E4E2DA]">
            <div className="bg-forest px-7 py-[22px]">
              <p className="mb-[6px] font-mulish text-[11px] uppercase tracking-[3px] text-[#9fb0a4]">
                Option A
              </p>
              <p className="font-cormorant text-[26px] font-semibold leading-[1.1] text-cream">
                Cession de fonds
                <br />
                de commerce
              </p>
            </div>
            <div className="flex flex-col gap-[14px] bg-cream px-7 py-6">
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Porte sur les éléments de l&apos;activité : clientèle, enseigne, matériel, droit
                  au bail
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Le bail est transmis avec le fonds, en principe le bailleur ne peut
                  l&apos;interdire
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Le bail peut prévoir des conditions : information du bailleur, agrément, garantie
                  solidaire du cédant
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Le passif de la société n&apos;est pas transmis à l&apos;acquéreur (sauf actes
                  spécifiques)
                </p>
              </div>
            </div>
          </div>

          {/* Option B — cession de titres */}
          <div className="overflow-hidden rounded-[8px] border border-[#E4E2DA]">
            <div className="bg-[#4a6356] px-7 py-[22px]">
              <p className="mb-[6px] font-mulish text-[11px] uppercase tracking-[3px] text-[#9fb0a4]">
                Option B
              </p>
              <p className="font-cormorant text-[26px] font-semibold leading-[1.1] text-cream">
                Cession de titres
                <br />
                (actions / parts)
              </p>
            </div>
            <div className="flex flex-col gap-[14px] bg-cream px-7 py-6">
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Porte sur les parts ou actions de la société qui exploite le fonds
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Le bail n&apos;est pas formellement cédé : la société locataire reste la même, ses
                  associés changent
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  Certains baux prévoient une clause de <em>change of control</em> : information ou
                  agrément du bailleur si la majorité des titres change de mains
                </p>
              </div>
              <div className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 flex-none rounded-[2px] bg-rose" />
                <p className="font-mulish text-[15px] leading-[1.6] text-[#3f4d44]">
                  L&apos;acquéreur reprend la société avec son actif <strong>et</strong>&nbsp;son
                  passif : un audit préalable (dont du bail) s&apos;impose
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body + Aside */}
      <section className="mx-auto max-w-[1080px] px-6 pb-16 pt-2 md:px-14">
        <div className="grid gap-[60px] lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <div>
            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Le sort du bail lors d&apos;une cession de fonds
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              La cession du fonds de commerce emporte en principe celle du bail commercial,
              c&apos;est une protection d&apos;ordre public que le bailleur ne peut pas écarter. Le
              bail peut toutefois encadrer l&apos;opération : clause d&apos;information préalable,
              clause d&apos;agrément (validité limitée par la jurisprudence), obligation de garantie
              solidaire du cédant sur le paiement des loyers. Ces clauses doivent être lues et
              négociées avant la signature de l&apos;acte de cession.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Le sort du bail lors d&apos;une cession de titres
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Lors d&apos;une cession de titres (actions ou parts sociales), la société locataire ne
              change pas : c&apos;est son actionnariat qui évolue. Le bail n&apos;est donc pas
              formellement transmis et, en principe, le bailleur n&apos;a pas à être consulté, sauf
              si le bail contient une <strong>clause de changement de contrôle</strong> (
              <em>change of control</em>). Cette clause, de plus en plus fréquente dans les baux de
              grande surface ou de centre commercial, prévoit l&apos;information ou l&apos;agrément
              du bailleur en cas de cession de la majorité des titres. Son existence peut bloquer ou
              retarder la cession si elle n&apos;est pas anticipée.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Audit du bail avant acquisition
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Que l&apos;opération porte sur le fonds ou sur les titres, un audit du bail commercial
              est indispensable avant la signature. Il permet de vérifier la durée résiduelle, les
              conditions de révision, les clauses d&apos;agrément, la répartition des charges et
              travaux, et d&apos;identifier tout risque susceptible d&apos;affecter la valeur de
              l&apos;acquisition ou la continuité de l&apos;exploitation.
            </p>

            <h2 className="mb-4 mt-[46px] font-cormorant text-[28px] font-semibold leading-[1.15] text-forest md:text-[34px]">
              Garantie du cédant
            </h2>
            <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
              Dans une cession de fonds, la garantie solidaire du cédant pour le paiement des loyers
              est souvent prévue au bail pour une durée déterminée. Dans une cession de titres, des
              garanties de passif portant sur les obligations liées au bail peuvent être négociées
              dans la documentation de cession. Je vous conseille sur la rédaction et la portée de
              ces garanties.
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
                  Parlons de votre projet de cession
                </p>
                <p className="mb-5 font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Clause d'agrément, droit de préemption du bailleur, loyer révisable au moment de
                  la cession : autant de points à vérifier avant de signer.
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
                  href="/baux-commerciaux/vie-du-bail"
                  className="block border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Vie du bail
                </a>
                <a
                  href="/baux-commerciaux/fin-de-bail"
                  className="block border-b border-t border-[#E4E2DA] py-[13px] font-cormorant text-[20px] font-semibold leading-[1.25] text-forest"
                >
                  Fin de bail &amp; indemnité
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

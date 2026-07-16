import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { CtaBox } from '@/components/ui/CtaBox'
import { EnBref } from '@/components/ui/EnBref'
import { FaqSection } from '@/components/ui/FaqSection'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata = pageMetadata({
  title: 'Honoraires — Avocate en baux commerciaux au Barreau de Lyon | Victoire Behaghel',
  description:
    "Transparence sur les honoraires du cabinet Victoire Behaghel : modalités de facturation, convention d'honoraires, premier échange. Avocate dédiée aux baux commerciaux au Barreau de Lyon. Partout en France.",
  path: '/honoraires',
  ogType: 'article',
  ogImage: '/assets/og-honoraires.jpg',
})

const enBrefItems = [
  {
    label: 'Facturation',
    content: 'Forfait ou temps passé selon la nature de la mission',
  },
  {
    label: 'Convention',
    content: 'Établie et signée avant toute intervention',
  },
  {
    label: 'Premier échange',
    content: 'Gratuit, appel de qualification pour cerner votre situation',
  },
]

const faqItems = [
  {
    question: 'Comment sont fixés les honoraires ?',
    answer:
      'Librement, en accord avec vous, selon la nature et la complexité du dossier. Une convention est établie et signée avant toute intervention.',
  },
  {
    question: "Peut-on avoir une estimation avant de s'engager ?",
    answer:
      "Oui. Un premier échange permet d'analyser le dossier et de vous proposer une convention chiffrée, avant tout engagement.",
  },
  {
    question: 'Comment se passe le règlement ?',
    answer:
      "Par virement bancaire. Les modalités (acompte, échelonnement) sont précisées dans la convention d'honoraires.",
  },
  {
    question: 'Intervenez-vous en aide juridictionnelle ?',
    answer: "Le cabinet n'intervient pas dans le cadre de l'aide juridictionnelle.",
  },
]

export default function HonorairesPage() {
  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Honoraires', href: '/honoraires' },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-[900px] px-6 pb-0 pt-14 md:px-14">
        <h1 className="mb-5 font-cormorant text-[52px] font-semibold leading-[1.05] tracking-[-0.5px] text-forest md:text-[62px]">
          Honoraires
        </h1>
        <p className="m-0 max-w-[720px] font-mulish text-[17px] leading-[1.7] text-[#4f574f] md:text-[19px]">
          Le coût d'une intervention est souvent la première question que l'on n'ose pas poser. Je
          préfère la transparence : voici comment fonctionnent mes honoraires et comment nous
          procédons avant tout engagement.
        </p>
      </section>

      {/* En bref */}
      <section className="mx-auto max-w-[900px] px-6 pb-0 pt-9 md:px-14">
        <EnBref items={enBrefItems} title="En bref" />
      </section>

      {/* Corps */}
      <section className="mx-auto max-w-[900px] px-6 pb-20 pt-2 md:px-14">
        <h2 className="mb-4 mt-12 font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
          Une convention d'honoraires avant tout engagement
        </h2>
        <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
          Conformément aux règles de la profession, une <strong>convention d'honoraires</strong> est
          établie et signée avant toute intervention. Elle précise la nature de la mission, les
          modalités de calcul des honoraires et les conditions de règlement. Pas de surprise en fin
          de dossier.
        </p>

        <h2 className="mb-4 mt-12 font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
          Forfait ou temps passé : selon la nature du dossier
        </h2>
        <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
          Pour les <strong>missions ponctuelles et délimitées</strong> (relecture et analyse d'un
          projet de bail, consultation juridique, rédaction d'un avenant), les honoraires sont fixés
          au <strong>forfait</strong>, déterminé en amont après analyse du dossier.
        </p>
        <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
          Pour les <strong>dossiers de contentieux ou d'accompagnement dans la durée</strong> (
          représentation devant le juge, suivi d'un litige, accompagnement au fil du bail), les
          honoraires sont calculés <strong>au temps passé</strong>, sur la base d'un taux horaire
          convenu dans la convention.
        </p>

        <h2 className="mb-4 mt-12 font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
          Ce que comprend la mission
        </h2>
        <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
          Quel que soit le mode de facturation, la mission inclut : l'analyse du dossier, les
          échanges avec le client, la rédaction d'actes ou de mémoires, les déplacements dans les
          locaux lorsqu'ils sont utiles à la compréhension du dossier, et le suivi jusqu'à l'issue
          de la mission définie.
        </p>

        <h2 className="mb-4 mt-12 font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
          Premier échange : un appel gratuit pour qualifier votre dossier
        </h2>
        <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
          Avant tout engagement, je propose un <strong>appel de qualification gratuit</strong>. Il
          permet d'identifier la nature de votre situation, d'évaluer si elle relève de mes
          expertises et de vous indiquer les étapes à suivre. Si une intervention est utile, je vous
          soumets une convention d'honoraires chiffrée, sans engagement de votre part.
        </p>

        <h2 className="mb-4 mt-12 font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
          Aide juridictionnelle
        </h2>
        <p className="mb-5 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">
          Le cabinet n'intervient pas dans le cadre de l'aide juridictionnelle.
        </p>
      </section>

      {/* FAQ */}
      <FaqSection items={faqItems} title="Questions fréquentes" />

      {/* CTA */}
      <CtaBox
        title="Une question sur votre dossier ?"
        text="Décrivez votre situation en quelques lignes : je reviens vers vous rapidement avec une première orientation."
      />
    </>
  )
}

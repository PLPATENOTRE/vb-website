import type { Metadata } from 'next'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata: Metadata = pageMetadata({
  title: 'Confidentialité & cookies | Victoire Behaghel, Avocate',
  description:
    'Politique de confidentialité et gestion des cookies du cabinet Victoire Behaghel, avocate en baux commerciaux.',
  path: '/confidentialite',
})

// Stub structuré — à faire valider/compléter par le cabinet (mentions RGPD spécifiques).
export default function ConfidentialitePage() {
  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Confidentialité & cookies', href: '/confidentialite' },
        ]}
      />
      <section className="mx-auto max-w-[820px] px-6 py-12 md:px-14">
        <h1 className="mb-8 font-cormorant text-[44px] font-semibold leading-none text-forest md:text-[56px]">
          Confidentialité &amp; cookies
        </h1>
        <div className="flex flex-col gap-8 font-mulish text-[16px] leading-[1.85] text-[#3f4d44]">
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">
              Données collectées
            </h2>
            <p className="m-0">
              Le formulaire de contact collecte les informations que vous transmettez (nom, prénom,
              e-mail, téléphone, message), aux seules fins de répondre à votre demande. Ces données
              sont transmises par e-mail et ne sont pas conservées dans une base de données par le
              site.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">
              Vos droits
            </h2>
            <p className="m-0">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et
              d&apos;effacement de vos données.
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-cormorant text-[26px] font-semibold text-forest">Cookies</h2>
            <p className="m-0">
              Le site utilise un dispositif anti-spam (Cloudflare Turnstile) et une mesure
              d&apos;audience respectueuse de la vie privée. Aucun cookie publicitaire n&apos;est
              déposé.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

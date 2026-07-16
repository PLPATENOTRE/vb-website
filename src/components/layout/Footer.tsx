import Link from 'next/link'
import { SITE } from '@/lib/site'

// Footer — 3 colonnes (charte forest-dark). Liens légaux : routes prévues,
// pages à compléter hors périmètre actuel (mentions, confidentialité).
export function Footer() {
  return (
    <footer className="bg-forest-dark px-6 py-14 text-[#cdd8cf] md:px-14">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="mb-2.5 font-cormorant text-3xl font-semibold text-cream">
            {SITE.shortName}
          </div>
          <p className="font-mulish text-sm leading-7 text-[#9fb0a4]">
            Droit immobilier · Baux commerciaux
            <br />
            Conseil &amp; contentieux
          </p>
        </div>

        <address className="font-mulish text-sm not-italic leading-8 text-[#9fb0a4]">
          ALGYR Centre d&apos;affaires
          <br />
          20, boulevard Eugène Deruelle
          <br />
          {SITE.address.postalCode} {SITE.address.city}
          <br />
          <a href={`tel:${SITE.phone}`} className="transition-colors hover:text-rose">
            {SITE.phoneDisplay}
          </a>
        </address>

        <nav className="flex flex-col gap-1 font-mulish text-sm leading-8 text-[#9fb0a4]">
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-rose"
          >
            LinkedIn
          </a>
          <Link href="/baux-commerciaux-la-reunion" className="transition-colors hover:text-rose">
            Baux commerciaux · La Réunion
          </Link>
          <Link href="/honoraires" className="transition-colors hover:text-rose">
            Honoraires
          </Link>
          <Link href="/mentions-legales" className="transition-colors hover:text-rose">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="transition-colors hover:text-rose">
            Confidentialité &amp; cookies
          </Link>
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-[1280px] border-t border-white/10 pt-6 font-mulish text-xs text-[#7f9387]">
        © {new Date().getFullYear()} {SITE.shortName} — Avocate. Tous droits réservés.
      </div>
    </footer>
  )
}

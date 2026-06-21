import Link from 'next/link'
import { SITE } from '@/lib/site'

interface CtaBoxProps {
  title?: string
  text?: string
}

// CTA de conversion — chaque page mène à la prise de rendez-vous (CLAUDE.md §1).
export function CtaBox({
  title = 'Parlons de votre bail',
  text = "Un doute sur une clause, un loyer, un renouvellement ? Le premier échange permet d'y voir clair.",
}: CtaBoxProps) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-14">
      <div className="grid items-center gap-10 rounded bg-mint px-8 py-14 md:grid-cols-[1.2fr_0.8fr] md:px-14">
        <div>
          <h2 className="m-0 mb-4 font-cormorant text-[40px] font-semibold leading-tight text-forest md:text-5xl">
            {title}
          </h2>
          <p className="m-0 max-w-[460px] font-mulish text-[16px] leading-relaxed text-[#3f4d44]">
            {text}
          </p>
        </div>
        <div className="flex flex-col gap-3.5">
          <Link
            href="/contact"
            className="rounded-full bg-forest px-9 py-4 text-center font-mulish text-sm font-bold uppercase tracking-[1.4px] text-cream transition-opacity hover:opacity-90"
          >
            Prise de rendez-vous
          </Link>
          <span className="text-center font-mulish text-sm text-[#3f4d44]">
            {SITE.phoneDisplay} · {SITE.address.city} 3ᵉ
          </span>
        </div>
      </div>
    </section>
  )
}

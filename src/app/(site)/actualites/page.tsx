import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { formatFrenchDate, getAllArticles } from '@/lib/articles'
import { pageMetadata } from '@/lib/metadata'

export const dynamic = 'force-static'

export const metadata: Metadata = pageMetadata({
  title: 'Décryptages & jurisprudence — Actualités | Victoire Behaghel',
  description:
    'Analyses des évolutions récentes du droit des baux commerciaux, pour comprendre ce qui change pour votre activité.',
  path: '/actualites',
  ogImage: '/assets/og-actualites.jpg',
})

export default async function ActualitesPage() {
  const articles = await getAllArticles()
  const featured = articles.find((a) => a.featured) ?? articles[0]
  const rest = articles.filter((a) => a.slug !== featured?.slug)

  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Actualités', href: '/actualites' },
        ]}
      />

      {/* Intro */}
      <section className="mx-auto max-w-[1280px] px-6 pb-9 pt-12 md:px-14">
        <p className="mb-4 font-mulish text-xs uppercase tracking-[3px] text-rose">Actualités</p>
        <h1 className="mb-4 font-cormorant text-[52px] font-semibold leading-none tracking-[-0.5px] text-forest md:text-[74px]">
          Décryptages &amp; jurisprudence
        </h1>
        <p className="max-w-[620px] font-mulish text-[16px] leading-[1.8] text-[#4f574f]">
          Analyses des évolutions récentes du droit des baux commerciaux, pour comprendre ce qui
          change pour votre activité.
        </p>
      </section>

      {/* Article à la une */}
      {featured && (
        <section className="mx-auto max-w-[1280px] px-6 pb-4 md:px-14">
          <Link
            href={`/actualites/${featured.slug}`}
            className="grid items-center gap-10 overflow-hidden rounded-md bg-sand px-6 py-10 md:grid-cols-[1.05fr_1fr] md:gap-14 md:px-12 md:py-14"
          >
            {/* Le titre prend la place de l'ancien placeholder image */}
            <h2 className="m-0 font-cormorant text-[34px] font-semibold leading-[1.08] text-forest md:text-[48px]">
              {featured.title}
            </h2>
            <div>
              <div className="mb-4 flex items-center gap-3.5">
                <span className="rounded-full bg-forest px-3 py-1 font-mulish text-[11px] uppercase tracking-[2px] text-cream">
                  À la une
                </span>
                <span className="font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                  {formatFrenchDate(featured.publishedDate)}
                </span>
              </div>
              <p className="mb-6 font-mulish text-[16px] leading-[1.8] text-[#4f574f]">
                {featured.excerpt}
              </p>
              <span className="border-b border-rose pb-1 font-mulish text-[14px] font-semibold tracking-[1px] text-forest">
                Lire l&apos;article
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Liste */}
      <section className="mx-auto max-w-[1280px] px-6 pb-5 pt-7 md:px-14">
        <div className="flex flex-col">
          {rest.map((a) => (
            <Link
              key={a.slug}
              href={`/actualites/${a.slug}`}
              className="grid grid-cols-1 items-center gap-4 rounded border-t border-[#E0DDD2] px-4 py-7 transition-colors last:border-b hover:bg-sand md:grid-cols-[150px_1fr_auto] md:gap-9"
            >
              <div className="font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                {formatFrenchDate(a.publishedDate)}
              </div>
              <div>
                <h3 className="mb-1.5 font-cormorant text-[24px] font-semibold leading-[1.2] text-forest md:text-[29px]">
                  {a.title}
                </h3>
                <p className="font-mulish text-[14px] text-[#6B7670]">{a.excerpt}</p>
              </div>
              <div className="hidden font-mulish text-[24px] text-rose md:block">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA bas */}
      <section className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-end gap-6 px-6 pb-24 pt-6 md:px-14">
        <div className="font-mulish text-[14px] text-[#6B7670]">
          Une question sur l&apos;un de ces sujets ?{' '}
          <Link
            href="/contact"
            className="border-b border-rose pb-0.5 font-semibold text-forest transition-colors hover:text-rose"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </>
  )
}

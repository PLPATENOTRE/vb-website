import { DocumentRenderer } from '@keystatic/core/renderer'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactElement, ReactNode } from 'react'
import { BreadcrumbNav } from '@/components/seo/BreadcrumbNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { formatFrenchDate, getAllArticles, getArticle, getArticleSlugs } from '@/lib/articles'
import { ENTITY } from '@/lib/jsonld'
import { pageMetadata } from '@/lib/metadata'
import { SITE } from '@/lib/site'

export const dynamic = 'force-static'
// Seuls les slugs de generateStaticParams (articles publiés) existent ; tout autre → 404.
export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}
  return pageMetadata({
    title: `${article.title} | Victoire Behaghel`,
    description: article.excerpt,
    path: `/actualites/${slug}`,
    ogType: 'article',
    ogImage: article.coverImage ?? '/assets/og-actualites.jpg',
  })
}

// Renderers Tailwind pour le contenu Keystatic (calqués sur la maquette Article).
// inline.link + block.list sont explicites : le reset Tailwind supprime le style
// par défaut des liens et des puces.
const renderers = {
  inline: {
    link: ({ href, children }: { href: string; children: ReactNode }) => (
      <a
        href={href}
        className="font-medium text-rose underline underline-offset-2 transition-colors hover:text-forest"
      >
        {children}
      </a>
    ),
  },
  block: {
    paragraph: ({ children }: { children: ReactNode }) => (
      <p className="mb-[22px] font-mulish text-[17px] leading-[1.85] text-[#3f4d44]">{children}</p>
    ),
    heading: ({ level, children }: { level: number; children: ReactNode }) =>
      level <= 2 ? (
        <h2 className="mb-4 mt-11 font-cormorant text-[34px] font-semibold leading-[1.15] text-forest">
          {children}
        </h2>
      ) : (
        <h3 className="mb-3 mt-8 font-cormorant text-[26px] font-semibold leading-tight text-forest">
          {children}
        </h3>
      ),
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="my-9 rounded-r-md border-l-[3px] border-rose bg-sand px-8 py-6 font-cormorant text-[25px] italic leading-[1.4] text-forest">
        {children}
      </blockquote>
    ),
    list: ({ type, children }: { type: 'ordered' | 'unordered'; children: ReactElement[] }) => {
      const base = 'mb-[22px] space-y-2 pl-6 font-mulish text-[17px] leading-[1.85] text-[#3f4d44]'
      return type === 'ordered' ? (
        <ol className={`list-decimal ${base}`}>
          {children.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: liste statique sans id (rendu Keystatic)
            <li key={i} className="pl-1">
              {child}
            </li>
          ))}
        </ol>
      ) : (
        <ul className={`list-disc ${base}`}>
          {children.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: liste statique sans id (rendu Keystatic)
            <li key={i} className="pl-1">
              {child}
            </li>
          ))}
        </ul>
      )
    },
  },
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const others = (await getAllArticles()).filter((a) => a.slug !== slug).slice(0, 2)

  return (
    <>
      <BreadcrumbNav
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Actualités', href: '/actualites' },
          { name: article.title, href: `/actualites/${slug}` },
        ]}
      />

      {/* En-tête article */}
      <article>
        <header className="mx-auto max-w-[880px] px-6 pt-8 md:px-14">
          <p className="mb-4 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
            {formatFrenchDate(article.publishedDate)}
            {article.readingTime ? ` · ${article.readingTime}` : ''}
          </p>
          <h1 className="mb-6 font-cormorant text-[40px] font-semibold leading-[1.08] tracking-[-0.5px] text-forest md:text-[56px]">
            {article.title}
          </h1>
          <p className="m-0 font-cormorant text-[22px] italic leading-[1.45] text-[#5b6b60] md:text-[24px]">
            {article.excerpt}
          </p>
        </header>

        {/* Couverture — image si renseignée dans Keystatic, sinon placeholder catégorie */}
        <div className="mx-auto max-w-[1080px] px-6 pt-10 md:px-14">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              width={1200}
              height={630}
              className="h-[260px] w-full rounded object-cover md:h-[460px]"
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center rounded bg-sand md:h-[460px]">
              <span className="font-mulish text-[11px] uppercase tracking-[2px] text-[#9b9588]">
                {article.category}
              </span>
            </div>
          )}
        </div>

        {/* Corps + aside */}
        <div className="mx-auto grid max-w-[1180px] items-start gap-16 px-6 py-14 md:px-14 lg:grid-cols-[1fr_320px]">
          {/* min-w-0 : laisse la colonne 1fr rétrécir ; break-words (hérité) : casse les
              chaînes longues/URLs au lieu de déborder horizontalement. */}
          <div className="min-w-0 break-words">
            <DocumentRenderer document={article.content} renderers={renderers} />
          </div>

          <aside>
            <div className="sticky top-[104px] flex flex-col gap-7">
              <div className="rounded-[10px] bg-forest p-7">
                <p className="mb-2.5 font-cormorant text-[25px] font-semibold leading-tight text-cream">
                  Un doute sur votre bail ?
                </p>
                <p className="mb-[18px] font-mulish text-[14px] leading-[1.7] text-[#9fb0a4]">
                  Faisons le point sur votre situation lors d&apos;un premier échange.
                </p>
                <Link
                  href="/contact"
                  className="block rounded-full bg-mint py-3.5 text-center font-mulish text-[13px] font-bold uppercase tracking-[1.2px] text-forest-dark transition-opacity hover:opacity-90"
                >
                  Prendre rendez-vous
                </Link>
              </div>

              {others.length > 0 && (
                <div>
                  <p className="mb-3.5 font-mulish text-[12px] uppercase tracking-[2px] text-rose">
                    À lire aussi
                  </p>
                  {others.map((o) => (
                    <Link
                      key={o.slug}
                      href={`/actualites/${o.slug}`}
                      className="block border-t border-[#E0DDD2] py-3.5 font-cormorant text-[20px] font-semibold leading-[1.25] text-forest transition-colors hover:text-rose"
                    >
                      {o.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="mx-auto max-w-[1180px] px-6 pb-20 md:px-14">
          <Link
            href="/actualites"
            className="font-mulish text-[14px] font-semibold tracking-[1px] text-forest transition-colors hover:text-rose"
          >
            ← Toutes les actualités
          </Link>
        </div>
      </article>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          image: `${SITE.url}${article.coverImage ?? '/assets/og-actualites.jpg'}`,
          datePublished: article.publishedDate,
          // Pas de champ « modifié » en base → on reflète la date de publication.
          dateModified: article.publishedDate,
          // @id : même auteur/éditeur que le graphe d'entité (accueil) → consolidation.
          author: {
            '@type': 'Person',
            '@id': ENTITY.person,
            name: SITE.founder,
            jobTitle: SITE.jobTitle,
            url: `${SITE.url}/a-propos`,
          },
          publisher: { '@type': 'Organization', '@id': ENTITY.cabinet, name: SITE.name },
          mainEntityOfPage: `${SITE.url}/actualites/${slug}`,
          articleSection: article.category,
        }}
      />
    </>
  )
}

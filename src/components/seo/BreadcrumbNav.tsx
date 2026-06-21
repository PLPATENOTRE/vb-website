import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/jsonld'
import type { BreadcrumbItem } from '@/types'

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

// Fil d'ariane visuel + JSON-LD BreadcrumbList synchrones. Dernier item = page courante.
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav aria-label="Fil d'ariane" className="mx-auto max-w-[1280px] px-6 pt-8 md:px-14">
      <ol className="flex flex-wrap items-center gap-2 font-mulish text-xs uppercase tracking-[1.5px] text-[#8a938b]">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span className="text-rose">{item.name}</span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-rose">
                  {item.name}
                </Link>
              )}
              {!last && <span aria-hidden>·</span>}
            </li>
          )
        })}
      </ol>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </nav>
  )
}

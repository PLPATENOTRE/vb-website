import type { EnBrefItem } from '@/types'

interface EnBrefProps {
  items: EnBrefItem[]
  title?: string
}

// Encart « En bref » (GEO) — texte brut, lisible LLM, jamais en image (CLAUDE.md §5).
export function EnBref({ items, title = 'En bref' }: EnBrefProps) {
  return (
    <section className="rounded bg-mint px-7 py-9 md:px-10">
      <h2 className="mb-6 font-mulish text-xs uppercase tracking-[3px] text-rose">{title}</h2>
      <dl className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="mb-2 font-cormorant text-xl font-semibold text-forest">{item.label}</dt>
            <dd className="m-0 font-mulish text-[15px] leading-relaxed text-[#3f4d44]">
              {item.content}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

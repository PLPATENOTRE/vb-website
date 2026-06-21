import { JsonLd } from '@/components/seo/JsonLd'
import { faqJsonLd } from '@/lib/jsonld'
import type { FaqItem } from '@/types'

interface FaqSectionProps {
  items: FaqItem[]
  title?: string
}

// FAQ sémantique (h3/p) + JSON-LD FAQPage émis au même endroit -> toujours synchrones.
export function FaqSection({ items, title = 'Questions fréquentes' }: FaqSectionProps) {
  return (
    <section className="mx-auto max-w-[860px] px-6 py-20 md:px-14">
      <h2 className="mb-10 font-cormorant text-[34px] font-semibold text-forest">{title}</h2>
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item.question} className="border-t border-[#E0DDD2] py-7 last:border-b">
            <h3 className="mb-3 font-cormorant text-2xl font-semibold text-forest">
              {item.question}
            </h3>
            <p className="m-0 font-mulish text-[16px] leading-[1.8] text-[#4f574f]">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
      <JsonLd data={faqJsonLd(items)} />
    </section>
  )
}

import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

// Chrome public : Header + Footer autour de toutes les pages du site.
// (Les routes /keystatic et /api restent sous le root layout, sans chrome.)
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
    </>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { NAV } from '@/lib/site'

// Header sticky — nav desktop + menu mobile (useState, pas de lib). Tokens charte.
export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#EEEBE2] bg-cream/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-14 md:py-5">
        <Link href="/" className="flex items-center gap-3.5 leading-none">
          {/* ponytail: <img> simple — logo léger, optimisation edge Cloudflare */}
          <img
            src="/assets/logo.png"
            alt="Victoire Behaghel — Avocate"
            className="h-10 w-auto md:h-[46px]"
          />
          <span className="hidden h-[30px] w-px bg-[#E4E2DA] sm:block" />
          <span className="hidden text-[11px] uppercase leading-relaxed tracking-[2.4px] text-[#6B7670] sm:block">
            Victoire Behaghel
            <br />
            <span className="text-rose">{'Avocate · Baux commerciaux'}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] uppercase tracking-[1.6px] text-forest transition-colors hover:text-rose"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-mint px-5 py-3 text-[13px] uppercase tracking-[1.4px] text-forest transition-opacity hover:opacity-80"
          >
            Prise de rendez-vous
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center lg:hidden"
        >
          <span className='relative block h-px w-6 bg-forest before:absolute before:-top-2 before:block before:h-px before:w-6 before:bg-forest before:content-[""] after:absolute after:top-2 after:block after:h-px after:w-6 after:bg-forest after:content-[""]' />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[#EEEBE2] bg-cream px-6 py-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-[13px] uppercase tracking-[1.6px] text-forest"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-mint px-5 py-3 text-center text-[13px] uppercase tracking-[1.4px] text-forest"
          >
            Prise de rendez-vous
          </Link>
        </nav>
      )}
    </header>
  )
}

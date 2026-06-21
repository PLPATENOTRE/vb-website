'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

interface RevealSectionProps {
  children: ReactNode
  className?: string
}

// Fade-up au scroll (IntersectionObserver). Le contenu est dans le HTML rendu
// (juste masqué via opacity) -> reste lisible par les crawlers (CLAUDE.md §5).
export function RevealSection({ children, className }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

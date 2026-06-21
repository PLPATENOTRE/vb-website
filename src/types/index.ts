// Types partagés — réponses API typées ici (CLAUDE.md §8).

export interface NavLink {
  href: string
  label: string
}

export interface FaqItem {
  question: string
  answer: string
}

/** Encart « En bref » (GEO) — 3 à 4 colonnes texte brut. */
export interface EnBrefItem {
  label: string
  content: string
}

export interface BreadcrumbItem {
  name: string
  href: string
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  token: string
}

export interface ContactApiResponse {
  ok: boolean
  error?: string
}

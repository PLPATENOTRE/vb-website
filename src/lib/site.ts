import type { NavLink } from '@/types'

// Données cabinet — issues des maquettes (.dc.html), pas inventées.
// Source unique pour Header, Footer et JSON-LD.
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://behaghel-avocat.com',
  name: 'Victoire Behaghel — Avocate',
  shortName: 'Victoire Behaghel',
  founder: 'Victoire Behaghel',
  jobTitle: 'Avocate',
  tagline: 'Avocate · Baux commerciaux',
  phone: '+33650058973',
  phoneDisplay: '06 50 05 89 73',
  linkedin: 'https://www.linkedin.com/in/victoire-behaghel-avocat/',
  address: {
    street: '141 rue Cuvier',
    postalCode: '69006',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    country: 'FR',
  },
  geo: { latitude: 45.7677483, longitude: 4.8537083 },
  areaServed: 'France',
} as const

export const NAV: NavLink[] = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/baux-commerciaux', label: 'Services' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/contact', label: 'Contact' },
]

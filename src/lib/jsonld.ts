import type { BreadcrumbItem, FaqItem } from '@/types'
import { SITE } from './site'

// Helpers JSON-LD (CLAUDE.md §5). Retournent des objets sérialisés par <JsonLd>.

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: SITE.address.street,
  postalCode: SITE.address.postalCode,
  addressLocality: SITE.address.city,
  addressRegion: SITE.address.region,
  addressCountry: SITE.address.country,
}

// @id stables : un seul nœud « cabinet » (la structure d'exercice) et un seul
// nœud « person » (Victoire), référencés partout → graphe d'entité consolidé
// (Google/LLM fusionnent les nœuds partageant un @id). CABINET porte le type
// Attorney (sous-type de LocalBusiness) ; PERSON reste un Person pur + hasOccupation.
export const ENTITY = {
  cabinet: `${SITE.url}/#cabinet`,
  person: `${SITE.url}/#person`,
} as const

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.href}`,
    })),
  }
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

interface ServiceInput {
  name: string
  description: string
  path: string
  serviceType?: string
}

export function serviceJsonLd({ name, description, path, serviceType }: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType: serviceType ?? name,
    url: `${SITE.url}${path}`,
    areaServed: { '@type': 'Country', name: SITE.areaServed },
    // Référence le nœud cabinet canonique (@id) + props minimales d'identification :
    // Google fusionne avec le nœud complet défini sur l'accueil.
    provider: {
      '@type': ['LegalService', 'Attorney'],
      '@id': ENTITY.cabinet,
      name: SITE.name,
      url: SITE.url,
      address: postalAddress,
    },
  }
}

// Graphe d'entité — accueil uniquement. Deux nœuds canoniques (cabinet + person)
// reliés par @id ; c'est ici qu'ils sont définis en entier. Le type Attorney
// (sous-type de LocalBusiness) porte l'identité « practice » ; LegalService reste
// pour la compat. Person = personne physique + hasOccupation Avocate.
const KNOWS_ABOUT = [
  'Bail commercial',
  'Droit immobilier commercial',
  'Fonds de commerce',
  'Cession de fonds de commerce',
  'Renouvellement de bail',
  'Congé',
  "Indemnité d'éviction",
  'Révision du loyer',
  'Indexation',
]

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LegalService', 'Attorney'],
        '@id': ENTITY.cabinet,
        name: SITE.name,
        description:
          'Avocate dédiée au droit des baux commerciaux : conseil et contentieux, à chaque étape de la vie du bail.',
        url: SITE.url,
        image: `${SITE.url}/assets/og-accueil.jpg`,
        telephone: SITE.phone,
        priceRange: 'Sur devis',
        address: postalAddress,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE.geo.latitude,
          longitude: SITE.geo.longitude,
        },
        areaServed: { '@type': 'Country', name: SITE.areaServed },
        founder: { '@id': ENTITY.person },
        knowsAbout: KNOWS_ABOUT,
        sameAs: [SITE.linkedin],
      },
      {
        '@type': 'Person',
        '@id': ENTITY.person,
        name: SITE.founder,
        jobTitle: SITE.jobTitle,
        url: `${SITE.url}/a-propos`,
        hasOccupation: { '@type': 'Occupation', name: 'Avocate' },
        worksFor: { '@id': ENTITY.cabinet },
        knowsAbout: KNOWS_ABOUT,
        sameAs: [SITE.linkedin],
      },
    ],
  }
}

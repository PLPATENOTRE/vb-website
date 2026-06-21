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
    provider: {
      '@type': ['LegalService', 'ProfessionalService'],
      name: SITE.name,
      telephone: SITE.phone,
      url: SITE.url,
      address: postalAddress,
    },
  }
}

// Bloc LocalBusiness + LegalService — accueil uniquement (porté de Accueil.dc.html).
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LegalService', 'ProfessionalService'],
        name: SITE.name,
        description:
          'Avocate dédiée au droit des baux commerciaux : conseil et contentieux, à chaque étape de la vie du bail.',
        url: SITE.url,
        image: `${SITE.url}/assets/og-accueil.jpg`,
        telephone: SITE.phone,
        areaServed: SITE.address.country,
        address: postalAddress,
        founder: {
          '@type': 'Person',
          name: SITE.founder,
          jobTitle: SITE.jobTitle,
          knowsAbout: ['Bail commercial', 'Droit immobilier', 'Contentieux du bail'],
        },
        sameAs: [SITE.linkedin],
        knowsAbout: [
          'Bail commercial',
          'Renouvellement de bail',
          'Congé',
          "Indemnité d'éviction",
          'Révision du loyer',
          'Indexation',
        ],
      },
      {
        '@type': 'LocalBusiness',
        name: SITE.name,
        url: SITE.url,
        telephone: SITE.phone,
        priceRange: 'Sur devis',
        address: postalAddress,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE.geo.latitude,
          longitude: SITE.geo.longitude,
        },
        areaServed: { '@type': 'Country', name: SITE.areaServed },
        sameAs: [SITE.linkedin],
      },
    ],
  }
}

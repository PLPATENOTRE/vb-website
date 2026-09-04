import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Redirections permanentes (308, équivalent SEO du 301) depuis les chemins de l'ancien
  // site Joomla, qui tourne encore chez OVH sous www.behaghel-avocat.com. Ses slugs ont été
  // relevés dans son sitemap (sitemap.fr-FR.4seo.1.xml) : contrairement à ce que supposait
  // ce commentaire auparavant, ils sont parfaitement récupérables — le site est en ligne.
  // D'où des correspondances article ↔ article, et non plus un renvoi global vers la liste
  // (qu'un moteur traite en soft-404). Ordre significatif : les règles spécifiques doivent
  // précéder le motif générique /actualites-droit-immobilier/:path*.
  //
  // Trois anciens articles restent sans équivalent publié et tombent donc sur la liste :
  // la-methode-hoteliere (brouillon non publié côté Keystatic), la-procedure-en-fixation-du-
  // loyer-du-bail-renouvele, et bail-commercial-mutations-digitalisation-et-valeur-verte.
  async redirects() {
    return [
      {
        source: '/actualites-droit-immobilier',
        destination: '/actualites',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/le-bail-derogatoire',
        destination: '/actualites/bail-derogatoire',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/expertise-amiable-et-fixation-judiciaire-du-loyer-commercial-ce-que-deux-arrets-recents-changent-pour-vous',
        destination: '/actualites/expertise-amiable-fixation-judiciaire-loyer',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/la-clause-dindexation-dans-votre-bail-commercial',
        destination: '/actualites/la-clause-d-indexation',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/le-plafond-du-loyer-du-bail-commercial-a-3-5-sapplique-t-il-a-la-revision-triennale',
        destination: '/actualites/plafond-loyer-3-5-revision-triennale',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/le-refus-de-renouvellement-de-bail-sans-offre-de-payer-lindemnite-deviction',
        destination: '/actualites/refus-renouvellement-sans-indemnite-eviction',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/la-revision-triennale-du-loyer-commercial-une-demarche-qui-ne-simprovise-pas',
        destination: '/actualites/revision-triennale-loyer-commercial',
        permanent: true,
      },
      {
        source: '/actualites-droit-immobilier/:path*',
        destination: '/actualites',
        permanent: true,
      },
      // Anciennes pages OVH encore indexées par Google (404 depuis la bascule) → hub expertises.
      {
        source: '/droit-des-baux-commerciaux',
        destination: '/baux-commerciaux',
        permanent: true,
      },
      {
        source: '/avocate-des-locataires-commerciaux-conseil-contentieux',
        destination: '/baux-commerciaux',
        permanent: true,
      },
      {
        source: '/contact-avocate-en-droit-immobilier-conseil-contentieux',
        destination: '/contact',
        permanent: true,
      },
      // L'ancien site séparait cookies et RGPD ; le nouveau traite les deux dans une page.
      {
        source: '/cookies',
        destination: '/confidentialite',
        permanent: true,
      },
      {
        source: '/rgpd',
        destination: '/confidentialite',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

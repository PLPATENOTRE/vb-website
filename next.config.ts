import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Redirections permanentes (308, équivalent SEO du 301) après la bascule DNS.
  // L'ancien blog vivait sous /actualites-droit-immobilier (site OVH) ; il n'existe plus.
  // On redirige tout ce chemin vers la nouvelle liste /actualites : évite les 404 et
  // transmet l'équité de liens. Les anciens slugs (≠ nouveaux) sont irrécupérables
  // (aucune archive Wayback) → redirection vers la liste plutôt qu'article↔article.
  // Les autres 404 hérités seront repérés dans Search Console → 301 ciblées ensuite.
  async redirects() {
    return [
      {
        source: '/actualites-droit-immobilier',
        destination: '/actualites',
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
    ]
  },
}

export default nextConfig

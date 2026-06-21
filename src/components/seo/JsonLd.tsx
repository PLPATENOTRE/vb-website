interface JsonLdProps {
  data: object | object[]
}

// Injecte un (ou plusieurs) bloc(s) JSON-LD. Server Component — rendu statique,
// donc lisible par les crawlers sans JS (CLAUDE.md §5 GEO).
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD sérialisé côté serveur, pas d'entrée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

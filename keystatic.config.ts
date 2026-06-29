import { collection, config, fields } from '@keystatic/core'

// CMS Keystatic — actualités/articles.
// storage = OÙ l'éditeur écrit (pas comment l'app lit : le reader, lui, lit toujours
// les .mdoc du repo checké-out au build via createReader).
//   - dev   : `local` → écrit sur le disque, aucune auth (pratique en local).
//   - prod  : `github` → l'éditeur commit dans le repo après login GitHub (OAuth).
//             Chaque commit déclenche un rollout App Hosting → contenu en ligne.
// Nécessite en prod : KEYSTATIC_GITHUB_CLIENT_ID/SECRET + KEYSTATIC_SECRET (GitHub App).
export default config({
  storage:
    process.env.NODE_ENV === 'production'
      ? { kind: 'github', repo: 'PLPATENOTRE/vb-website' }
      : { kind: 'local' },
  ui: {
    brand: { name: 'Victoire Behaghel — Avocate' },
  },
  collections: {
    articles: collection({
      label: 'Actualités',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishedDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Titre', validation: { length: { min: 1 } } },
        }),
        publishedDate: fields.date({
          label: 'Date de publication',
          validation: { isRequired: true },
        }),
        category: fields.text({ label: 'Catégorie', defaultValue: 'Bail commercial' }),
        readingTime: fields.text({
          label: 'Temps de lecture',
          description: 'ex. « 5 min de lecture »',
        }),
        excerpt: fields.text({
          label: 'Chapô / extrait',
          description: 'Résumé court — affiché en liste et en sous-titre.',
          multiline: true,
          validation: { isRequired: true, length: { min: 1 } },
        }),
        featured: fields.checkbox({
          label: 'Article à la une',
          description: "Met l'article en avant sur la page Actualités.",
        }),
        coverImage: fields.image({
          label: 'Image de couverture',
          directory: 'public/assets/articles',
          publicPath: '/assets/articles/',
        }),
        content: fields.document({
          label: 'Contenu',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
  },
})

# Propositions SEO + GEO — Site Victoire Behaghel

Aligné sur votre playbook. Rien du design actuel n'est modifié : tout ci-dessous est soit **invisible** (technique, balises, données structurées, fichiers IA), soit du **contenu additif** raccord avec la charte (vert forêt, rose poudré, serif Cormorant + Mulish). À valider section par section avant déploiement.

Déjà posé dans le projet, en démonstration :
- `Accueil.dc.html` → `<title>`, meta description, canonical, Open Graph, et JSON-LD `LegalService` + `Person` dans le `<helmet>` (invisible).
- `llms.txt`, `robots.txt` (avec GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended…), `sitemap.xml`.

---

## 1. Architecture — pages à ajouter (sans toucher l'existant)

Votre arborescence actuelle (Accueil · À propos · Services · Actualités · Contact) est saine mais « vitrine ». Pour capter l'intention de recherche, on ajoute des pages profondes, chacune répondant à **une** intention.

Transactionnelles (fort ROI, proches de la prise de RDV) :
- `/baux-commerciaux/negociation-du-bail`
- `/baux-commerciaux/contentieux-loyer`
- `/baux-commerciaux/renouvellement-conge`
- `/baux-commerciaux/indemnite-eviction`
- `/avocat-bail-commercial-lyon`  (service + ville)
- `/honoraires`  (page « Prix de… » — très demandée en SEO et en GenAI)

Guides (autorité, durables) :
- `/guides/comment-contester-une-revision-de-loyer`
- `/guides/anticiper-le-renouvellement-de-son-bail`
- `/guides/clause-dindexation-mode-demploi`

Preuves & ressources :
- `/cas` (dossiers anonymisés : situation → action → résultat)
- `/ressources` (checklist « points à vérifier avant de signer un bail », à télécharger ET en HTML)
- `/glossaire` (bail dérogatoire, pas-de-porte, déspécialisation, indice ILC/ILAT…)
- `/faq` (hub de questions)

> Chaque page = 1 H1 explicite + réponse claire dès l'intro + H2/H3 sous forme de questions + exemples + liens internes + 1 CTA « Prendre rendez-vous ».

## 2. Contenu — blocs à ajouter sur les pages existantes (en charte)

Je peux les construire dans le style actuel, en additif :

- **Bloc « En bref »** en tête de chaque page (encadré menthe `#DDEBDD`, serif) : 3-4 puces qui répondent immédiatement (Pour qui · Ce que je traite · Où · Comment me joindre). Idéal pour Google *featured snippets* et pour la citation par les GenAI.
- **FAQ visible** en bas des pages Services / Article (accordéon ou liste), reprise en JSON-LD `FAQPage`. Ex. : « Le plafond de 3,5 % s'applique-t-il à la révision triennale ? », « Quel indice pour l'indexation ? », « Quand donner congé ? ».
- **Pied d'article enrichi** : date de mise à jour, auteur (Victoire Behaghel + lien À propos), « Articles liés ».
- **Maillage interne** : chaque expertise → page dédiée + FAQ + contact ; chaque article → expertise concernée. Ancres descriptives (« contester une révision de loyer »), jamais « cliquez ici ».

## 3. Données structurées (JSON-LD) — prêtes à coller

À placer dans le `<head>` de chaque page concernée.

### À propos → `Person` + fil d'Ariane
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Victoire Behaghel",
  "jobTitle": "Avocate",
  "worksFor": { "@type": "LegalService", "name": "Victoire Behaghel — Avocate" },
  "knowsAbout": ["Bail commercial", "Renouvellement de bail", "Indemnité d'éviction", "Révision du loyer"],
  "areaServed": "FR",
  "address": { "@type": "PostalAddress", "addressLocality": "Lyon", "postalCode": "69003", "addressCountry": "FR" },
  "sameAs": ["https://www.linkedin.com/in/victoire-behaghel-avocat/"]
  /* à compléter : "alumniOf", "memberOf" (Barreau), "award" — uniquement si réels */
}
```

### Services → un `Service` par expertise
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Contentieux du bail commercial",
  "provider": { "@type": "LegalService", "name": "Victoire Behaghel — Avocate" },
  "areaServed": "FR",
  "description": "Défense de vos intérêts devant le juge : fixation du loyer, impayés, indemnités."
}
```

### Article → `Article` + auteur + dates
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "La clause d'indexation dans votre bail commercial",
  "datePublished": "2025-11-27",
  "dateModified": "2025-11-27",
  "author": { "@type": "Person", "name": "Victoire Behaghel" },
  "publisher": { "@type": "Organization", "name": "Victoire Behaghel — Avocate" },
  "about": "Bail commercial"
}
```

### FAQ → `FAQPage`
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Quel indice s'applique à l'indexation d'un bail commercial ?",
    "acceptedAnswer": { "@type": "Answer", "text": "Le plus souvent l'ILC pour le commerce et l'ILAT pour les activités tertiaires ; l'indice et la périodicité doivent être prévus au bail." }
  }]
}
```

### Fil d'Ariane (toutes pages internes) → `BreadcrumbList`
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://behaghel-avocat.com/" },
    { "@type": "ListItem", "position": 2, "name": "Les expertises", "item": "https://behaghel-avocat.com/services" }
  ]
}
```

## 4. Technique (le cabinet / l'intégrateur Joomla)
- HTML rendu côté serveur, contenu important hors JavaScript.
- Canonical sur chaque page, `hreflang` si une version EN est prévue.
- Images en WebP/AVIF, `alt` descriptifs, noms de fichiers parlants (`renouvellement-bail-commercial-lyon.webp`), 1 image Open Graph 1200×630 par grande page.
- Core Web Vitals (LCP/CLS/INP), 404 utile, 301 propres si les slugs changent.
- Google Search Console + Bing Webmaster Tools ; analyse des logs pour repérer GPTBot / ClaudeBot / PerplexityBot.

## 5. GEO (moteurs génératifs)
- `llms.txt` posé (résumé citable + faits stables + pages clés). Étendre en `llms-full.txt` quand le contenu grossit.
- Réponses directes + blocs « En bref » + FAQ : ce sont les formats les plus cités.
- Versions Markdown des guides stratégiques si utile.
- Off-site : LinkedIn régulier, annuaires d'avocats fiables, participations/articles — chaque mention cohérente renforce l'entité.

## 6. Ordre d'exécution proposé
1. Technique + entité (canonical, JSON-LD `LegalService`/`Person`, sitemap, robots) — *déjà amorcé*.
2. Blocs « En bref » + FAQ sur les pages existantes (en charte).
3. Pages transactionnelles : `/avocat-bail-commercial-lyon`, `/honoraires`, expertises dédiées.
4. Guides + glossaire + cas anonymisés.
5. `llms.txt`/`llms-full.txt`, images OG.
6. Distribution off-site, puis mesure mensuelle.

---

**Ce que je peux produire tout de suite, en gardant la charte intacte :**
- Le bloc « En bref » + une FAQ sur la page Services et sur l'article (additif, réversible).
- La page modèle `/avocat-bail-commercial-lyon` et `/honoraires`.
- Le déploiement des meta + JSON-LD sur les 5 autres pages.

Dites-moi par quoi commencer.

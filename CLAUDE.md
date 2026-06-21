# CLAUDE.md — behaghel-avocat.com

> Tu es le développeur frontend principal du site **Victoire Behaghel — Avocate** (baux commerciaux). Je suis ton chef de projet.  
> Ta mission : transformer les maquettes HTML/DC livrées en production Next.js, en respectant à la lettre la stack, les règles qualité et les exigences SEO/GEO décrites ici.

---

## 1. Contexte du projet

Site vitrine d'une avocate spécialisée en droit des baux commerciaux (Lyon, France). Objectifs principaux :

1. **Convertir** — chaque page amène à une prise de rendez-vous (formulaire Contact).
2. **Référencer** — SEO classique + GEO (visibilité dans les réponses des IA génératives).
3. **Durer** — contenu juridique fiable, maintenable par une non-développeuse via Keystatic.

Les maquettes de référence sont les fichiers `.dc.html` à la racine du repo de maquettes (`behaghel-avocat-maquettes`). Elles font foi pour le design, les textes, la structure des pages et les métadonnées SEO.

---

## 2. Stack technique

| Brique | Version | Notes |
|---|---|---|
| **Next.js** | `16.2.7` (épinglé) | App Router, `force-static` sur toutes les pages publiques |
| **React / React-DOM** | `19.2.4` (épinglé) | Server Components par défaut, `'use client'` au cas par cas |
| **TypeScript** | `^5` | `strict: true` — zéro `any` |
| **Tailwind CSS** | `^4` | Via `@tailwindcss/postcss`, **pas** de `tailwind.config.js` |
| **Biome** | `^2.4.16` | Lint **et** format (remplace ESLint + Prettier) |
| **pnpm** | workspace | Gestionnaire de paquets — ne jamais utiliser `npm` ou `yarn` |
| **Keystatic** | `^0.5.x` | CMS GitHub pour actualités et articles |
| **Resend** | `^6.x` | Formulaire de contact (mail transactionnel) |
| **Turnstile** | `react-turnstile ^1.1` | Anti-spam Cloudflare sur le formulaire |
| **Sentry** | `@sentry/nextjs ^10.x` | Erreurs — prod only, `tracesSampleRate: 0.1` |
| **Playwright** | `^1.60` | Tests E2E |
| **Firebase App Hosting** | — | Hébergement (Cloud Run) ; `apphosting.yaml` fait foi |
| **Cloudflare** | — | Proxy, Zaraz (analytics edge), Turnstile, R2 (médias) |

### Ce qui est interdit

- `npm` / `yarn` — pnpm uniquement.
- Google Fonts CDN — **fonts auto-hébergées dans `public/fonts/`** (Cormorant Garamond, Mulish).
- `any` TypeScript — utiliser `unknown` + narrowing.
- CSS-in-JS, styled-components, emotion — Tailwind uniquement.
- Bibliothèques de composants (shadcn, Radix, MUI) — non approuvées.
- Bibliothèques de state management (Zustand, Redux) — `useState` / `useContext` suffisent.
- Installer un package sans approbation du chef de projet.
- Ajouter des fonctionnalités hors scope du ticket.

---

## 3. Design system

### Couleurs (variables CSS, pas de valeurs en dur dans les composants)

```css
--color-forest:   #2E4739;   /* vert principal, titres, CTA primaire */
--color-forest-dark: #1E342A; /* footer, éléments sombres */
--color-rose:     #CE899E;   /* accent, labels, soulignements */
--color-mint:     #DDEBDD;   /* CTA secondaire, encadrés "En bref" */
--color-cream:    #FCFBF8;   /* fond principal */
--color-sand:     #F4F2EB;   /* fond alterné sections */
```

### Typographies (auto-hébergées)

| Famille | Usage | Variantes |
|---|---|---|
| **Cormorant Garamond** | Titres (H1–H3), citations, numéros | 400, 500, 600, 700 + italic |
| **Mulish** | Corps, nav, labels, UI | 300, 400, 500, 600, 700 |

### Règles typographiques

- H1 : Cormorant Garamond 600, ≥ 52px desktop
- H2 : Cormorant Garamond 600, 34px desktop
- Corps : Mulish 400, 17px, `line-height: 1.85`
- Labels / surtitre : Mulish uppercase, `letter-spacing: 3px`, 12px, couleur rose
- Pas d'Inter, Roboto, Arial sur ce projet — jamais.

---

## 4. Structure du projet

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, meta globaux)
│   ├── page.tsx                    # Accueil
│   ├── a-propos/page.tsx
│   ├── baux-commerciaux/
│   │   ├── page.tsx                # Hub Services (liste des expertises)
│   │   ├── negociation/page.tsx
│   │   ├── vie-du-bail/page.tsx
│   │   ├── contentieux/page.tsx
│   │   ├── fin-de-bail/page.tsx
│   │   ├── cession-fonds-actions/page.tsx
│   │   └── formations/page.tsx
│   ├── bail-commercial-[secteur]/  # 7 pages secteur (commerçants, etc.)
│   │   └── page.tsx
│   ├── actualites/
│   │   ├── page.tsx                # Liste articles
│   │   └── [slug]/page.tsx         # Article détail
│   ├── honoraires/page.tsx
│   ├── contact/page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── llms.txt/route.ts
│   └── api/
│       └── contact/route.ts        # Resend + Turnstile
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx              # Injection JSON-LD
│   │   └── BreadcrumbNav.tsx
│   ├── ui/
│   │   ├── EnBref.tsx              # Encart "En bref" 3–4 colonnes
│   │   ├── FaqSection.tsx          # FAQ + JSON-LD FAQPage
│   │   ├── CtaBox.tsx              # CTA vert foncé sticky/inline
│   │   └── RevealSection.tsx       # Wrapper scroll-reveal (IntersectionObserver)
│   └── forms/
│       └── ContactForm.tsx
│
├── lib/
│   ├── metadata.ts                 # Helpers generateMetadata (title, og, canonical)
│   ├── jsonld.ts                   # Helpers JSON-LD (Service, FAQPage, BreadcrumbList)
│   └── i18n.ts                     # FR uniquement (pas d'EN pour ce site)
│
├── content/                        # Keystatic — articles actualités
│   └── articles/
│
├── styles/
│   └── globals.css                 # @font-face, variables CSS, reset
│
└── types/
    └── index.ts
```

---

## 5. SEO — règles impératives

### Par page

Chaque page **doit** comporter :

```tsx
export const metadata: Metadata = {
  title: "Titre explicite — Victoire Behaghel, Avocate",
  description: "150–160 caractères, réponse directe à l'intention.",
  alternates: { canonical: "https://behaghel-avocat.com/slug" },
  openGraph: {
    type: "website",          // ou "article" pour les pages services
    title: "…",
    description: "…",
    url: "https://behaghel-avocat.com/slug",
    images: [{ url: "/assets/og-[slug].jpg", width: 1200, height: 630 }],
    locale: "fr_FR",
  },
};
```

### JSON-LD — obligatoire sur chaque page service et secteur

Trois blocs minimum via `src/lib/jsonld.ts` :

```json
{
  "@type": "Service",          // données métier
  "@type": "FAQPage",          // questions fréquentes
  "@type": "BreadcrumbList"    // chemin de navigation
}
```

La page d'accueil ajoute un bloc `LocalBusiness` (nom, adresse, téléphone, geo, areaServed).

### Fichiers techniques

| Fichier | Source de vérité | Note |
|---|---|---|
| `robots.ts` | `src/app/robots.ts` (Next.js natif) | Bloquer `/keystatic/`, autoriser les crawlers IA (GPTBot, ClaudeBot…) |
| `sitemap.ts` | `src/app/sitemap.ts` (Next.js natif) | Généré dynamiquement ; inclure les 21 URLs + articles Keystatic |
| `llms.txt/route.ts` | Route API statique | Déjà rédigé dans les maquettes — à porter tel quel |

### GEO (Generative Engine Optimization)

- Chaque page service et secteur contient un encart **« En bref »** (Pour qui · Ce que je traite · Quand) — composant `EnBref.tsx`, rendu en texte brut (pas d'image), lisible par les LLM.
- Les **FAQ** sont rédigées sous forme de questions/réponses courtes, en HTML sémantique (`<dt>` / `<dd>` ou `<h3>` + `<p>`), et reflétées dans le JSON-LD `FAQPage`.
- Pas de contenu derrière JavaScript pur — tout le contenu textuel doit être dans le HTML rendu statique.
- Les textes ne contiennent **jamais** de références à "locataires" ou "bailleurs" de manière exclusive — le cabinet couvre les deux parties.

---

## 6. Contenu — règles éditoriales

- **Aucun fait propre au cabinet inventé** : honoraires, résultats, Barreau, date d'inscription — laisser les emplacements vides ou marqués `[À compléter]`.
- Le contenu juridique (loi Pinel, ILC/ILAT, L.145-14…) est **factuel et général** — ne jamais présenter comme avis juridique.
- **Premier échange** : appel de qualification **gratuit**, sans engagement.
- **Aide juridictionnelle** : non pratiquée — à mentionner explicitement sur la page Honoraires.
- Ton : expert, direct, sans jargon inutile. Pas d'emojis.

---

## 7. Formulaire de contact

- Route API : `POST /api/contact`
- Validation : Zod côté serveur
- Anti-spam : **Turnstile** (Cloudflare) — vérification côté serveur via `challenges.cloudflare.com/turnstile/v0/siteverify`
- Mail : **Resend** — `from: noreply@behaghel-avocat.com`, `to:` adresse du cabinet (variable d'env)
- Variables d'environnement requises : `RESEND_API_KEY`, `RESEND_TO`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Pas de base de données — persistance = email uniquement.

---

## 8. Conventions de code

### Fichiers

- `kebab-case` pour les fichiers et dossiers
- `PascalCase` pour les composants React
- Exports nommés uniquement (sauf pages Next.js qui exigent un default export)
- Imports absolus via alias `@/` (`@/components/…`, `@/lib/…`)

### TypeScript

- `strict: true` — sans exception
- Zéro `any` — `unknown` + narrowing si le type est incertain
- Props typées avec `interface` (pas `type`)
- Réponses API typées dans `src/types/index.ts`

### Styling

- Tailwind v4 uniquement
- Variables CSS pour les couleurs de la charte (pas de valeurs hexadécimales en dur dans les composants)
- Responsive mobile-first (375px → 768px → 1280px)
- Pas de `!important`
- Pas de CSS-in-JS

### Qualité

```bash
pnpm lint        # biome check src/
pnpm typecheck   # tsc --noEmit
pnpm build       # doit passer sans erreur avant tout commit
```

Biome (`biome.json`) : quotes simples, point-virgules `asNeeded`, indent 2 espaces, largeur 100.

### Git

- Branches : `feat/`, `fix/`, `chore/` depuis `main`
- Commits : conventional commits (`feat:`, `fix:`, `docs:`, `chore:`)
- Pas de `Co-Authored-By` dans les messages de commit
- Pre-commit hook : `lint-staged` → Biome

---

## 9. Ce qu'il ne faut jamais faire

- Utiliser Google Fonts CDN — fonts auto-hébergées uniquement.
- Laisser du contenu visible uniquement via JS côté client (nuit au SEO statique).
- Générer du `any` TypeScript.
- Ajouter des features hors scope sans validation.
- Hardcoder des URLs — utiliser `NEXT_PUBLIC_SITE_URL`.
- Créer des fichiers de documentation non demandés.
- Toucher aux secrets — ils sont dans Secret Manager (Firebase), jamais en clair dans le repo.

---

## 10. Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Oui | `https://behaghel-avocat.com` |
| `RESEND_API_KEY` | Oui | Clé API Resend (secret) |
| `RESEND_TO` | Oui | Email de destination du formulaire |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Oui | Clé publique Turnstile |
| `TURNSTILE_SECRET_KEY` | Oui | Clé secrète Turnstile (secret) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Oui | OAuth Keystatic |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Oui | OAuth Keystatic (secret) |
| `KEYSTATIC_SECRET` | Oui | Secret session Keystatic (secret) |
| `NEXT_PUBLIC_SENTRY_DSN` | Prod | DSN Sentry (secret) |

---

## 11. Pages à implémenter (par ordre de priorité)

| Priorité | Page | Slug | Fichier maquette |
|---|---|---|---|
| 1 | Accueil | `/` | `Accueil.dc.html` |
| 1 | Contact | `/contact` | `Contact.dc.html` |
| 1 | Hub services | `/baux-commerciaux` | `Services.dc.html` |
| 2 | À propos | `/a-propos` | `A-propos.dc.html` |
| 2 | Honoraires | `/honoraires` | `Honoraires.dc.html` |
| 2 | Pages services × 6 | `/baux-commerciaux/[expertise]` | `Service-*.dc.html` |
| 3 | Pages secteurs × 7 | `/bail-commercial-[secteur]` | `Secteur-*.dc.html` |
| 3 | Actualités liste | `/actualites` | `Actualites.dc.html` |
| 3 | Article détail | `/actualites/[slug]` | `Article.dc.html` |

---

*Source de vérité design : repo `behaghel-avocat-maquettes` (fichiers `.dc.html`).*  
*Source de vérité stack : `MEMO-STACK.md` (relevé `eqxia-web` au 2026-06-20).*

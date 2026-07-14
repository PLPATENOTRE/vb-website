# CLAUDE.md — behaghel-avocat.com

> Site vitrine de **Victoire Behaghel — Avocate** (droit des baux commerciaux, Lyon).
> **En production** sur Firebase App Hosting, auto-rollout sur push `main`. On est en phase
> de **maintenance et croissance** (contenu, SEO/GEO, veille), plus de construction initiale.

---

## 1. Objectifs

1. **Convertir** — chaque page mène à une prise de rendez-vous (formulaire Contact).
2. **Référencer** — SEO classique + GEO (visibilité dans les réponses des IA génératives).
3. **Durer** — contenu juridique fiable, maintenable par une non-développeuse via Keystatic.

Source de vérité design : repo `behaghel-avocat-maquettes` (fichiers `.dc.html`).

---

## 2. Stack technique

| Brique | Version | Notes |
|---|---|---|
| **Next.js** | `16.2.7` (épinglé) | App Router, `force-static` sur toutes les pages publiques |
| **React / React-DOM** | `19.2.4` (épinglé) | Server Components par défaut, `'use client'` au cas par cas |
| **TypeScript** | `^5` | `strict: true` — zéro `any` |
| **Tailwind CSS** | `^4` | Via `@tailwindcss/postcss`, **pas** de `tailwind.config.js` ; le reset supprime le style par défaut des listes/liens |
| **Biome** | `^2.4.16` | Lint **et** format (remplace ESLint + Prettier) ; ne couvre que `src/` |
| **pnpm** | workspace | Gestionnaire de paquets — ne jamais utiliser `npm` ou `yarn` |
| **Keystatic** | `^0.5.x` | CMS GitHub (mode `github` en prod) pour actualités |
| **Resend** | `^6.x` | Formulaire de contact + digest veille (mail transactionnel) |
| **Turnstile** | `react-turnstile ^1.1` | Anti-spam Cloudflare sur le formulaire |
| **OpenAI** | `openai` (devDep) | `gpt-4.1-mini` — scoring + rédaction de la veille jurisprudence |
| **Sentry** | `@sentry/nextjs ^10.x` | Erreurs — prod only, `tracesSampleRate: 0.1` — **pas encore installé** |
| **Playwright** | `^1.60` | Tests E2E |
| **Firebase App Hosting** | — | Hébergement (Cloud Run, europe-west4) ; `apphosting.yaml` fait foi |
| **Cloudflare** | — | Proxy, Zaraz, Turnstile, R2 (médias) |

### Interdits

- `npm` / `yarn` — pnpm uniquement.
- Google Fonts CDN — **fonts auto-hébergées dans `public/fonts/`** (Cormorant Garamond, Mulish).
- `any` TypeScript — `unknown` + narrowing.
- CSS-in-JS, styled-components, emotion — Tailwind uniquement.
- Bibliothèques de composants (shadcn, Radix, MUI) ou de state (Zustand, Redux) — non approuvées.
- Installer un package sans approbation du chef de projet.
- Ajouter des fonctionnalités hors scope du ticket.

---

## 3. Design system

### Couleurs (variables CSS, jamais de hex en dur dans les composants)

```css
--color-forest:   #2E4739;   /* vert principal, titres, CTA primaire */
--color-forest-dark: #1E342A; /* footer, éléments sombres */
--color-rose:     #CE899E;   /* accent, labels, soulignements, liens dans le contenu */
--color-mint:     #DDEBDD;   /* CTA secondaire, encadrés "En bref" */
--color-cream:    #FCFBF8;   /* fond principal */
--color-sand:     #F4F2EB;   /* fond alterné sections */
```

### Typographies (auto-hébergées)

| Famille | Usage | Règles |
|---|---|---|
| **Cormorant Garamond** | Titres H1–H3, citations, numéros | H1 ≥ 52px / H2 34px / poids 600 |
| **Mulish** | Corps, nav, labels, UI | Corps 400 · 17px · `line-height: 1.85` ; labels uppercase `letter-spacing: 3px` 12px rose |

Jamais d'Inter, Roboto, Arial — sur ce projet, jamais.

---

## 4. Structure du projet (état réel)

```
src/
├── app/
│   ├── (site)/                     # route group : chrome public (Header/Footer)
│   │   ├── page.tsx                # Accueil
│   │   ├── a-propos/ · honoraires/ · contact/
│   │   ├── mentions-legales/ · confidentialite/
│   │   ├── baux-commerciaux/       # hub + 6 expertises (negociation, vie-du-bail,
│   │   │                           #   contentieux, fin-de-bail, cession-fonds-actions, formations)
│   │   ├── bail-commercial-<secteur>/   # 7 DOSSIERS STATIQUES (pas de [crochet] :
│   │   │                           #   commercant, restaurateur, hotelier, industriel,
│   │   │                           #   investisseur, profession-liberale, entrepot-logistique)
│   │   │                           #   → vue partagée SecteurView + secteurs-data.ts
│   │   └── actualites/ + actualites/[slug]/   # liste + article (Keystatic)
│   ├── api/contact/route.ts        # Resend + Turnstile
│   ├── api/keystatic/[...params]/  # OAuth GitHub (réécrit l'origine via x-forwarded-host)
│   ├── keystatic/[[...params]]/    # éditeur (404 en prod tant que storage=local)
│   ├── robots.ts · sitemap.ts · llms.txt/route.ts
│   └── layout.tsx
├── components/  layout/ · seo/ (JsonLd, BreadcrumbNav) · ui/ (EnBref, FaqSection, CtaBox, RevealSection) · forms/
├── lib/         metadata.ts · jsonld.ts · site.ts · articles.ts · secteurs-data.ts · i18n.ts
├── content/articles/*.mdoc         # articles Keystatic (dont brouillons draft de la veille)
└── styles/globals.css              # @font-face, variables CSS, reset

scripts/veille/                     # veille jurisprudence (hors Next.js) — voir §8
```

---

## 5. SEO — règles impératives

### Par page

```tsx
export const metadata: Metadata = {
  title: "Titre explicite — Victoire Behaghel, Avocate",
  description: "150–160 caractères, réponse directe à l'intention.",
  alternates: { canonical: "https://behaghel-avocat.com/slug" },
  openGraph: { type: "website" /* ou "article" */, title: "…", description: "…",
    url: "https://behaghel-avocat.com/slug",
    images: [{ url: "/assets/og-[slug].jpg", width: 1200, height: 630 }], locale: "fr_FR" },
};
```

### JSON-LD (via `src/lib/jsonld.ts`)

- Graphe d'entité par `@id` : `#cabinet` (`[LegalService, Attorney]`) + `#person` (Person) — `provider`/`author`/`publisher` référencés par `@id` (consolidation cross-pages, levier GEO structurel).
- Chaque page service/secteur : `Service` + `FAQPage` + `BreadcrumbList`.
- Accueil : `LocalBusiness`. Articles : `BlogPosting`.

### Fichiers techniques

- `robots.ts` : bloque `/keystatic/`, autorise les crawlers IA (GPTBot, ClaudeBot, Claude-SearchBot, Applebot-Extended, meta-externalagent, Amazonbot…).
- `sitemap.ts` : généré dynamiquement, `lastModified` sur les articles ; **exclut les brouillons** (dérive de `getArticleSlugs`).
- `llms.txt/route.ts` : porté depuis les maquettes.

### GEO

- Encart **« En bref »** (Pour qui · Ce que je traite · Quand) sur chaque page service/secteur — `EnBref.tsx`, texte brut lisible par les LLM.
- FAQ en HTML sémantique, reflétées dans le JSON-LD `FAQPage`.
- **Tout le contenu textuel doit être dans le HTML statique** — jamais derrière du JS client.
- **Ne jamais** cantonner le propos aux « locataires » ou « bailleurs » : le cabinet couvre les deux parties.

---

## 6. Contenu — règles éditoriales

- **Aucun fait cabinet inventé** : honoraires, résultats, Barreau, date d'inscription → laisser vide ou `[À compléter]`.
- Contenu juridique (loi Pinel, ILC/ILAT, L.145-14…) **factuel et général** — jamais présenté comme un avis juridique.
- **Premier échange** : appel de qualification **gratuit**, sans engagement.
- **Aide juridictionnelle** : non pratiquée — à mentionner sur Honoraires.
- Ton : expert, direct, sans jargon inutile. **Pas d'emojis. Jamais « spécialiste/spécialisé »** → « expert/expertise ».

---

## 7. Formulaire de contact

- `POST /api/contact` · validation **Zod** serveur · anti-spam **Turnstile** (vérif serveur via `challenges.cloudflare.com/turnstile/v0/siteverify`).
- Mail **Resend** : `from: noreply@behaghel-avocat.com` (codé en dur), `to:` = `RESEND_TO`.
- **Pas de base de données** — persistance = email uniquement.

---

## 8. Veille jurisprudence (automation)

Chaîne hebdomadaire **hors Next.js** (`scripts/veille/digest.ts`, un seul fichier ; tourne dans GitHub Actions `.github/workflows/veille.yml`, cron lundi + dispatch manuel `dry_run`/`days`). Détail d'activation : `scripts/veille/README.md`.

**Pipeline** : OAuth PISTE → Judilibre `/export` (civ. 3e + com., publiés au Bulletin, `date_type=creation`, **pas** de filtre `type`) → filtre mots-clés déterministe → scoring **OpenAI `gpt-4.1-mini`** (`response_format` json_schema strict + zod) → digest **Resend** (envoyé même vide, texte intégral des décisions en PJ `.txt`).

**Brouillons (score > 7)** : rédaction LLM ancrée sur le texte de l'arrêt + **passe anti-hallucination** (2ᵉ appel) → écrit `src/content/articles/<slug>.mdoc` avec **`draft: true`**, commité sur `main` par le bot.

**Garde-fou absolu** : `draft: true` ⇒ **invisible partout** côté public (liste, page, sitemap, `generateStaticParams`) — filtré dans `lib/articles.ts`. Rien n'est publié sans le geste humain de Victoire (décocher « Brouillon » dans Keystatic). Le contenu généré est une **indication éditoriale, jamais un avis juridique** : relecture obligatoire.

---

## 9. Conventions de code

- Fichiers/dossiers `kebab-case` ; composants `PascalCase` ; exports nommés (sauf pages Next.js `default`).
- Imports absolus via alias `@/`.
- `strict: true` sans exception ; zéro `any` (`unknown` + narrowing) ; props en `interface` ; types API dans `src/types/index.ts`.
- Tailwind v4 uniquement ; variables CSS pour les couleurs charte ; mobile-first (375 → 768 → 1280) ; pas de `!important`.
- **Qualité avant tout commit** : `pnpm lint` (Biome) · `pnpm typecheck` (tsc --noEmit) · `pnpm build`.
- Biome : quotes simples, `;` asNeeded, indent 2 espaces, largeur 100.
- Git : branches `feat/`/`fix/`/`chore/` depuis `main` ; conventional commits ; **pas de `Co-Authored-By`**.
- **Quirk repo** : les commandes `git`/`gh` de l'agent exigent `dangerouslyDisableSandbox: true` ; `http.postBuffer 524288000` déjà posé en config repo-local (sinon `git push` casse en HTTP 400).

---

## 10. Ce qu'il ne faut jamais faire

- Google Fonts CDN — fonts auto-hébergées uniquement.
- Contenu visible seulement via JS client (nuit au SEO statique).
- `any` TypeScript.
- Features hors scope sans validation.
- URLs hardcodées — utiliser `NEXT_PUBLIC_SITE_URL`.
- Fichiers de documentation non demandés.
- Toucher aux secrets — Secret Manager (Firebase) / secrets GitHub / `.env.local`, jamais en clair.
- **Publier du contenu veille sans relecture humaine** (placeholders, citations non vérifiées).

---

## 11. Variables d'environnement

| Variable | Contexte | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | site | `https://behaghel-avocat.com` |
| `RESEND_API_KEY` · `RESEND_TO` | site + veille | Resend (clé secrète) + destinataire formulaire |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` · `TURNSTILE_SECRET_KEY` | site | Turnstile public / secret |
| `KEYSTATIC_GITHUB_CLIENT_ID` · `_SECRET` · `KEYSTATIC_SECRET` | site (build+runtime) | OAuth + session Keystatic |
| `KEYSTATIC_URL` | site (option) | Override origine si proxy App Hosting mal détecté |
| `NEXT_PUBLIC_SENTRY_DSN` | prod | DSN Sentry (à venir) |
| `PISTE_CLIENT_ID` · `PISTE_CLIENT_SECRET` | veille | OAuth PISTE (Judilibre) — secrets GitHub |
| `OPENAI_API_KEY` | veille | Clé OpenAI (`gpt-4.1-mini`) — secret GitHub |
| `VEILLE_TO` | veille | Destinataire(s) du digest |
| `VEILLE_DRY_RUN` · `VEILLE_DAYS` · `JUDILIBRE_BASE_URL` | veille (option) | Aperçu sans envoi · fenêtre jours (défaut 8) · sandbox |

Secrets prod → Google Secret Manager (référencés dans `apphosting.yaml`). Secrets veille → GitHub Actions (repository secrets). Local → `.env.local` (gitignoré).

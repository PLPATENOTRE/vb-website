# Note — Stack technique du site eqxia.com

> Relevé du code source (`eqxia-web`) au 2026-06-20. Versions et faits tirés des
> fichiers de configuration (source de vérité), pas de la doc d'architecture
> (qui décrit parfois une cible non livrée). Ce qui n'est pas dans le repo mais
> opéré côté infra est explicitement signalé comme tel.

---

## 0. Vue d'ensemble en une phrase

Site vitrine **Next.js 16 (App Router) + React 19**, rendu **100 % statique**, en **TypeScript strict**, stylé en **Tailwind v4**, CMS **Keystatic** (stockage GitHub), formulaires via **routes API + Resend + Turnstile**, hébergé sur **Firebase App Hosting** derrière un **proxy Cloudflare**, monitoré par **Sentry**, analytics **Zaraz côté edge** — outillage **pnpm + Biome + Playwright**.

---

## 1. Cœur applicatif (frontend)

| Brique | Version (exacte) | Notes |
|---|---|---|
| **Next.js** | `16.2.7` (épinglé) | App Router, route group `(frontend)`, rendu `force-static` partout |
| **React / React-DOM** | `19.2.4` (épinglé) | Server Components par défaut, `'use client'` au cas par cas |
| **TypeScript** | `^5` | `strict: true`, `target ES2017`, `moduleResolution: bundler`, alias `@/* → src/*` (`tsconfig.json`) |

- Architecture : `src/app/` (routes, layouts, `robots.ts`, `sitemap.ts`, `llms.txt/route.ts`, `api/`), `src/components/` (blocks, pages, layout, seo, forms, cookie-banner), `src/lib/` (i18n + données), `src/hooks/`, `src/styles/`.
- **Bilingue FR/EN** : FR à la racine, EN sous `/en`, slugs localisés centralisés dans `src/lib/i18n.ts`.
- **Contenu en dur dans le code** : les données réelles (services, fiches de formation) vivent dans `src/lib/services-data.ts`, `fiches-data.ts` (+ variantes `.en.ts`), **pas** dans Keystatic à ce stade (cf. §5).

---

## 2. Styling

| Brique | Version | Notes |
|---|---|---|
| **Tailwind CSS** | `^4` | Via `@tailwindcss/postcss` (`postcss.config.mjs`), pas de `tailwind.config.js` (config v4 inline/CSS) |
| **PostCSS** | (plugin Tailwind) | Unique plugin déclaré |
| **Fonts** | self-hosted | 4 familles dans `public/fonts/` : Inter Tight, Instrument Serif, DM Mono, JetBrains Mono — `@font-face` dans `src/styles/globals.css`, `font-display: optional` (Inter) → CLS≈0. **Jamais Google Fonts CDN.** |

Design tokens (couleurs/typo) en variables CSS ; système de marque documenté dans `docs/brand/`.

---

## 3. Langage, qualité & conventions

| Outil | Version | Rôle |
|---|---|---|
| **Biome** | `^2.4.16` | Lint **et** format (remplace ESLint + Prettier). Quotes simples, point-virgules `asNeeded`, largeur 100, indent 2 espaces (`biome.json`) |
| **lint-staged** | `^17` | Applique `biome check --write` sur `*.{ts,tsx,js,jsx,json,css}` au commit |
| **simple-git-hooks** | `^2.13` | Hook `pre-commit` → `lint-staged` |
| **Browserslist** | — | Cible « modern » (Chrome/Edge/FF ≥100, Safari/iOS ≥15.4, Samsung ≥16) pour retirer les polyfills legacy de Next (`.browserslistrc`) |

Scripts : `dev`, `build`, `start`, `lint` (`biome check src/`), `format`, `typecheck` (`tsc --noEmit`).

---

## 4. Backend léger — routes API (`src/app/api/`)

Pas de serveur dédié ni de base de données. Trois routes :

| Route | Méthode | Fonction | Dépendances |
|---|---|---|---|
| `/api/contact` | POST (JSON) | Formulaire contact | Validation manuelle + **Turnstile** (siteverify) + **Resend** (email) |
| `/api/careers` | POST (multipart) | Candidatures + CV | Turnstile + Resend ; CV ≤ 5 Mo, `.pdf/.doc(x)` |
| `/api/healthcheck` | GET | Ping anti-cold-start | `force-dynamic`, `no-store` — cible du Cloud Scheduler |

| Service | Version | Rôle |
|---|---|---|
| **Resend** | `^6.12` | Mail transactionnel (`RESEND_FROM=noreply@eqxia.com`, `RESEND_TO=hello@eqxia.com`) |
| **react-turnstile** | `^1.1` | Widget anti-spam Cloudflare côté client ; vérif serveur via `challenges.cloudflare.com` |
| **Zod** | `^4.4` | Validation de schémas (présent en dépendance) |

---

## 5. CMS — Keystatic

| Brique | Version | Notes |
|---|---|---|
| **@keystatic/core** | `^0.5.50` | Config dans `keystatic.config.ts` |
| **@keystatic/next** | `^5.0.4` | Admin monté sur `/keystatic` + `app/api/keystatic/[...rest]` |

- **Stockage : GitHub** (`repo: Eqxia/eqxia-web`) via OAuth (`KEYSTATIC_GITHUB_*`, `KEYSTATIC_SECRET`).
- Collections déclarées : `services` et `pages`, écrites en JSON dans `content/services/*` et `content/pages/*`, schéma minimal (`slug`, `title`, `description`).
- ⚠️ **Écart à connaître** : le contenu affiché du site provient aujourd'hui des fichiers TS (`src/lib/*-data.ts`), pas de ces collections Keystatic. Keystatic est branché mais sous-exploité (schémas squelettiques).
- `/keystatic/` est bloqué dans `robots.ts`.

---

## 6. Médias & storage

- **Cloudflare R2** (S3-compatible) prévu pour les médias — ADR-003, secrets `R2_*` listés dans la doc.
- ⚠️ **`@aws-sdk/client-s3` (`^3.x`) est en dépendance mais n'est importé nulle part dans `src/`** (grep = 0). Le client R2/S3 est donc **du code mort à ce stade** ; les images sont servies depuis `public/images/` (et/ou `media.eqxia.com` côté infra). À retirer si R2 n'est pas câblé, ou à brancher.

---

## 7. Observabilité & erreurs

| Brique | Version | Notes |
|---|---|---|
| **@sentry/nextjs** | `^10.56` | `sentry.server.config.ts` + `sentry.edge.config.ts` (`tracesSampleRate: 0.1`, actif **prod only**) ; `instrumentation.ts` (register + `onRequestError`) ; client chargé en `requestIdleCallback` (hors JS critique), tracing/replay off, `denyUrls` filtre Zaraz/Turnstile |

---

## 8. Analytics & consentement

- **Cloudflare Zaraz** exécute les tags (GA4) **côté edge** → **zéro JS analytics chargé côté client**. Configuré au dashboard Cloudflare, pas dans le repo.
- **Consent Mode v2** : script inline (`src/components/seo/ConsentModeInit.tsx`), tout `denied` par défaut (RGPD).
- Bannière maison (`src/components/cookie-banner/`), état en `localStorage` (`eqxia-consent`) via `src/lib/consent.ts` + `useConsent`. API Zaraz typée dans `src/types/global.d.ts` (`window.zaraz.consent`), appelée uniquement via helpers défensifs.
- Détail RGPD : `docs/COOKIES.md`.

---

## 9. Hébergement & runtime

- **Firebase App Hosting** (projet `eqxia-website`, `.firebaserc`) — Cloud Run sous le capot. `firebase.json` vide (config dans `apphosting.yaml`).
- `apphosting.yaml` :
  ```yaml
  runConfig: { minInstances: 0, maxInstances: 10, concurrency: 250, cpu: 1, memoryMiB: 512, cpuBoost: true }
  ```
  → **scale-to-zero** (coût) + `cpuBoost` (cold start) + forte concurrence.
- **Variables/secrets** (`apphosting.yaml`) : `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SENTRY_DSN` (secret), `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, et secrets runtime `resend-api-key`, `turnstile-secret-key`, `keystatic-github-client-id/secret`, `keystatic-secret`. Secrets via Secret Manager, jamais en clair.

---

## 10. Infra réseau (opérée hors repo — source : doc d'architecture)

> Non présent dans le code mais structurant. À vérifier au dashboard Cloudflare/GCP.

- **Cloudflare en proxy (mode orange)** devant App Hosting → TTFB Maurice 5-30 ms (levier perf Afrique).
- **Cloudflare R2** (médias, zéro egress), **Turnstile** (anti-spam), **Web Analytics** (cookieless).
- **Cloud Scheduler** : ping `/api/healthcheck` toutes les 5 min → élimine ~95 % des cold starts sans payer `minInstances ≥ 1`.
- **DNS** Cloudflare ; canonicalisation `www → apex` (aussi en 301 dans `next.config.ts`).

---

## 11. Sécurité (`next.config.ts`)

- En-têtes sur toutes les routes : **HSTS** `max-age=63072000; includeSubDomains` (preload volontairement omis), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/micro/geo/topics désactivés).
- **CSP** : présente mais en **`Content-Security-Policy-Report-Only`** uniquement (observation, ne bloque rien). Allowlist : Cloudflare Insights/Challenges, GA, Sentry ; `'unsafe-inline'` requis (RSC bootstrap, JSON-LD, Consent Mode). ⚠️ À passer en mode bloquant une fois 0 violation constatée.

---

## 12. CI/CD, tests & outillage

| Brique | Version | Notes |
|---|---|---|
| **pnpm** | (workspace) | `pnpm-workspace.yaml` : builds autorisés pour `sharp`, `@sentry/cli`, `simple-git-hooks` ; `onlyBuiltDependencies: [sharp]` |
| **Playwright** | `^1.60` | `tests/j3-pages.spec.ts` (+ `validate-j3-pages.sh`) ; `scripts/screenshot-staging.mjs` (captures plein-page FR/EN via Chromium) |
| **Git hooks** | simple-git-hooks | `pre-commit` → lint-staged (Biome) |

Pas de pipeline CI dans le repo (déploiement piloté par App Hosting sur push GitHub ; détails CI/CD = doc, pas code).

---

## 13. Récap des versions (package.json)

**Dependencies** : `next 16.2.7` · `react 19.2.4` · `react-dom 19.2.4` · `@keystatic/core ^0.5.50` · `@keystatic/next ^5.0.4` · `@sentry/nextjs ^10.56.0` · `resend ^6.12.4` · `react-turnstile ^1.1.5` · `zod ^4.4.3` · `@aws-sdk/client-s3 ^3.x` *(inutilisé)*.

**Dev** : `typescript ^5` · `@biomejs/biome ^2.4.16` · `tailwindcss ^4` · `@tailwindcss/postcss ^4` · `@playwright/test ^1.60` · `playwright ^1.60` · `lint-staged ^17` · `simple-git-hooks ^2.13` · `@types/{node ^20, react ^19, react-dom ^19}`.

---

## 14. Points d'attention (écarts & dette)

1. **`@aws-sdk/client-s3` = dépendance morte** dans le code actuel (R2 non câblé). Retirer ou brancher.
2. **Keystatic sous-exploité** : collections minimales, contenu réel encore en TS (`src/lib/*-data.ts`). Décider : tout migrer dans Keystatic, ou assumer le contenu-en-code.
3. **CSP en Report-Only** : protection non effective tant qu'on ne passe pas en mode bloquant.
4. **Pas de DB** (assumé, ADR-007) — toute persistance passe par email (Resend) / GitHub (Keystatic).
5. **Doc d'archi ≠ code** sur plusieurs points SEO/GEO/infra (voir `MEMO-SEO-GEO.md` §8). Traiter la doc comme une cible, pas un inventaire.

---

### Annexe — fichiers source de cette note
`package.json` · `tsconfig.json` · `biome.json` · `next.config.ts` · `apphosting.yaml` · `firebase.json` · `.firebaserc` · `keystatic.config.ts` · `postcss.config.mjs` · `pnpm-workspace.yaml` · `.browserslistrc` · `sentry.{server,edge}.config.ts` · `src/instrumentation.ts` · `src/types/global.d.ts` · `src/app/api/*/route.ts` · `docs/eqxia-web-architecture.md`.

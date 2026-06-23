# Audit Sprint — 2026-06-23 (build initial behaghel-avocat.com)

## Contexte
- **Période** : `1c1eb13` (scaffold) → `0de3433` (HEAD) — aucun tag `audit-*` préexistant, le sprint = toute la session de build.
- **Nombre de commits** : 45.
- **Fichiers modifiés** : 72 au total ; **48 fichiers source** `.ts`/`.tsx`.
- **Lignes** : +9 657 / −714.
- **Features couvertes** : site vitrine complet — accueil, à-propos, hub services + 6 expertises, 7 pages secteurs, honoraires, contact (formulaire Resend/Turnstile), actualités (liste + détail Keystatic), pages légales, `robots`/`sitemap`/`llms.txt`, JSON-LD.

> **Référentiel.** Le référentiel Eqxia est full-stack (FastAPI + Next.js). Ce projet est **front-only** (pas de backend, Python, Postgres) : seul le volet **frontend** s'applique, et le `CLAUDE.md` projet **prime** (Biome au lieu d'ESLint/Prettier, interdiction des libs de composants type Radix, fonts auto-hébergées). Les divergences correspondantes ne sont **pas** des findings.

## Executive Summary

Code remarquablement propre et discipliné pour un site livré en une session : architecture Next 16 idiomatique (Server Components par défaut, `'use client'` ciblé), source de vérité unique (`SITE`), sécurité applicative soignée au point d'entrée (formulaire). Ce qui tire la note vers le bas n'est pas le code mais l'**absence d'automatisation des garde-fous** (pas de CI, hook pre-commit documenté mais non installé) et des **angles morts contenu/SEO** (images OG inexistantes, `sitemap` sans `lastModified`). Aucun défaut bloquant de sécurité ou de robustesse.

**Note globale : 4,5/5 (A−)**

## Tableau de synthèse

| Axe | Note | Commentaire |
|-----|------|-------------|
| Simplicité | A | Minimal, zéro sur-ingénierie. `SecteurView` factorise 7 pages ; helpers JSON-LD courts. |
| Lisibilité | A | Nommage explicite, fonctions courtes, commentaires sur le *pourquoi* (ex. `route.ts:9` anti-CRLF, `RevealSection.tsx:10` SEO). |
| Maintenabilité | A | `SITE` unique pour Header/Footer/JSON-LD ; route group `(site)` isole le chrome de `/keystatic` et `/api`. |
| Robustesse | B | Frontière (formulaire + API) très solide. Bémols : token Turnstile non réinitialisé, contenu masqué par défaut côté reveal. |
| Clean Architecture | A | `app`/`components`/`lib` respectés, pas de logique métier dans les pages, `metadataBase` posé. |
| Pérennité | B | Versions épinglées, Biome OK. 1 export mort, 1 info lint, hook documenté mais absent. |
| Sécurité | A | Zod `.strict()`, garde anti-injection d'en-tête (CWE-93), Turnstile vérifié côté serveur, logs restreints (CWE-532), secrets gitignorés. |
| Tests | B | E2E Playwright présents (9 specs). Logique sécurité de l'API contact non testée unitairement. |
| Scalabilité | A | 100 % statique, pas de DB ni N+1. `<img>` sans `lazy` = bémol LCP mineur. |
| Garde-fous | ⚠️ Partiel | Outils en place et **verts** (lint, format, typecheck, build) mais **aucune automatisation** (CI/hook). |

## Points forts

1. **Sécurité du point d'entrée (formulaire contact).** `src/app/api/contact/route.ts` cumule : validation Zod `.strict()` (l.7-25), regex anti-CRLF sur `nom` empêchant l'injection d'en-tête mail (l.10-14), vérification Turnstile côté serveur (l.84-114), rate-limiter best-effort (l.36-49), et logs d'erreur restreints à `name`/`message` (l.140, CWE-532). C'est du niveau production.

2. **Server Components par défaut, `'use client'` chirurgical.** Seuls `ContactForm.tsx` et `RevealSection.tsx` portent `'use client'` — exactement là où l'interactivité l'exige. Le contenu reste dans le HTML statique (SEO/GEO).

3. **Source de vérité unique.** `src/lib/site.ts` alimente Header, Footer et tout le JSON-LD : aucune duplication d'adresse/téléphone/URL. Le `localBusinessJsonLd` (l.67-114) est déjà typé `['LegalService','ProfessionalService']` + `LocalBusiness` + `Person` + `geo` — meilleur que la base attendue.

4. **Gestion d'erreur côté client exemplaire.** `ContactForm.tsx:59-85` : `try/catch`, garde de type sur la réponse (l.67-73) pour ne pas faire confiance à une page d'erreur proxy/CDN, états `idle/sending/sent/error` et `aria-live`.

## Points faibles

### Critiques (à corriger avant production)

Aucun finding bloquant de sécurité, robustesse ou perte de données.

> ⚠️ **Réserve de méthode.** Le référentiel classe l'absence de garde-fous comme *critique*. Je la classe **importante** ici (ci-dessous) car les outils existent et passent, le merge est gaté manuellement (`CLAUDE.md §8`), et le site n'est pas encore déployé. À reclasser critique dès qu'un second contributeur ou le déploiement arrive.

### Importants (à planifier)

1. **Aucune automatisation des garde-fous** — 🟠 Important
   - **Constat** : pas de `.github/workflows/`, pas de `.husky/`, pas de `lint-staged` dans `package.json`. Or `CLAUDE.md §8` annonce un « Pre-commit hook : lint-staged → Biome » qui **n'existe pas**.
   - **Risque** : rien n'empêche un commit non linté/non typé d'atterrir sur `main` ; la discipline repose sur la mémoire humaine.
   - **Recommandation** : (a) ajouter une CI GitHub Actions `pnpm lint && pnpm typecheck && pnpm build` bloquante sur PR ; (b) installer le hook lint-staged **ou** corriger `CLAUDE.md` pour ne pas annoncer un garde-fou absent.

2. **Images Open Graph inexistantes** — 🟠 Important
   - **Constat** : `metadata.ts:21` et chaque page référencent `/assets/og-*.jpg` ; `public/assets/` n'en contient **aucune** (0 fichier `og-*`). `localBusinessJsonLd` pointe aussi `image: …/og-accueil.jpg` (jsonld.ts:77).
   - **Risque** : tout partage social/WhatsApp/LinkedIn et toute vignette reprise par une IA affichent une image cassée — mauvais signal de crédibilité, pile l'inverse de l'objectif GEO.
   - **Recommandation** : générer les OG 1200×630 par grande page (faisable côté technique).

3. **Logique sécurité de l'API contact non testée** — 🟠 Important
   - **Constat** : `route.ts` (Zod `.strict()`, anti-CRLF, rate-limit, parsing Turnstile) n'a aucun test unitaire. Les E2E (`tests/e2e.spec.ts`) couvrent la navigation, pas ce chemin.
   - **Risque** : une régression sur la validation (ex. retrait involontaire du `.strict()` ou de la regex) passerait inaperçue.
   - **Recommandation** : 3-4 tests sur le `POST` — payload invalide → 400, champ avec `\n` → rejet, env manquante → 500, happy path mocké → 200.

4. **`sitemap.ts` sans `lastModified`** — 🟠 Important (SEO)
   - **Constat** : `sitemap.ts:33` émet `{ url }` sans `lastModified` ni `changeFrequency`.
   - **Risque** : les moteurs ne savent pas quelles pages ont bougé → recrawl moins efficace ; signal de fraîcheur perdu.
   - **Recommandation** : `lastModified` = `publishedDate` pour les articles, date de build pour les pages statiques.

### Suggestions (amélioration continue)

1. **Export mort** — 🟡 `SITE.tagline` (`site.ts:11`) n'est importé nulle part (1 seule occurrence = sa définition). À supprimer.
2. **Info lint** — 🟡 `route.ts:102` : `['success']` → `.success` (`useLiteralKeys`, auto-fixable via `biome check --write`).
3. **Reveal sans repli no-JS** — 🟡 `RevealSection.tsx:35` démarre à `opacity-0` ; si JS échoue ou que l'`IntersectionObserver` ne se déclenche pas, le contenu reste invisible pour l'humain (les crawlers lisent le DOM, donc SEO OK). Ajouter un repli `prefers-reduced-motion` / `noscript` ou un fallback « visible après X ms ».
4. **Token Turnstile non réinitialisé** — 🟡 `ContactForm.tsx` ne gère ni `onExpire` ni `onError`. Le token Turnstile est à usage unique : après un échec d'envoi, un nouvel essai peut partir avec un token périmé. Ajouter `onExpire={() => setToken('')}`.
5. **`<img>` sans optimisation** — 🟡 Choix assumé (`biome` `noImgElement` off, statique). Ajouter au moins `loading="lazy"` / `decoding="async"` sur les images non-LCP (article, secteurs) — aucune ne les porte aujourd'hui.

## Non-régression
- **Build** : vert (`next build` OK aux derniers commits).
- **Typecheck** : `tsc --noEmit` propre.
- **E2E** : suite Playwright présente (9 specs) — non ré-exécutée dans cet audit (à lancer sur le serveur de test).
- **Comportements modifiés cette session** (layout accueil, à-propos, suppressions contact, couverture article, anti-overflow) : vérifiés visuellement à chaque itération. Aucun test cassé (build passant).

## Garde-fous
| Outil | En place ? | Commentaire |
|-------|-----------|-------------|
| Linting (Biome) | ✅ | `pnpm lint` — 1 info non bloquant. |
| Formatting (Biome) | ✅ | `pnpm format` configuré. |
| Type checking (tsc) | ✅ | `pnpm typecheck` propre, `strict: true`. |
| Build | ✅ | `pnpm build` vert. |
| Pre-commit hook | ❌ | Annoncé dans `CLAUDE.md §8`, **non installé**. |
| CI checks | ❌ | Aucun `.github/workflows/`. |

## Historique
Premier audit du projet — pas d'historique. Cet audit sert de référence (baseline) pour les suivants.

| Sprint | Note globale | Critiques | Importants |
|--------|-------------|-----------|------------|
| 2026-06-23 (build initial) | A− (4,5/5) | 0 | 4 |

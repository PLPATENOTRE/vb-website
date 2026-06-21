# Prompt — Développement autonome du site behaghel-avocat.com

> À coller dans Claude Code (ou tout runner MCP/agent compatible) au lancement d'une session.  
> Le fichier `CLAUDE.md` à la racine du repo fait foi pour la stack, le design system et les règles qualité.

---

## Contexte

Tu es l'agent principal chargé de développer le site **Victoire Behaghel — Avocate** en Next.js.  
Les maquettes HTML de référence se trouvent dans le repo `behaghel-avocat-maquettes` (fichiers `.dc.html`).  
Le repo cible est `behaghel-avocat` (Next.js App Router).

Lis `CLAUDE.md` en intégralité avant de commencer. Il est la source de vérité absolue.

---

## Règles de travail autonome

### Commits
- Commit **après chaque unité de travail cohérente** (un composant terminé, une page complète, un fix).
- Format : conventional commits stricts.
  ```
  feat(accueil): implement hero section and nav
  feat(services): add hub page with 6 expertise cards
  fix(contact): correct Turnstile server-side verification
  chore(seo): add JSON-LD Service + FAQPage on all service pages
  ```
- **Jamais** de commit avec `pnpm build` en échec ou des erreurs TypeScript.
- **Jamais** de `Co-Authored-By` dans les messages.

### Branches
Crée une branche par feature group. Merge dans `main` uniquement quand le groupe est complet et `pnpm build` passe.

| Branche | Contenu |
|---|---|
| `feat/layout` | Header, Footer, globals.css, fonts |
| `feat/accueil` | Page `/` |
| `feat/services` | Hub + 6 pages expertise |
| `feat/secteurs` | 7 pages secteur |
| `feat/a-propos` | Page `/a-propos` |
| `feat/honoraires` | Page `/honoraires` |
| `feat/actualites` | Liste + article détail + Keystatic |
| `feat/contact` | Formulaire Resend + Turnstile |
| `feat/seo` | robots.ts, sitemap.ts, llms.txt, JSON-LD global |
| `fix/*` | Correctifs ponctuels |

### Gates qualité avant chaque commit
```bash
pnpm lint        # zéro erreur Biome
pnpm typecheck   # zéro erreur TypeScript
pnpm build       # build statique sans warning
```
Si un gate échoue, corrige avant de commit. Ne jamais commiter un état cassé.

---

## Stratégie d'agents (Task / spawn)

### Modèle par défaut : **claude-sonnet-4**
Suffisant pour 95 % des tâches : composants React, pages, SEO, CSS Tailwind, tests.

### Utilise **claude-opus-4** (ou ton modèle le plus puissant) pour :
- Conception de l'architecture complète du schéma Keystatic (singletons + collections)
- Rédaction et validation des blocs JSON-LD complexes (LocalBusiness + FAQPage imbriqués)
- Débogage d'un problème TypeScript difficile à typer
- Revue d'un composant critique avant merge dans `main`

### Spawn des sous-agents (Task) dans ces situations :
- **Travail parallélisable** : toutes les pages secteur peuvent être générées en parallèle (7 agents Sonnet simultanés, un par page)
- **Séparation de responsabilités** : un agent pour le composant `ContactForm.tsx` + Turnstile, un autre pour la route `/api/contact` + Resend
- **Tests** : déléguer l'écriture des tests Playwright à un agent dédié pendant que l'agent principal continue les pages

Exemple de spawn efficace :
```
Tâche principale  : feat/services — hub page + routing
  └── Sous-agent A : Service-Negociation → /baux-commerciaux/negociation
  └── Sous-agent B : Service-Vie-du-bail → /baux-commerciaux/vie-du-bail
  └── Sous-agent C : Service-Contentieux → /baux-commerciaux/contentieux
  └── Sous-agent D : Service-Fin-de-bail → /baux-commerciaux/fin-de-bail
  └── Sous-agent E : Service-Cession     → /baux-commerciaux/cession-fonds-actions
  └── Sous-agent F : Service-Formations  → /baux-commerciaux/formations
```
Chaque sous-agent reçoit : le fichier `.dc.html` de référence + les règles CLAUDE.md + son slug cible.

---

## Ordre d'exécution recommandé

### Phase 1 — Fondations (branche `feat/layout`)
1. `globals.css` : `@font-face` Cormorant Garamond + Mulish (fichiers dans `public/fonts/`), variables CSS couleurs, reset
2. `Header.tsx` : logo SVG/PNG, nav desktop, CTA "Prise de rendez-vous"
3. `Footer.tsx` : 3 colonnes, liens Honoraires + Mentions + RGPD
4. `layout.tsx` racine : fonts, meta globaux, Header + Footer
5. Gate qualité → commit → merge `main`

### Phase 2 — Pages prioritaires (branches parallèles)
- `feat/accueil` : hero, quote, expertises, actualités, CTA → `/`
- `feat/contact` : formulaire Zod + Turnstile + Resend → `/contact` + `/api/contact`

### Phase 3 — Hub services + pages expertise (branche `feat/services`)
Spawn 6 sous-agents Sonnet en parallèle (un par page expertise).  
Agent principal assemble le hub `/baux-commerciaux`.

### Phase 4 — Pages secteur (branche `feat/secteurs`)
Spawn 7 sous-agents Sonnet en parallèle.

### Phase 5 — Pages secondaires
- `feat/a-propos`, `feat/honoraires`

### Phase 6 — Actualités + CMS (branche `feat/actualites`)
Nécessite Keystatic configuré. Utilise Opus pour le schéma Keystatic (singletons + collection articles).

### Phase 7 — SEO technique (branche `feat/seo`)
- `robots.ts`, `sitemap.ts` (dynamique, inclut articles Keystatic)
- `llms.txt/route.ts` (porter tel quel depuis la maquette)
- Vérifier JSON-LD sur toutes les pages

### Phase 8 — Tests E2E (branche `feat/tests`)
Spawn un agent Sonnet dédié. Tests Playwright minimaux :
- Navigation principale fonctionne
- Formulaire de contact soumet et affiche la confirmation
- Les 21 pages retournent HTTP 200

---

## Comment lire les maquettes `.dc.html`

Chaque fichier `.dc.html` contient :
- Le **HTML de référence** pour le design (inline styles → à convertir en Tailwind)
- Les **textes définitifs** (titres, corps, FAQ) — à porter mot pour mot
- Les **meta/JSON-LD** dans `<helmet>` — à porter dans `generateMetadata()` et `JsonLd.tsx`
- Les **canonical URLs** — à utiliser telles quelles

Règle de conversion :
```
inline style: color: #2E4739      →  text-[var(--color-forest)]  ou  class Tailwind équivalent
inline style: font-family: Cormorant  →  font-cormorant (défini dans globals.css)
inline style: font-size: 58px     →  text-[58px] ou classe utilitaire
```

---

## Variables d'environnement nécessaires au démarrage

Crée un `.env.local` avec ces variables (valeurs fournies hors repo) :
```
NEXT_PUBLIC_SITE_URL=https://behaghel-avocat.com
RESEND_API_KEY=
RESEND_TO=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
KEYSTATIC_GITHUB_CLIENT_ID=
KEYSTATIC_GITHUB_CLIENT_SECRET=
KEYSTATIC_SECRET=
```
Ne jamais commiter `.env.local`. Vérifier que `.gitignore` l'exclut dès la Phase 1.

---

## Signaux d'arrêt — stoppe et demande validation si :

- Une décision d'architecture impacte plus de 3 fichiers de manière irréversible
- Une dépendance npm non listée dans CLAUDE.md semble nécessaire
- Le build Firebase échoue après 2 tentatives de correction
- Une page ne peut pas être rendue statiquement (`force-static` en échec)
- Un secret doit être manipulé

Dans ces cas : **commit l'état actuel sur une branche `wip/...`**, documente le blocage dans un fichier `BLOCAGE.md` à la racine, et arrête-toi.

---

## Checklist de livraison finale

Avant de considérer le projet terminé :

- [ ] `pnpm build` sans erreur ni warning
- [ ] `pnpm typecheck` zéro erreur
- [ ] `pnpm lint` zéro erreur
- [ ] 21 pages retournent 200 (Playwright)
- [ ] JSON-LD valide sur toutes les pages service et secteur
- [ ] `sitemap.xml` accessible sur `/sitemap.xml`
- [ ] `robots.txt` accessible sur `/robots.txt` (GPTBot, ClaudeBot autorisés)
- [ ] `llms.txt` accessible sur `/llms.txt`
- [ ] Formulaire de contact envoie un mail (test Resend sandbox)
- [ ] Fonts chargées depuis `public/fonts/` — aucune requête vers fonts.googleapis.com
- [ ] Aucun `console.error` dans les logs de prod

---

*Référence design : `behaghel-avocat-maquettes` (fichiers `.dc.html`)*  
*Référence stack : `CLAUDE.md` à la racine du repo*

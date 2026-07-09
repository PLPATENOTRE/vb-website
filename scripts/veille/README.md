# Veille jurisprudence — activation

Chaîne automatique hebdomadaire : **Judilibre** (arrêts Cass. civ. 3e + com., publiés au Bulletin, ajoutés à la base sur les 8 derniers jours) → **filtre baux commerciaux** (mots-clés, déterministe) → **scoring de pertinence** (OpenAI `gpt-4.1-mini`, note 0-10 + angle d'article) → **digest email** (Resend), avec le **texte intégral en pièce jointe `.txt`** des décisions détaillées (les 5 mieux notées).

Tourne dans **GitHub Actions** (`.github/workflows/veille.yml`, lundi ~6h30 Paris + déclenchement manuel). Jamais dans le site Next.js. C'est la **Phase 1** du plan (veille seule — pas de rédaction automatique) ; Phase 2 (brouillons d'articles `draft: true` dans Keystatic) et Phase 3 (articles ILC/ILAT trimestriels) viendront après validation du signal.

---

## 1. Créer les identifiants PISTE (Judilibre) — ~10 min, gratuit

1. Créer un compte sur **https://piste.gouv.fr** (portail API de l'État).
2. Une fois connecté : **Applications → Créer une application** (nom libre, ex. `veille-behaghel`).
3. Dans l'application : onglet **API souscrites** (ou « Souscriptions ») → chercher **Judilibre** → souscrire à l'API **Judilibre (production)**. La souscription est gratuite et immédiate.
4. Onglet **Authentification / Identifiants OAuth** : récupérer le **Client ID** et le **Client Secret** (flux `client_credentials`).

> Il existe aussi un environnement *sandbox* Judilibre (`sandbox-oauth.piste.gouv.fr` / `sandbox-api.piste.gouv.fr`). Le script pointe la **production** par défaut ; pour tester sur la sandbox, poser `JUDILIBRE_BASE_URL` en plus.

## 2. Clé API OpenAI — ~5 min

1. **https://platform.openai.com** → API keys → Create new secret key. Créditer un peu le compte (Billing) si nécessaire.
2. Modèle utilisé : `gpt-4.1-mini`. Coût réel : ~1 appel/semaine sur quelques textes courts → **quelques centimes par mois**.

## 3. Secrets GitHub — ~5 min

Sur **github.com/PLPATENOTRE/vb-website → Settings → Secrets and variables → Actions → New repository secret**, créer :

| Secret | Valeur |
|---|---|
| `PISTE_CLIENT_ID` | Client ID PISTE (étape 1) |
| `PISTE_CLIENT_SECRET` | Client Secret PISTE (étape 1) |
| `OPENAI_API_KEY` | Clé OpenAI (étape 2) |
| `RESEND_API_KEY` | La même clé `re_…` que celle du formulaire de contact (dashboard Resend) |
| `VEILLE_TO` | Destinataire(s) du digest, séparés par des virgules — commencer par Pierre-Louis seul pour superviser |

L'email part de `noreply@behaghel-avocat.com` (domaine déjà vérifié dans Resend).

## 4. Premier run (validation)

1. GitHub → **Actions → Veille jurisprudence → Run workflow** → cocher **dry run** → lancer.
2. Lire le log : nombre de décisions collectées / retenues, scores, aperçu du digest. *(C'est le premier appel réel à Judilibre : si l'API renvoie une erreur de paramètres, me la copier — les noms de paramètres de `/export` seront ajustés en un commit.)*
3. Si le log est bon : relancer **sans** dry run → vérifier la réception de l'email.
4. Ensuite, plus rien à faire : cron chaque lundi. Un digest « rien de pertinent cette semaine » est normal et confirme que la chaîne vit. Un workflow **rouge** = panne (GitHub notifie par email).

## En local (optionnel)

Mets les identifiants dans **`.env.local`** (déjà gitignoré — jamais committé) :

```bash
PISTE_CLIENT_ID=…
PISTE_CLIENT_SECRET=…
OPENAI_API_KEY=…
# RESEND_API_KEY=… VEILLE_TO=…   # seulement pour un envoi réel ; en dry-run inutiles
```

Le script est un programme Node autonome (pas Next.js) : il **ne lit pas** `.env.local` tout seul. On le passe explicitement avec `--env-file` :

```bash
# Collecte + scoring, sans envoyer d'email (aperçu du digest dans le log) :
VEILLE_DRY_RUN=1 node --env-file=.env.local --experimental-strip-types scripts/veille/digest.ts

# Test du filtre, sans réseau ni clés :
node --experimental-strip-types scripts/veille/digest.ts --selftest
```

Variables optionnelles : `VEILLE_DAYS` (fenêtre, défaut 8), `JUDILIBRE_BASE_URL` (sandbox).

## Brouillons d'articles (Phase 2, score > 7)

Pour toute décision jugée **très pertinente (score > 7)**, la veille crée en plus un **brouillon d'article** :

1. Écriture d'un `src/content/articles/<slug>.mdoc` avec `draft: true`, commité sur `main` par le workflow.
2. `draft: true` ⇒ **invisible sur le site** (liste, page, sitemap) — vérifié au build. Le brouillon n'existe que dans l'éditeur **Keystatic**.
3. Le mail signale « → brouillon créé dans Keystatic ».
4. Victoire ouvre le brouillon dans Keystatic, **relit / complète**, **décoche « Brouillon »**, enregistre → commit → l'article passe en ligne.

> ⚠️ Le **contenu** du brouillon est aujourd'hui un **squelette** (titre = angle proposé, chapô = justification, corps à rédiger). La génération du vrai texte (à partir du texte intégral de l'arrêt + passe anti-hallucination) est la brique suivante. Un brouillon ne se publie jamais tel quel.

## Garde-fous

- **Aucune publication automatique** : la chaîne envoie un email et dépose des **brouillons invisibles** (`draft: true`). Rien n'est publié sans le geste humain de Victoire (décocher « Brouillon » dans Keystatic).
- Les scores et angles sont générés par IA → **indication éditoriale, pas analyse juridique**.
- Coût total : 0 € (Judilibre + Actions gratuits) + centimes OpenAI.

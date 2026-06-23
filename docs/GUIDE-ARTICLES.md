# Guide — Ajouter un article (Actualités)

Comment publier un article via Keystatic, le CMS du site. Aucune connaissance technique requise.

> **Bon serveur :** l'admin tourne sur **http://localhost:3000** (`:3000`). Si tu vois `:3100` quelque part, c'est un vieux build figé — ignore-le.

---

## 0. Démarrer le site en local

Dans un terminal, à la racine du projet :

```bash
pnpm dev
```

Puis ouvre l'interface d'administration : **http://localhost:3000/keystatic**

Tu arrives sur le tableau de bord, avec la collection **Actualités** et le nombre d'articles existants.

---

## 1. Créer l'article

1. Clique sur **Actualités** (menu de gauche), puis sur le bouton **« + Add »**.
2. Remplis les champs (★ = obligatoire) :

| Champ | Ce que c'est | À savoir |
|---|---|---|
| **Titre** ★ | Le titre affiché partout | Le **Slug** (l'adresse de la page) se génère automatiquement. Bouton ↻ pour le régénérer si tu modifies le titre. |
| **Date de publication** ★ | Format `AAAA-MM-JJ` | Sert au tri : le plus récent apparaît en haut de la liste. |
| **Catégorie** | Défaut « Bail commercial » | S'affiche dans l'encart de couverture quand aucune image n'est renseignée. |
| **Temps de lecture** | ex. « 5 min de lecture » | Optionnel. |
| **Chapô / extrait** ★ | Résumé court | Sert à la fois de **sous-titre** de l'article et de **texte d'accroche** dans la liste. |
| **Article à la une** | Case à cocher | Met l'article en avant (voir [pièges](#les-3-pièges-à-connaître)). |
| **Image de couverture** | « Choose file » → upload | Optionnel. Sinon, un encart taupe avec la catégorie s'affiche. |
| **Contenu** | L'éditeur (grande zone) | Tape `/` pour insérer un bloc : titre, liste, citation, séparateur. Les titres sont mis en forme automatiquement. |

3. Clique sur **« Create »** (en haut à droite).

---

## 2. Vérifier le résultat

En local, l'article est visible **immédiatement** (pas besoin d'attendre).

- **Liste** : http://localhost:3000/actualites
- **Page de l'article** : http://localhost:3000/actualites/`<slug>`

Le fichier de l'article est écrit dans `src/content/articles/<slug>.mdoc`. Si tu as ajouté une couverture, elle est rangée dans `public/assets/articles/<slug>/`.

---

## 3. Modifier ou supprimer

- **Modifier** : Actualités → clique sur l'article → modifie → **« Save »**.
- **Supprimer** : ouvre l'article → bouton **« Delete entry… »**.

---

## Les 3 pièges à connaître

1. **« À la une » :** la une affiche le **premier article coché** `featured` ; à défaut, le plus récent. Donc si tu coches un nouvel article **sans décocher l'ancien**, c'est le plus récent des deux qui passe à la une, et l'autre redescend dans la liste. Pour un résultat sans surprise : **un seul article coché à la fois**.

2. **Couverture vide = placeholder.** Un encart taupe avec la catégorie s'affiche à la place de l'image. C'est normal, pas un bug.

3. **C'est du WYSIWYG, pas du Markdown.** Tu rédiges dans l'éditeur, Keystatic s'occupe d'écrire le fichier. Ne modifie jamais le `.mdoc` à la main.

---

## ⚠️ En local vs en production

Aujourd'hui, le site est en **stockage local** (`storage: local`) : tes articles d'essai sont de **vrais fichiers dans le projet**.

- Quand tu t'entraînes, **supprime les articles bidons** avant tout commit (sinon ils seront publiés).
- En production (stockage GitHub, pas encore en place), le bouton « Create » créera automatiquement un commit GitHub puis un redéploiement du site — l'article sera en ligne après quelques minutes.

---

## Aide-mémoire éditeur de contenu

Dans la zone **Contenu**, tape `/` pour ouvrir le menu des blocs :

- **Titre** (H2 / H3) — structure l'article, bon pour le référencement.
- **Liste** à puces ou numérotée.
- **Citation** — encart mis en valeur.
- **Séparateur** — trait horizontal.
- **Lien** — sélectionne le texte puis ajoute l'URL.

Garde des phrases courtes et un titre toutes les 2-3 paragraphes : c'est plus lisible et mieux référencé.

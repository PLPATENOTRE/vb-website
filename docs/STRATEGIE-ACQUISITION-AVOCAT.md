# Stratégie d'acquisition — Cabinet Behaghel (SEO + GEO agressif, sans risque)

**Public** : chef de projet / dev (pas Victoire). Document de travail interne : le plan d'attaque concret et agressif pour maximiser le reach sur le thème **« droit immobilier professionnel »**, en restant dans les clous.

> Complément, pas doublon : `note-referencement-seo-genai.md` = le playbook générique (fondations, architecture, schema). **Ici = le plan d'attaque spécifique au cabinet + les tactiques offensives + les garde-fous.**

---

## 0. Le principe qui tranche tous les arbitrages

Deux contraintes dominent tout le reste :

1. **YMYL + profession réglementée = risk-first.** Un site juridique (« Your Money Your Life ») est traité par Google avec une exigence E-E-A-T maximale, et une action manuelle sur un domaine = cabinet grillé (un domaine = un nom, pas jetable). S'ajoute le risque ordinal (CNB : publicité trompeuse). **Toute tactique se juge sur `espérance de gain − risque`, pas sur le gain seul.**

2. **Une spécialisation rare bat la géographie.** Un dirigeant à Grenoble avec un litige de bail commercial complexe embauche l'experte lyonnaise (déplacement / visio). Donc : **ranker national sur le SUJET > ranker local sur 30 villes.** Le géographique est un bonus, pas le cœur. Ce principe à lui seul dégonfle l'obsession « pages par ville ».

---

## 1. Ce qu'on refuse — et pourquoi (froidement)

| Tactique | Pourquoi c'est tentant | Pourquoi on refuse |
|---|---|---|
| **PBN / achat de backlinks** | Gain de « domain authority » rapide | Détection Penguin + action manuelle. Sur YMYL, sanction quasi assurée à terme. Domaine grillé. |
| **Faux avis + `AggregateRating`** | Étoiles en SERP, réassurance | Faux témoignage = faute déontologique **et** rich-result spam. Double exposition (Google + Ordre). |
| **Doorways « avocat bail commercial + [30 villes] »** | Couverture géo massive | Pages quasi-dupliquées = doorway spam, explicitement interdit (Google Search Essentials). Le pire ROI risque/gain sur YMYL. |
| **Texte caché / cloaking** (villes en `display:none`, couleur = fond, hors-écran) | « Les mots-clés servent sans alourdir la page » | **Cloaking pur = action manuelle la plus rapide qui soit.** C'est *exactement* la tactique qui délisté un site juridique. Voir §2.4 pour la version transparente qui capte le même trafic. |

**Règle simple :** si une tactique repose sur le fait que Google **ne voie pas** ce que voit l'utilisateur (ou l'inverse), on ne la fait pas.

---

## 2. L'arsenal légitime, par ROI décroissant

Chaque tactique : 🧠 l'idée · ⚙️ le mécanisme · 📍 comment on l'exécute ici.

### 2.1 Barnacle SEO — parasiter l'autorité des géants juridiques

🧠 Se coller à un gros bateau plutôt que de construire le sien : publier là où l'autorité existe déjà.
⚙️ Des domaines à autorité écrasante (Village de la Justice, Doctrine, LegaVox) rankent **devant** les sites de cabinets sur presque toute requête juridique — et sont **massivement scrapés par les LLM**.
📍 Exécution :
- **Village de la Justice** (le n°1) : republier une version « tribune » adaptée de chaque article, avec lien bio vers les pages service. Une tribune par article publié.
- Profil complet sur **Doctrine.fr** et **LegaVox**.
- Ne pas copier-coller l'article du site (éviter le doublon) : angle légèrement différent, le site reste la source canonique.

### 2.2 Newsjacking jurisprudence — la fenêtre des 48 h

🧠 Écrire sur l'actu chaude avant tout le monde.
⚙️ Sur un arrêt donné, Google et les LLM citent la source la plus **claire** et la plus **fraîche**. Juste après la publication d'un arrêt, cette place est vide.
📍 Exécution :
- **Veille** : Légifrance (alertes), Dalloz Actualité, Lexbase, comptes X d'universitaires en droit immobilier, revues de baux commerciaux.
- **Cible** : arrêts Cass. 3e civ. et com. publiés au Bulletin (portée de principe).
- **Cadence** : commentaire clair publié sous 48 h. Gabarit d'article court réutilisable (l'article « expertise amiable » est le modèle).

### 2.3 Programmatic légitime — une page par article de code

🧠 Industrialiser des pages **réellement utiles**, une par texte de loi clé.
⚙️ Les professionnels **et les LLM** cherchent par numéro d'article (« article L.145-14 »). Intention haute, concurrence propre faible. C'est **le levier de reach “droit immobilier professionnel” le plus scalable** sans quitter le périmètre.
📍 ~15-20 pages, chacune : définition + texte de l'article + explication + jurisprudence clé + lien vers la page service. Cibles :

- `L.145-14` — indemnité d'éviction
- `L.145-33` — valeur locative
- `L.145-37 à 39` — révision du loyer
- `L.145-4` — durée / congé triennal
- `L.145-40-2` — inventaire des charges (loi Pinel)
- `L.145-46-1` — droit de préférence du locataire
- `606 C. civ.` — grosses réparations
- `L.145-9` — congé et formes
- `L.145-47 à 55` — déspécialisation

**Garde-fou anti-doorway :** chaque page a un contenu **unique et réel**. Zéro template rempli par variable. Si une page n'apporte rien de plus qu'un copier-coller de Légifrance, on ne la publie pas.

### 2.4 Multi-villes / zones d'intervention — la marche à suivre

**Ton intuition (couvrir des villes) est bonne. Le mécanisme « les noms servent au SEO mais n'apparaissent pas clairement » est le piège.** Si « pas clairement » = texte caché → c'est du cloaking (§1) → la chose la plus risquée pour ce site. On atteint le **même objectif, en transparent** :

- **Étape 1 — La vraie liste.** Établir les villes réellement servies (honnête, pas 30 au hasard) : Lyon + AURA (Villeurbanne, Saint-Étienne, Grenoble, Clermont-Ferrand, Chambéry, Annecy, Bourg-en-Bresse, Valence…) + hubs nationaux si intervention réelle.
- **Étape 2 — UNE page « Zones d'intervention »** (`/zones-intervention`), pas 30. Villes en **texte visible**, cadrage honnête : « Basée à Lyon, j'interviens dans toute la région Auvergne-Rhône-Alpes et partout en France, en déplacement ou en visioconférence. » Capte le long-tail « avocat bail commercial [ville] » sans dupliquer.
- **Étape 3 — Le signal « discret mais transparent » que tu cherches = les données structurées `areaServed`.** Lister les villes en `Place`/`City` dans le JSON-LD : **lu par Google et les LLM, présent dans le HTML, non dominant visuellement.** C'est la façon *légitime* de faire « les villes servent au SEO sans crier sur la page ». + un rappel discret en footer (« Zones : Lyon · Grenoble · Saint-Étienne · … »).
- **Étape 4 (optionnel, si on scale PROPREMENT) — pages par juridiction à contenu différencié.** Ex. « Le bail commercial devant le Tribunal judiciaire de Grenoble » **avec** le vrai contexte local (quelle juridiction, spécificités du marché commercial local). Quality-gated : **~10 max, contenu unique obligatoire**. Une page templatée ville-swap = doorway = on ne la fait pas.

**Verdict :** page zones + `areaServed` + fiche Google (Lyon) captent ~90 % du gain géo légitime. Les 30 doorways = 100 % du risque pour ~10 % de gain incrémental. **On fait les étapes 1-3 ; l'étape 4 seulement si le contenu local est réel.**

### 2.5 Citations & annuaires — répandre le NAP

🧠 Être présent, à l'identique, partout où l'entité est vérifiée.
⚙️ Ces annuaires sont des **sources primaires** que les LLM interrogent pour « avocat bail commercial Lyon ».
📍 Cibles, par ordre de force : **consultation.avocat.fr** (annuaire officiel CNB), **annuaire du Barreau de Lyon**, **Doctrine.fr**, **Justifit**, **Alexia.fr**, Pages Jaunes pro, **Google Business Profile** (cf. TODO Victoire).
**Règle d'or : NAP (Nom-Adresse-Téléphone) strictement identique partout** — la moindre variation (« bd » vs « boulevard ») dilue le signal.

### 2.6 Knowledge Graph — graphe d'entité + Wikidata

🧠 Faire comprendre aux machines que « Victoire Behaghel » = **une** entité, partout la même.
⚙️ Aujourd'hui le `Person` de l'accueil et l'`author` des articles sont des nœuds distincts pour un parseur.
📍 Deux actions :
- **On-site (lot technique)** : poser des `@id` stables (`…/#person`, `…/#cabinet`) et les référencer dans tous les blocs JSON-LD → consolidation.
- **Wikidata** : créer l'entrée entité **quand la notoriété le justifie** (publications, interventions). Gris clair, coût faible, sans garantie — alimente le panneau de connaissance Google.

---

## 3. Séquencement (par ROI, dans l'ordre)

1. **Lot technique on-site** (voir la section dédiée / branche technique) — la fondation.
2. **Fiche Google + citations (NAP)** — rapide, gros ROI local.
3. **Programmatic articles de code** (~15-20 pages) — le reach « droit immobilier pro » scalable.
4. **Newsjacking** (continu) + **Barnacle** (une tribune par article).
5. **Zones d'intervention** (page + `areaServed`).
6. **Wikidata** quand la notoriété le justifie.

---

## 4. Mesure

- **Google Search Console** : vérifier la propriété **domaine** (TXT Squarespace) **dès maintenant** — l'historique démarre à la validation, pas au flip DNS.
- **Bing Webmaster Tools** : non négociable — **ChatGPT search cite l'index Bing.**
- **Tests de prompts LLM récurrents** : « meilleur avocat bail commercial Lyon », « comment est calculée l'indemnité d'éviction », « article L.145-14 » — noter si/où le cabinet ressort.
- **Logs** : suivre les passages de GPTBot / ClaudeBot / PerplexityBot.

---

*Renvois : `note-referencement-seo-genai.md` (playbook générique) · `TODO-CONTENU-VICTOIRE.md` (ce que Victoire fournit) · `GUIDE-QUOTIDIEN-VICTOIRE.md` (ses réflexes éditoriaux).*

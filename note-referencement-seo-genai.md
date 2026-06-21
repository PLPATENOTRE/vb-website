# Playbook SEO + GenAI

Objectif : maximiser le référencement naturel d'un site à la fois sur les moteurs de recherche classiques, comme Google et Bing, et sur les outils GenAI, comme ChatGPT, Claude, Gemini ou Perplexity.

La logique centrale est simple : le site doit être indexable, compréhensible, crédible, cité, facile à résumer et orienté conversion. Il ne s'agit pas seulement d'ajouter des mots-clés, mais de construire une surface d'acquisition complète.

## 1. Fondations techniques

Un site performant en SEO et en GenAI doit d'abord être facilement accessible aux robots.

À mettre en place :

- HTML rendu côté serveur ou statique pour les pages importantes.
- `robots.txt` propre, avec une stratégie claire pour Googlebot, Bingbot, OAI-SearchBot, ClaudeBot, PerplexityBot et GPTBot.
- `sitemap.xml` exhaustif avec `lastModified`.
- Balise canonical sur chaque page.
- Hreflang si le site est multilingue.
- Redirections 301 propres.
- Pages 404 utiles.
- Mobile impeccable.
- Core Web Vitals solides : LCP, CLS, INP.
- Images optimisées en WebP ou AVIF.
- Contenu important visible dans le HTML, pas uniquement injecté par JavaScript.
- Google Search Console, Bing Webmaster Tools et analyse des logs serveur.

## 2. Architecture SEO

Le site doit être pensé comme une machine à capter des intentions de recherche.

Structure recommandée :

- Page d'accueil : positionnement clair.
- Pages services.
- Pages produits.
- Pages secteurs.
- Pages cas d'usage.
- Pages transactionnelles : service + ville, pays, secteur ou cible.
- Pages comparatives : `X vs Y`, alternative à un outil, meilleur choix selon le contexte.
- Pages guides : contenus longs, utiles et durables.
- Pages preuves : cas clients, témoignages, résultats.
- Pages ressources : templates, checklists, calculateurs, PDF, outils gratuits.
- Glossaire métier.
- FAQ hub.

Règle : une page doit répondre à une intention principale.

Exemples :

- `/services/formation-ia`
- `/secteurs/hotellerie`
- `/cas-clients/automatisation-support`
- `/guides/comment-choisir-un-crm`
- `/comparatifs/hubspot-vs-pipedrive`
- `/outils/calculateur-roi`

## 3. Contenu pour les moteurs de recherche

Google et Bing valorisent le contenu utile, original, structuré et vérifiable.

Chaque page importante doit contenir :

- Un H1 explicite.
- Une réponse claire dès le début.
- Des sections H2/H3 orientées questions.
- Des exemples concrets.
- Des données chiffrées.
- Des preuves.
- Des tableaux comparatifs.
- Une FAQ.
- Un auteur ou une source responsable.
- Une date de mise à jour si le contenu évolue.
- Des liens internes vers les pages liées.
- Un CTA adapté à l'intention de recherche.

À éviter :

- Pages vagues et purement marketing.
- Contenu trop abstrait.
- Jargon non expliqué.
- Pages quasi dupliquées.
- Texte uniquement dans les images ou dans les PDF.
- FAQ artificielles non visibles sur la page.

## 4. Contenu pour les outils GenAI

Les outils GenAI favorisent les contenus faciles à comprendre, résumer et citer.

À mettre en place :

- Réponses directes aux questions complexes.
- Blocs `En bref`.
- Tableaux : pour qui, prix, durée, livrables, limites, résultat.
- Pages comparatives honnêtes.
- Pages de choix : quel outil, quelle méthode, quel service selon le contexte.
- Faits stables et citables.
- Ressources Markdown ou texte clair quand pertinent.
- Fichier `/llms.txt`.
- Fichier `/llms-full.txt` si le site a beaucoup de contenu.
- Versions Markdown des pages stratégiques si utile.

Format efficace pour les GenAI :

```text
Question : Pour qui est ce service ?
Réponse courte : ...
Cas idéal : ...
Non recommandé si : ...
Livrables : ...
Délai : ...
Prix : ...
Preuves : ...
```

## 5. Données structurées

Les données structurées aident les moteurs à comprendre l'entité, les offres et les preuves.

Schémas à utiliser selon le site :

- `Organization`
- `LocalBusiness`
- `ProfessionalService`
- `Person`
- `Product`
- `SoftwareApplication`
- `Service`
- `FAQPage`
- `BreadcrumbList`
- `Article`
- `BlogPosting`
- `Course`
- `Event`
- `JobPosting`
- `Review`, uniquement si les avis sont réels et attribuables.
- `AggregateRating`, uniquement si conforme et vérifiable.

Indispensable :

- Logo valide.
- `sameAs` vers réseaux sociaux, profils et annuaires fiables.
- Adresse et contact si activité locale.
- Breadcrumbs.
- Données cohérentes avec le contenu visible.

## 6. Images et médias

Les images ne servent pas seulement au design. Elles renforcent la crédibilité, le partage social et la compréhension du site.

À mettre en place :

- Image Open Graph 1200x630 par grande page.
- Image Twitter/X.
- Alt text descriptif.
- Noms de fichiers propres : `formation-ia-maurice.webp`.
- Images originales si possible : équipe, produit, événements, captures, clients, bureaux.
- Schémas et infographies.
- Screenshots produit.
- Vidéos courtes avec transcription texte.
- PDF téléchargeables, mais contenu également disponible en HTML.

Pour les outils GenAI, les transcriptions et descriptions textuelles sont plus exploitables que le visuel seul.

## 7. Autorité et confiance

Le site doit démontrer pourquoi il mérite d'être recommandé.

À renforcer :

- Page À propos crédible.
- Bios détaillées des fondateurs ou experts.
- Expérience, spécialités, références, conférences.
- Cas clients.
- Témoignages réels.
- Logos clients si autorisés.
- Mentions presse.
- Liens depuis sites partenaires.
- Présence LinkedIn.
- Pages légales complètes.
- Politique de confidentialité.
- Contact facile à trouver.
- Adresse ou zone servie.

Les moteurs génératifs ont besoin de signaux fiables pour répondre à la question implicite : pourquoi recommander cette entreprise ?

## 8. Maillage interne

Le maillage interne doit pousser les pages business et clarifier les relations entre les contenus.

À faire :

- Chaque guide renvoie vers une page service.
- Chaque service renvoie vers des cas clients, FAQ, guides et contact.
- Chaque cas client renvoie vers service, secteur et technologie associés.
- Chaque page secteur renvoie vers les offres adaptées.
- Footer structuré.
- Breadcrumbs.
- Blocs `Articles liés`.
- Blocs `Cas associés`.
- Ancres descriptives, plutôt que `cliquez ici`.

Objectif : aucune page stratégique ne doit être isolée.

## 9. Pages à fort ROI acquisition

Les pages les plus intéressantes sont celles qui captent une intention proche de l'achat.

Types de pages à créer :

- `Agence [service] à [ville/pays]`
- `Consultant [expertise] pour [secteur]`
- `Formation [sujet] certifiée`
- `Prix de [service]`
- `Alternative à [outil]`
- `[outil A] vs [outil B]`
- `Meilleur [outil/service] pour [profil]`
- `Comment faire [tâche]`
- `Template [livrable]`
- `Checklist [processus]`
- `Calculateur [ROI/coût/gain]`
- `Cas d'usage [technologie] dans [secteur]`
- `Exemple de cahier des charges [projet]`

Ces pages fonctionnent bien en SEO et sont souvent reprises par les outils GenAI dans les réponses comparatives.

## 10. Boucle d'acquisition

Il ne faut pas publier au hasard. Il faut construire une boucle.

Processus recommandé :

1. Identifier les questions clients, objections commerciales et requêtes Google.
2. Créer une page ciblée.
3. Ajouter JSON-LD, liens internes et image OG.
4. Publier.
5. Soumettre via sitemap et Search Console.
6. Distribuer sur LinkedIn, newsletter, communautés et partenaires.
7. Suivre impressions, clics, conversions et citations GenAI.
8. Améliorer tous les 30 jours.

Sources d'idées :

- Appels commerciaux.
- Emails clients.
- Search Console.
- People Also Ask.
- Forums et communautés.
- LinkedIn comments.
- Prompts ChatGPT, Claude, Gemini, Perplexity.
- Sites concurrents.
- Avis clients.
- Support client.
- CRM.

## 11. Distribution off-site

Le SEO moderne ne dépend pas uniquement du site.

À faire :

- LinkedIn des fondateurs.
- LinkedIn entreprise.
- Guest posts ciblés.
- Podcasts.
- Webinars.
- Annuaires de qualité.
- Pages partenaires.
- Conférences.
- Études propriétaires.
- Outils gratuits.
- Templates partageables.
- Backlinks depuis ressources sectorielles.
- Mentions de marque cohérentes.

Pour les outils GenAI, les mentions externes renforcent l'entité. Si plusieurs sources fiables disent la même chose, la marque devient plus recommandable.

## 12. Fichiers pour IA

À créer :

- `/llms.txt` : résumé court, liens essentiels, offres, faits stables.
- `/llms-full.txt` : version longue.
- Pages Markdown optionnelles.
- Sitemap propre.
- Flux RSS si contenu régulier.
- Dataset public léger si pertinent.

Contenu recommandé de `/llms.txt` :

- Nom de marque.
- Description en une phrase.
- Public cible.
- Services ou produits.
- Pages clés.
- Prix ou fourchettes si possible.
- Zone géographique.
- Contact.
- Faits vérifiables.
- Liens vers guides et cas clients.

## 13. Mesure

Sans mesure, l'acquisition organique ne se pilote pas.

À suivre :

- Pages indexées.
- Requêtes Google.
- CTR.
- Positions.
- Conversions par page.
- Pages qui génèrent des leads.
- Crawl bots.
- Erreurs 404.
- Performance Core Web Vitals.
- Backlinks.
- Mentions de marque.
- Apparitions dans ChatGPT, Claude, Gemini ou Perplexity via tests manuels récurrents.
- Prompts où le site doit apparaître.

Tableau mensuel recommandé :

- Top pages SEO.
- Pages à optimiser.
- Pages à créer.
- Requêtes en progression.
- Requêtes business absentes.
- Leads générés.
- Bots GenAI observés dans les logs.

## 14. Ordre d'exécution recommandé

1. Corriger les bases techniques : crawl, sitemap, canonical, performance.
2. Structurer l'entité : Organization, Person, LocalBusiness, `sameAs`.
3. Construire les pages business : services, secteurs, cas d'usage.
4. Créer les pages profondes : guides, comparatifs, templates.
5. Ajouter les données structurées pertinentes.
6. Ajouter images OG, médias crédibles et transcriptions.
7. Mettre en place `/llms.txt` et éventuellement `/llms-full.txt`.
8. Lancer la distribution externe.
9. Mesurer et itérer tous les mois.

## Principe central

Pour gagner en SEO et en GenAI, un site doit devenir une source que les moteurs peuvent résumer sans hésiter.

Chaque page stratégique doit répondre clairement à ces questions :

- Qui êtes-vous ?
- Que faites-vous ?
- Pour qui ?
- Où ?
- Avec quelles preuves ?
- Combien ça coûte ?
- Quels résultats ?
- Quelles limites ?
- Pourquoi vous plutôt qu'un autre ?
- Quelle page faut-il citer ?

Si chaque page répond à ces questions avec du texte clair, des preuves, des liens internes et des données structurées, le site devient beaucoup plus performant sur Google, Bing, ChatGPT, Claude, Gemini et les moteurs hybrides à venir.

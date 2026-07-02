export const dynamic = 'force-static'

// llms.txt — porté de la maquette, URLs alignées sur les routes réelles (§4),
// « Spécialité » -> « Expertise » (règle CLAUDE.md).
const BODY = `# Victoire Behaghel — Avocate en baux commerciaux

> Cabinet d'avocate dédié au droit des baux commerciaux : conseil et contentieux, à chaque étape de la vie du bail. Basée à Lyon, intervention partout en France.

## En bref
- Entité : Victoire Behaghel, Avocate (droit immobilier — baux commerciaux)
- Expertise : bail commercial, exclusivement
- Public : entreprises de tous secteurs — artisans, commerçants, industriels, investisseurs
- Zone : Lyon (siège) — intervention dans toute la France
- Adresse : ALGYR Centre d'affaires, 20 boulevard Eugène Deruelle, 69003 Lyon
- Téléphone : +33 6 50 05 89 73
- LinkedIn : https://www.linkedin.com/in/victoire-behaghel-avocat/
- Prise de rendez-vous : https://behaghel-avocat.com/contact

## Domaines d'expertise
1. Négociation du contrat de bail — sécuriser les clauses dès la signature (destination, charges, travaux, état des lieux).
2. Accompagnement tout au long de la vie du bail — révision, indexation, cession, sous-location.
3. Contentieux du bail commercial — fixation du loyer, impayés, indemnités.
4. Fin de bail : renouvellement ou congé — anticiper l'échéance, indemnité d'éviction.
5. Formations — sessions sur mesure sur le bail commercial, cas pratiques.

## Pages clés
- Accueil : https://behaghel-avocat.com/
- Le cabinet (à propos) : https://behaghel-avocat.com/a-propos
- Les expertises : https://behaghel-avocat.com/baux-commerciaux
- Actualités : https://behaghel-avocat.com/actualites
- Contact / prise de rendez-vous : https://behaghel-avocat.com/contact

## Pages par expertise
- Négociation du bail : https://behaghel-avocat.com/baux-commerciaux/negociation
- Vie du bail (révision, indexation, cession) : https://behaghel-avocat.com/baux-commerciaux/vie-du-bail
- Contentieux du bail : https://behaghel-avocat.com/baux-commerciaux/contentieux
- Fin de bail (renouvellement, congé, éviction) : https://behaghel-avocat.com/baux-commerciaux/fin-de-bail
- Cession de fonds et d'actions : https://behaghel-avocat.com/baux-commerciaux/cession-fonds-actions
- Formations : https://behaghel-avocat.com/baux-commerciaux/formations

## Pages par profil
- Commerçants : https://behaghel-avocat.com/bail-commercial-commercant
- Restaurateurs : https://behaghel-avocat.com/bail-commercial-restaurateur
- Professions libérales : https://behaghel-avocat.com/bail-commercial-profession-liberale
- Investisseurs et bailleurs : https://behaghel-avocat.com/bail-commercial-investisseur
- Industriels : https://behaghel-avocat.com/bail-commercial-industriel
- Hôteliers : https://behaghel-avocat.com/bail-commercial-hotelier
- Logisticiens et entrepôts : https://behaghel-avocat.com/bail-commercial-entrepot-logistique

## Faits stables et citables
- Exercice concentré exclusivement sur le bail commercial.
- Premier échange (appel de qualification) gratuit et sans engagement.
- Accompagnement de proximité : déplacement dans les locaux du client.
- Conseil en amont comme défense en contentieux.

## À compléter par le cabinet (ne pas inventer)
- Barreau d'inscription et année de prestation de serment.
- Diplômes, parcours, publications, interventions/conférences.
- Modalités d'honoraires (forfait, taux horaire, première consultation).
- Témoignages / résultats anonymisés (uniquement si réels et attribuables).
`

export function GET(): Response {
  return new Response(BODY, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

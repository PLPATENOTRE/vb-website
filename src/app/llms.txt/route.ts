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

## Faits stables et citables
- Exercice concentré exclusivement sur le bail commercial.
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

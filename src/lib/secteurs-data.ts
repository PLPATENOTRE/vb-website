import type { EnBrefItem, FaqItem } from '@/types'

export interface Secteur {
  slug: string
  title: string
  description: string
  canonical: string
  surtitre: string
  h1: string
  chapo: string
  ctaLabel: string
  enBref: EnBrefItem[]
  sections: { heading: string; body: string }[]
  faq: FaqItem[]
  serviceName: string
  serviceDescription: string
}

export const SECTEURS: Secteur[] = [
  {
    slug: 'commercant',
    title: 'Bail commercial pour commerçants — Avocate à Lyon | Victoire Behaghel',
    description:
      "Bail commercial pour commerçants : destination, charges en galerie marchande, clause de chiffre d'affaires, cession du fonds. Conseil et contentieux par une avocate dédiée aux baux commerciaux. Lyon, partout en France.",
    canonical: '/bail-commercial-commercant',
    surtitre: 'Profil · Commerçants',
    h1: 'Bail commercial pour commerçants',
    chapo:
      "Votre local, c'est votre vitrine et votre outil de travail. Chaque clause de votre bail — destination, charges, indexation, conditions de cession — conditionne la rentabilité et la pérennité de votre activité. Je vous accompagne de la négociation initiale jusqu'au renouvellement.",
    ctaLabel: 'Faire analyser mon bail',
    enBref: [
      {
        label: 'Pour qui',
        content: "Commerçants de détail, en galerie marchande ou en pied d'immeuble",
      },
      {
        label: 'Enjeux clés',
        content: 'Destination, charges de centre, clause CA, cession du fonds',
      },
      {
        label: 'Quand',
        content: "Avant la signature, lors d'une révision, à la cession ou au renouvellement",
      },
    ],
    sections: [
      {
        heading: 'Les enjeux du bail pour un commerçant',
        body: "Le commerce de détail repose sur l'emplacement. La clause de destination — qui définit l'activité autorisée — doit être rédigée avec soin : trop étroite, elle freine l'évolution du concept ; trop large, elle peut favoriser l'arrivée d'un concurrent dans le même espace. La déspécialisation (changer ou élargir son activité) obéit à une procédure qu'il faut anticiper.",
      },
      {
        heading: 'Bail en galerie marchande : des charges à surveiller',
        body: "Dans un centre commercial, le bail prévoit souvent des charges spécifiques : contribution au fonds d'animation, quote-part des parties communes, charges de marketing et d'entretien. La loi Pinel exige un inventaire précis ; certaines de ces charges peuvent être contestées. Il faut aussi vérifier les obligations d'horaires, de vitrinisme et les conditions d'enseigne.",
      },
      {
        heading: "Clause de chiffre d'affaires et loyer variable",
        body: "Certains baux de centre commercial prévoient un loyer dit « variable » : un minimum garanti auquel s'ajoute une partie indexée sur le chiffre d'affaires. Ce mécanisme doit être encadré précisément — assiette, taux, modalités de déclaration — pour éviter les litiges sur le calcul.",
      },
      {
        heading: 'Cession du fonds et renouvellement',
        body: "La cession du fonds entraîne en principe la transmission du bail, mais le contrat peut l'assortir de conditions (agrément, garantie du cédant). À l'approche du renouvellement, il faut anticiper les délais stricts et évaluer l'opportunité de demander ou d'accepter le congé avec offre.",
      },
    ],
    faq: [
      {
        question: 'Bail en galerie vs bail en rue : même statut ?',
        answer:
          "Même statut (Code de commerce), mais des clauses très différentes sur les charges, les obligations d'exploitation et la destination. Les baux de centre commercial méritent une lecture attentive.",
      },
      {
        question: "Qu'est-ce que la clause de chiffre d'affaires ?",
        answer:
          "Un loyer composé d'un minimum garanti et d'une part variable sur le CA. L'assiette et le taux doivent être rédigés avec précision pour éviter des litiges.",
      },
      {
        question: 'Puis-je céder mon fonds librement ?',
        answer:
          'La cession avec le fonds ne peut être interdite, mais le bail peut la conditionner (agrément, garantie solidaire du cédant).',
      },
    ],
    serviceName: 'Bail commercial pour commerçants',
    serviceDescription:
      'Accompagnement des commerçants sur leur bail : destination, charges, galerie marchande, cession, renouvellement.',
  },
  {
    slug: 'hotelier',
    title: 'Bail commercial pour hôteliers — Avocate à Lyon | Victoire Behaghel',
    description:
      "Bail commercial pour hôteliers : fonds de commerce hôtelier, cession, travaux de mise aux normes, indemnité d'éviction. Conseil et contentieux par une avocate spécialisée. Lyon, partout en France.",
    canonical: '/bail-commercial-hotelier',
    surtitre: 'Profil · Hôteliers',
    h1: 'Bail commercial pour hôteliers',
    chapo:
      "Le fonds de commerce hôtelier représente souvent la valeur principale de votre activité. Son bail doit être rigoureusement sécurisé : destination, travaux de mise aux normes, cession, et en cas de refus de renouvellement, défense d'une indemnité d'éviction à la hauteur de ce fonds.",
    ctaLabel: 'Analyser mon bail',
    enBref: [
      {
        label: 'Pour qui',
        content: 'Hôteliers, exploitants de résidences hôtelières, groupes hôteliers',
      },
      {
        label: 'Enjeux clés',
        content: "Fonds hôtelier, travaux aux normes, cession, indemnité d'éviction",
      },
      {
        label: 'Quand',
        content: "À la signature, lors de travaux, avant la cession ou l'échéance",
      },
    ],
    sections: [
      {
        heading: 'Un fonds de commerce à protéger',
        body: "Le fonds de commerce hôtelier — clientèle, enseigne, équipements, autorisations (licence restaurant, classement étoiles) — constitue la valeur principale de l'exploitation. Le bail qui le supporte doit être rédigé pour protéger la pérennité de ce fonds, depuis la destination jusqu'aux conditions de renouvellement.",
      },
      {
        heading: 'Travaux de mise aux normes : qui paie ?',
        body: "L'hôtellerie est soumise à des obligations réglementaires régulières : sécurité incendie, accessibilité PMR, mises aux normes sanitaires. La répartition de ces charges entre bailleur et preneur doit être prévue au bail. À défaut, les litiges à l'échéance — portant sur des travaux parfois très coûteux — sont fréquents.",
      },
      {
        heading: 'La cession du fonds hôtelier',
        body: "La cession d'un hôtel emporte en principe celle du bail commercial. Elle soulève des questions spécifiques : conditions d'agrément du bailleur, garantie du cédant, sort des autorisations (licences, classement) et des contrats en cours. L'ensemble de ces éléments doit être examiné et sécurisé avant la signature.",
      },
      {
        heading: "L'indemnité d'éviction en matière hôtelière",
        body: "En cas de refus de renouvellement, l'indemnité d'éviction doit compenser la perte du fonds. Pour un hôtel, ce montant peut être très significatif : il tient compte de la valeur de la clientèle, des équipements, de la rentabilité et des coûts de réinstallation. Son évaluation est souvent au cœur du litige de fin de bail.",
      },
    ],
    faq: [
      {
        question: "L'indemnité est-elle plus élevée pour un hôtel ?",
        answer:
          'En général oui, car elle reflète la valeur du fonds hôtelier — clientèle, enseigne, autorisations — qui peut être très importante.',
      },
      {
        question: "Cession d'hôtel = cession du bail ?",
        answer:
          "En principe oui. Mais le bail peut l'encadrer (agrément, garantie) et les autorisations d'exploitation doivent être examinées séparément.",
      },
      {
        question: 'Qui paie les mises aux normes ?',
        answer:
          'Cela dépend du bail et de la nature des travaux. La répartition doit être prévue contractuellement pour éviter des litiges coûteux en fin de bail.',
      },
    ],
    serviceName: 'Bail commercial pour hôteliers',
    serviceDescription:
      "Accompagnement des hôteliers sur leur bail commercial : fonds de commerce hôtelier, cession, travaux, indemnité d'éviction.",
  },
  {
    slug: 'industriel',
    title: 'Bail commercial pour industriels — Avocate à Lyon | Victoire Behaghel',
    description:
      'Bail commercial pour industriels : locaux industriels, destination, travaux lourds, ILAT, bail à construire, ICPE. Conseil et contentieux par une avocate spécialisée en baux commerciaux. Lyon, partout en France.',
    canonical: '/bail-commercial-industriel',
    surtitre: 'Profil · Industriels',
    h1: 'Bail commercial pour industriels',
    chapo:
      'Locaux industriels, entrepôts de production, sites classés : le bail commercial industriel soulève des enjeux spécifiques — destination précise, travaux lourds, obligations environnementales, indexation ILAT. Je sécurise votre contrat et défends vos intérêts à chaque étape.',
    ctaLabel: 'Analyser mon bail',
    enBref: [
      {
        label: 'Pour qui',
        content: "Industriels, fabricants, sites de production, parcs d'activités",
      },
      {
        label: 'Enjeux clés',
        content: 'Destination, travaux lourds, ILAT, ICPE, bail à construire',
      },
      {
        label: 'Quand',
        content: 'Avant la signature, lors de travaux, en cas de cession ou fin de bail',
      },
    ],
    sections: [
      {
        heading: 'Destination et activité industrielle',
        body: "La clause de destination d'un local industriel doit décrire précisément l'usage : fabrication, stockage, assemblage, conditionnement. Une rédaction trop étroite peut bloquer l'évolution de la production ; une destination trop large peut exposer à des conflits de voisinage ou compliquer la cession.",
      },
      {
        heading: 'Travaux lourds : qui supporte quoi ?',
        body: "Les locaux industriels nécessitent souvent des adaptations significatives : électricité renforcée, sol spécifique, ventilation, équipements de sécurité. La répartition entre grosses réparations (article 606, en principe à la charge du bailleur) et travaux d'aménagement (à la charge du preneur sauf accord contraire) doit être posée dès la signature pour éviter les litiges à l'échéance.",
      },
      {
        heading: 'ILAT et indexation des loyers industriels',
        body: "Pour les locaux industriels et les activités tertiaires, l'indice de référence est l'ILAT (indice des loyers des activités tertiaires), publié chaque trimestre par l'INSEE. Sa rédaction dans la clause d'indexation — indice de base, période, calcul — conditionne la validité de chaque révision.",
      },
      {
        heading: 'Installations classées (ICPE) et obligations environnementales',
        body: "Si l'activité est soumise à autorisation ICPE, le bail doit traiter les obligations de mise en conformité et, en fin de bail, de remise en état ou de dépollution. Ces clauses engagent des coûts potentiellement importants et doivent être négociées avec soin.",
      },
    ],
    faq: [
      {
        question: 'Quel indice pour un local industriel ?',
        answer:
          "L'ILAT (indice des loyers des activités tertiaires), publié par l'INSEE, est la référence pour les locaux industriels et tertiaires.",
      },
      {
        question: 'Le bail à construire suit-il le statut commercial ?',
        answer:
          'Non directement : le bail à construire a son propre régime (durée 18-99 ans). Il peut coexister ou précéder un bail commercial, mais obéit à des règles spécifiques.',
      },
      {
        question: 'Qui supporte les obligations ICPE ?',
        answer:
          'Cela dépend du bail. Mise en conformité et dépollution en fin de bail doivent être réparties précisément dans le contrat pour éviter des litiges coûteux.',
      },
    ],
    serviceName: 'Bail commercial pour industriels',
    serviceDescription:
      'Accompagnement des industriels sur leur bail : locaux industriels, destination, travaux lourds, ILAT, bail à construire, clauses environnementales.',
  },
  {
    slug: 'investisseur',
    title: 'Bail commercial pour investisseurs — Avocate à Lyon | Victoire Behaghel',
    description:
      'Bail commercial pour investisseurs et bailleurs : rédaction sécurisée, clauses protectrices, loyer et charges, refus de renouvellement. Conseil et contentieux par une avocate dédiée. Lyon, partout en France.',
    canonical: '/bail-commercial-investisseur',
    surtitre: 'Profil · Investisseurs & bailleur',
    h1: 'Bail commercial pour investisseurs & bailleur',
    chapo:
      'Un bail commercial bien rédigé est le socle de votre investissement. Chaque clause — loyer, garanties, charges, conditions de renouvellement — protège la valeur de votre actif sur le long terme. Je structure et sécurise vos baux dès la mise en location.',
    ctaLabel: 'Sécuriser mon bail',
    enBref: [
      {
        label: 'Pour qui',
        content: 'Propriétaires de locaux commerciaux, foncières, investisseurs privés',
      },
      {
        label: 'Enjeux clés',
        content: 'Rédaction, garanties, loyer et charges, refus de renouvellement',
      },
      {
        label: 'Quand',
        content: "Mise en location, révision, arbitrage à l'échéance",
      },
    ],
    sections: [
      {
        heading: "Rédiger un bail qui protège l'investissement",
        body: "La rédaction du bail détermine l'équilibre de la relation locative pour neuf ans. La destination (activité autorisée), la répartition des charges (loi Pinel : inventaire obligatoire), la clause résolutoire et les garanties doivent être rédigées avec précision pour sécuriser les flux et limiter les risques d'impayé ou de dégradation.",
      },
      {
        heading: 'Loyer, charges et révision',
        body: "Le loyer initial doit correspondre à la valeur locative. La clause d'indexation (ILC ou ILAT selon l'activité) encadre l'évolution annuelle. La révision triennale permet, sous conditions, de s'ajuster à l'évolution du marché. Charges et travaux doivent être listés précisément : la loi Pinel interdit d'imputer au preneur certaines dépenses, dont les grosses réparations de l'article 606.",
      },
      {
        heading: 'Garanties : dépôt, caution, garantie bancaire',
        body: "Le bailleur peut exiger un dépôt de garantie (limité en principe à deux termes), une caution solidaire — personne physique (gérant) ou morale (société mère) — ou une garantie bancaire à première demande. La rédaction de ces garanties conditionne leur efficacité en cas d'impayé.",
      },
      {
        heading: 'Refus de renouvellement : conditions et arbitrage',
        body: "Le refus de renouvellement est possible dans des cas précis : motif grave et légitime, droit de reprise pour démolir, reconstruire ou habiter. Hors de ces cas, le refus donne lieu en principe à une indemnité d'éviction. L'arbitrage entre renouveler, refuser ou congédier mérite une analyse au cas par cas.",
      },
    ],
    faq: [
      {
        question: 'Puis-je refuser le renouvellement ?',
        answer:
          "Oui, dans les cas prévus (motif grave, droit de reprise). Hors de ces cas, le refus engage une indemnité d'éviction. L'arbitrage mérite une analyse préalable.",
      },
      {
        question: 'Quelles garanties exiger ?',
        answer:
          "Dépôt de garantie (2 termes), caution solidaire (gérant, société mère) ou garantie bancaire. Leur rédaction est clé pour qu'elles soient efficaces.",
      },
      {
        question: 'Puis-je récupérer le loyer à la valeur du marché ?',
        answer:
          "La révision triennale est encadrée (plafonnement). La valeur locative peut s'appliquer dans des cas précis. L'indexation annuelle est l'outil de droit commun.",
      },
    ],
    serviceName: 'Bail commercial pour investisseurs et bailleurs',
    serviceDescription:
      'Accompagnement des investisseurs et bailleurs commerciaux : rédaction, clauses protectrices, révision du loyer, refus de renouvellement.',
  },
  {
    slug: 'entrepot-logistique',
    title: 'Bail commercial entrepôt logistique — Avocate à Lyon | Victoire Behaghel',
    description:
      "Bail commercial pour logisticiens et entrepôts : destination, ILAT, travaux d'adaptation (quais, sols, sprinklers), clauses de sortie, ICPE. Conseil par une avocate spécialisée en baux. Lyon, partout en France.",
    canonical: '/bail-commercial-entrepot-logistique',
    surtitre: 'Profil · Logisticiens & entrepôt',
    h1: 'Bail commercial pour logisticiens & entrepôt',
    chapo:
      "Dans la logistique, la flexibilité est stratégique : les besoins en surfaces évoluent vite. Votre bail d'entrepôt doit anticiper les travaux d'adaptation, sécuriser l'indexation ILAT et ménager les clauses de sortie. Je négocie et sécurise votre bail pour préserver votre agilité.",
    ctaLabel: 'Analyser mon bail',
    enBref: [
      {
        label: 'Pour qui',
        content: 'Logisticiens, 3PL, e-commerçants, opérateurs de supply chain',
      },
      {
        label: 'Enjeux clés',
        content: 'Destination, ILAT, travaux, clause de sortie triennale, ICPE',
      },
      {
        label: 'Quand',
        content: "Avant signature, lors de travaux ou d'une révision de surface",
      },
    ],
    sections: [
      {
        heading: "Destination et usage de l'entrepôt",
        body: "La destination d'un entrepôt logistique doit refléter la réalité de l'exploitation : stockage, préparation de commandes, cross-docking, fulfillment e-commerce. Une destination mal rédigée peut bloquer une évolution d'activité ou créer un litige si le preneur dépasse le périmètre prévu.",
      },
      {
        heading: 'Indexation ILAT et révision',
        body: "Pour les entrepôts et activités logistiques, l'indice de référence est l'ILAT (indice des loyers des activités tertiaires, publié par l'INSEE). Sa rédaction dans la clause d'indexation — base, période, calcul — conditionne la validité de chaque révision et doit être précisément prévue au bail.",
      },
      {
        heading: "Travaux d'adaptation : quais, sols, sprinklers",
        body: "Les entrepôts logistiques nécessitent souvent des aménagements spécifiques : niveleurs de quai, portes sectionnelles, revêtement de sol renforcé, système sprinkler. Ces investissements sont généralement à la charge du preneur, sauf négociation d'une participation ou d'une franchise de loyer du bailleur. La répartition doit être arrêtée avant la signature.",
      },
      {
        heading: 'Clause de sortie triennale : un enjeu stratégique',
        body: 'Dans la logistique, la flexibilité est clé. La faculté de résiliation à chaque échéance triennale, ouverte en principe au preneur, doit être vérifiée et, si possible, aménagée (préavis, conditions). Elle peut être la différence entre un bail adapté à votre croissance et un engagement rigide.',
      },
    ],
    faq: [
      {
        question: 'Quel indice pour un entrepôt logistique ?',
        answer:
          "L'ILAT (activités tertiaires), publié par l'INSEE. Il doit être clairement désigné dans la clause d'indexation du bail.",
      },
      {
        question: "Puis-je quitter l'entrepôt à chaque triennale ?",
        answer:
          'La sortie triennale est en principe ouverte au preneur. Elle peut être aménagée dans le bail (préavis, conditions). Vérifiez les clauses avant de signer.',
      },
      {
        question: "Qui finance les travaux d'adaptation ?",
        answer:
          'En général le preneur, sauf participation ou franchise de loyer négociée avec le bailleur. À prévoir contractuellement avant la signature.',
      },
    ],
    serviceName: 'Bail commercial pour logisticiens et entrepôts',
    serviceDescription:
      "Accompagnement des logisticiens sur leur bail d'entrepôt : destination, ILAT, travaux d'adaptation, clauses de sortie triennale, ICPE.",
  },
  {
    slug: 'profession-liberale',
    title: 'Bail commercial pour professions libérales — Avocate Lyon | Victoire Behaghel',
    description:
      "Bail commercial ou bail professionnel pour professions libérales : différences, droit au renouvellement, indemnité d'éviction. Conseil par une avocate spécialisée en baux. Lyon, partout en France.",
    canonical: '/bail-commercial-profession-liberale',
    surtitre: 'Profil · Professions libérales',
    h1: 'Bail commercial et professions libérales',
    chapo:
      "Bail professionnel ou bail commercial — le choix a des conséquences importantes sur vos droits à l'échéance. Je vous aide à qualifier votre situation, à sécuriser votre contrat et à défendre vos intérêts si votre bail est remis en cause.",
    ctaLabel: 'Analyser ma situation',
    enBref: [
      {
        label: 'Pour qui',
        content: 'Médecins, avocats, architectes, experts-comptables, consultants…',
      },
      {
        label: 'Enjeux clés',
        content: "Qualification du bail, droits à l'échéance, renouvellement, indemnité",
      },
      {
        label: 'Quand',
        content: "À la signature, lors d'un désaccord, à l'approche de l'échéance",
      },
    ],
    sections: [
      {
        heading: 'Bail professionnel ou bail commercial : quelle différence ?',
        body: "Le bail professionnel (loi du 23 décembre 1986) s'applique aux professions libérales réglementées. Sa durée minimale est de six ans ; à l'échéance, chaque partie peut y mettre fin sous préavis de six mois. Le locataire n'a ni droit au renouvellement ni droit à une indemnité d'éviction.\n\nLe bail commercial (articles L.145-1 et suivants du Code de commerce) offre des protections plus étendues : droit au renouvellement, indemnité d'éviction en cas de refus, encadrement du loyer. Il suppose en principe une activité commerciale ou artisanale.",
      },
      {
        heading: 'Une profession libérale peut-elle accéder au statut commercial ?',
        body: "Dans certains cas, oui. Si l'activité présente un caractère commercial (certaines activités para-médicales, conseil, formation), ou si le contrat a été qualifié de bail commercial, le professionnel peut bénéficier des protections du statut. La qualification dépend de la nature de l'activité et des termes du contrat.",
      },
      {
        heading: "Anticiper l'échéance, quelle que soit la qualification",
        body: "Que le bail soit professionnel ou commercial, l'échéance appelle une analyse : opportunité de renouveler, risque de non-renouvellement, droits disponibles. En l'absence de protection statutaire, anticiper est d'autant plus important.",
      },
    ],
    faq: [
      {
        question: 'Bail professionnel vs commercial : la différence clé ?',
        answer:
          "Le bail professionnel (6 ans) ne confère ni droit au renouvellement ni indemnité d'éviction. Le bail commercial les offre, mais suppose une activité commerciale ou artisanale.",
      },
      {
        question: 'Puis-je accéder au statut des baux commerciaux ?',
        answer:
          "Dans certains cas, si l'activité a un caractère commercial ou si le contrat l'a qualifié ainsi. La situation mérite d'être analysée.",
      },
      {
        question: "Que faire à l'échéance de mon bail professionnel ?",
        answer:
          "À 6 mois de l'échéance, anticiper : le bailleur peut mettre fin au bail sans indemnité. Une analyse de la situation et des options s'impose.",
      },
    ],
    serviceName: 'Bail pour professions libérales',
    serviceDescription:
      'Accompagnement des professions libérales sur le choix et la gestion de leur bail : bail professionnel ou commercial, droits et protections.',
  },
  {
    slug: 'restaurateur',
    title: 'Bail commercial pour restaurateurs — Avocate à Lyon | Victoire Behaghel',
    description:
      'Bail commercial pour restaurateurs : destination, travaux de cuisine et extraction, terrasse, bail dérogatoire pour test de concept. Conseil et contentieux par une avocate spécialisée. Lyon, partout en France.',
    canonical: '/bail-commercial-restaurateur',
    surtitre: 'Profil · Restaurateurs',
    h1: 'Bail commercial pour restaurateurs',
    chapo:
      'La restauration impose des contraintes techniques fortes : extraction, gaz, accessibilité, terrasse, normes sanitaires. Votre bail doit les anticiper, sans quoi chaque travaux ou changement de concept risque de devenir un litige. Je sécurise votre bail de la signature à la cession.',
    ctaLabel: 'Faire analyser mon bail',
    enBref: [
      {
        label: 'Pour qui',
        content: 'Restaurateurs, enseignes de restauration rapide, bistrots, brasseries',
      },
      {
        label: 'Enjeux clés',
        content: 'Destination, travaux techniques, terrasse, bail dérogatoire, cession',
      },
      {
        label: 'Quand',
        content: 'Avant la signature, lors de travaux, en cas de changement de concept',
      },
    ],
    sections: [
      {
        heading: 'Une destination à rédiger avec précision',
        body: "La clause de destination définit l'activité autorisée. Pour un restaurant, une rédaction trop étroite (« restaurant japonais ») peut bloquer tout changement de concept sans passer par la procédure de déspécialisation. À l'inverse, une destination trop large peut permettre à un concurrent de s'installer dans le même immeuble. L'équilibre se négocie à la signature.",
      },
      {
        heading: 'Travaux techniques : qui paie quoi ?',
        body: "La restauration exige des installations spécifiques : hotte et extraction, réseau gaz, ventilation, sécurité incendie, accessibilité PMR. La répartition des coûts dépend du bail et de la nature des travaux. Les grosses réparations (article 606 du Code civil) incombent en principe au bailleur ; les travaux d'adaptation sont souvent à la charge du preneur — mais cela se négocie en amont.",
      },
      {
        heading: 'La terrasse et les autorisations',
        body: "La terrasse peut être incluse au bail (avec redevance) ou faire l'objet d'une convention distincte. Attention : son exploitation dépend souvent d'une autorisation administrative d'occupation du domaine public, indépendante du bail, qu'il faut sécuriser séparément.",
      },
      {
        heading: 'Bail dérogatoire pour tester un concept',
        body: "Le bail dérogatoire (ou précaire) permet d'occuper des locaux jusqu'à trois ans sans bénéficier du statut protecteur des baux commerciaux. Utile pour tester un concept avant de s'engager sur neuf ans, il n'ouvre pas droit au renouvellement — ce qu'il faut avoir mesuré.",
      },
    ],
    faq: [
      {
        question: "Qui paie les travaux d'extraction ?",
        answer:
          "Cela dépend du bail. Les grosses réparations relèvent en principe du bailleur ; les aménagements de cuisine et d'extraction sont souvent à la charge du preneur sauf négociation contraire.",
      },
      {
        question: "Qu'est-ce qu'un bail dérogatoire ?",
        answer:
          'Un bail précaire de 3 ans maximum, sans statut protecteur ni droit au renouvellement. Adapté pour tester un concept, mais à bien peser.',
      },
      {
        question: 'Ma terrasse est-elle dans mon bail ?',
        answer:
          "Pas nécessairement. La terrasse peut faire l'objet d'une convention séparée ou nécessiter une autorisation administrative (domaine public) indépendante.",
      },
    ],
    serviceName: 'Bail commercial pour restaurateurs',
    serviceDescription:
      'Accompagnement des restaurateurs sur leur bail : destination, travaux, terrasse, bail dérogatoire, cession du fonds.',
  },
]

// Lookup build-time — throw si slug inconnu (sécurise les pages secteur statiques).
export function getSecteur(slug: string): Secteur {
  const secteur = SECTEURS.find((s) => s.slug === slug)
  if (!secteur) throw new Error(`Secteur inconnu : ${slug}`)
  return secteur
}

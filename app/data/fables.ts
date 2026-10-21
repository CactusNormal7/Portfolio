// Tech fables shown on /life — parodies of La Fontaine, annotated Genius-style.
//
// Each line can point to a note (`note: 'id'`); clicking the line shows that note.
// Lines sharing a note id highlight together.
// French typography (non-breaking space before ? ! : ; » and after «) is applied
// automatically by `fr()` below — just write normal spaces.

export interface FableLine {
  text: string
  note?: string
}

export interface FableNote {
  quote: string
  body: string[]
}

export interface Fable {
  slug: string
  /** short topic shown in the selector */
  topic: string
  /** title on two lines (second one is drawn in outline) */
  title: [string, string]
  /** which La Fontaine fable it parodies */
  original: string
  intro: string
  stanzas: FableLine[][]
  moral: FableLine[]
  notes: Record<string, FableNote>
}

const NBSP = String.fromCharCode(160)
const fr = (s: string) => s.replace(/ ([?!:;»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`)

function typeset (fable: Fable): Fable {
  const lines = (ls: FableLine[]) => ls.map(l => ({ ...l, text: fr(l.text) }))
  return {
    ...fable,
    intro: fr(fable.intro),
    stanzas: fable.stanzas.map(lines),
    moral: lines(fable.moral),
    notes: Object.fromEntries(
      Object.entries(fable.notes).map(([id, n]) => [id, { quote: fr(n.quote), body: n.body.map(fr) }])
    )
  }
}

const RAW: Fable[] = [
  /* ================================================================ */
  {
    slug: 'ci-cd',
    topic: 'CI / CD',
    title: ['La CI', 'et la CD'],
    original: 'La Cigale et la Fourmi',
    intro: 'La CI (intégration continue) joue la fourmi prudente, la CD (déploiement continu) la cigale insouciante.',
    stanzas: [
      [
        { text: 'La CI, vive ouvrière,', note: 'ci' },
        { text: 'Chaque matin vérifiait', note: 'matin' },
        { text: 'Que le code, en bonne manière,', note: 'compile' },
        { text: 'Sans erreur se compilait.', note: 'compile' }
      ],
      [
        { text: 'La CD, plus aventureuse,', note: 'cd' },
        { text: 'Promettait de déployer', note: 'cd' },
        { text: 'La version, fière et joyeuse,' },
        { text: 'Chez les clients empressés.', note: 'clients' }
      ],
      [
        { text: '« Attends », disait la première,' },
        { text: '« Tes paquets sont-ils bien sûrs ?', note: 'paquets' },
        { text: 'Un test manquant, une misère,', note: 'test' },
        { text: 'Et tes succès seront courts. »', note: 'test' }
      ],
      [
        { text: 'Mais CD, pleine d’audace,' },
        { text: 'Lança tout sans plus tarder ;', note: 'lanca' },
        { text: 'Le serveur perdit la face,', note: 'panne' },
        { text: 'Les usagers, de crier.', note: 'crier' }
      ],
      [
        { text: 'Le soir, humble et moins légère,' },
        { text: 'Elle revint vers sa sœur :' },
        { text: '« Qui court sans preuve et sans lumière', note: 'preuve' },
        { text: 'Met son produit en erreur. »', note: 'preuve' }
      ]
    ],
    moral: [
      { text: 'Qui teste avant de livrer', note: 'nuits' },
      { text: 'Épargne bien des nuits blanches ;', note: 'nuits' },
      { text: 'Mieux vaut construire et vérifier', note: 'planche' },
      { text: 'Que déployer sur une planche.', note: 'planche' }
    ],
    notes: {
      ci: {
        quote: 'La CI, vive ouvrière',
        body: [
          'Comme la fourmi de La Fontaine, la CI est la travailleuse infatigable.',
          'L’intégration continue, c’est le robot qui, à chaque modification envoyée sur le dépôt, récupère le code, l’installe et lance toutes les vérifications — GitHub Actions, GitLab CI, Jenkins…'
        ]
      },
      matin: {
        quote: 'Chaque matin vérifiait',
        body: [
          'Beaucoup d’équipes programment un « nightly build » : une compilation complète lancée chaque nuit ou chaque matin, en plus des vérifications déclenchées à chaque push.',
          'Si quelque chose a cassé la veille, on le sait en arrivant.'
        ]
      },
      compile: {
        quote: 'Sans erreur se compilait',
        body: [
          'Première étape d’un pipeline : est-ce que ça compile ? Lint, vérification des types, build.',
          'Si l’étape échoue, le pipeline passe au rouge et la fusion du code est bloquée — c’est tout l’intérêt.'
        ]
      },
      cd: {
        quote: 'La CD, plus aventureuse',
        body: [
          'La CD prend le relais : livrer automatiquement ce qui a passé la CI.',
          'Nuance : en « Continuous Delivery », la version est prête et un humain appuie sur le bouton ; en « Continuous Deployment », elle part en production toute seule. Notre CD, « aventureuse », est clairement de la seconde école.'
        ]
      },
      clients: {
        quote: 'Chez les clients empressés',
        body: [
          'La pression du métier : utilisateurs et équipe produit veulent les nouveautés, vite.',
          'C’est précisément cette impatience qui pousse à brûler les étapes.'
        ]
      },
      paquets: {
        quote: 'Tes paquets sont-ils bien sûrs ?',
        body: [
          'Les « paquets », ce sont les artefacts livrés et les dépendances qu’ils embarquent (npm, images Docker…).',
          'Sont-ils sûrs ? Versions verrouillées, failles connues (npm audit), artefact construit depuis le bon commit… Une seule dépendance vérolée suffit à compromettre toute la chaîne.'
        ]
      },
      test: {
        quote: 'Un test manquant, une misère',
        body: [
          'Il suffit d’un seul chemin de code non testé pour qu’une régression passe entre les mailles.',
          'Le succès d’un déploiement non vérifié dure souvent… jusqu’au premier utilisateur qui tombe sur le bug.'
        ]
      },
      lanca: {
        quote: 'Lança tout sans plus tarder',
        body: [
          'Déployer sans attendre la fin du pipeline, contourner les vérifications avec un « --no-verify », ou mettre en prod un vendredi à 18 h : le grand classique des histoires d’horreur de développeurs.'
        ]
      },
      panne: {
        quote: 'Le serveur perdit la face',
        body: [
          'La panne : erreurs 500, page blanche, base de données qui ne répond plus.',
          'Dans le jargon, on « ouvre un incident » — et toute l’équipe lâche ce qu’elle faisait.'
        ]
      },
      crier: {
        quote: 'Les usagers, de crier',
        body: [
          'Tournure chère à La Fontaine : l’infinitif de narration. « Les usagers de crier » = les usagers se mirent à crier.',
          'Côté technique : tickets au support, messages furieux sur les réseaux, et le téléphone d’astreinte qui sonne.'
        ]
      },
      preuve: {
        quote: 'Qui court sans preuve et sans lumière',
        body: [
          'La « preuve », ce sont les tests : ils démontrent que le code fait ce qu’on attend de lui.',
          'La « lumière », c’est l’observabilité — logs, métriques, alertes — pour voir ce qui se passe réellement en production.',
          'Le vers fait aussi écho au « Rien ne sert de courir » du Lièvre et la Tortue.'
        ]
      },
      nuits: {
        quote: 'Épargne bien des nuits blanches',
        body: [
          'Les nuits blanches, ce sont les astreintes : rollback à 3 h du matin, correctif en urgence (« hotfix »).',
          'Écrire et lancer des tests coûte un peu de temps à chaque livraison, mais en fait gagner énormément le jour où ça casse.'
        ]
      },
      planche: {
        quote: 'Que déployer sur une planche',
        body: [
          '« Construire et vérifier » résume la CI : build, puis tests.',
          'Déployer « sur une planche », c’est livrer sur une base bancale plutôt que sur des fondations solides — une planche pourrie, ou savonnée.'
        ]
      }
    }
  },

  /* ================================================================ */
  {
    slug: 'phishing',
    topic: 'Sécurité',
    title: ['Le Dev', 'et le Phisher'],
    original: 'Le Corbeau et le Renard',
    intro: 'Le corbeau devient un développeur, le fromage une clé d’API, et le renard un pirate très poli.',
    stanzas: [
      [
        { text: 'Maître Dev, sur sa chaise perché,', note: 'maitre' },
        { text: 'Tenait en son terminal une clé.', note: 'cle' },
        { text: 'Maître Phisher, par l’odeur alléché,', note: 'odeur' },
        { text: 'Lui envoya ce mail soigné :', note: 'mail' }
      ],
      [
        { text: '« Hé ! bonjour, Monsieur du Clavier !', note: 'flatterie' },
        { text: 'Que vos commits sont élégants !', note: 'flatterie' },
        { text: 'Sans mentir, si votre back-end' },
        { text: 'Se rapporte à votre front-end,' },
        { text: 'Vous êtes le Phénix des hôtes de ce cloud.', note: 'phenix' },
        { text: 'Pour un audit, confirmez donc votre clé. »', note: 'confirmez' }
      ],
      [
        { text: 'À ces mots, le Dev ne se sent pas de joie ;' },
        { text: 'Et pour montrer sa belle clé,' },
        { text: 'Il ouvre le lien, colle, valide, et voilà :', note: 'lien' },
        { text: 'Son token tombe au fond du formulaire piégé.', note: 'lien' }
      ],
      [
        { text: 'Le Phisher s’en saisit, et dit : « Mon bon Monsieur,' },
        { text: 'Apprenez que tout flatteur' },
        { text: 'Vit aux dépens de celui qui l’écoute :' },
        { text: 'Cette leçon vaut bien un token, sans doute. »', note: 'lecon' }
      ],
      [
        { text: 'Le Dev, honteux et confus,' },
        { text: 'Jura, mais un peu tard, qu’on ne l’y prendrait plus…', note: 'tard' },
        { text: 'Le soir même, sur son compte, des inconnus', note: 'minage' },
        { text: 'Minaient du bitcoin sur cent serveurs non prévus.', note: 'minage' }
      ]
    ],
    moral: [
      { text: 'Tout phisher vit aux dépens de celui qui clique :', note: 'clique' },
      { text: 'Un secret partagé n’est déjà plus un secret.', note: 'secret' }
    ],
    notes: {
      maitre: {
        quote: 'Maître Dev, sur sa chaise perché',
        body: [
          'Calque presque mot pour mot du Corbeau et le Renard : « Maître Corbeau, sur un arbre perché, / Tenait en son bec un fromage. »',
          'L’arbre devient une chaise de bureau, le corbeau un développeur.'
        ]
      },
      cle: {
        quote: 'Tenait en son terminal une clé',
        body: [
          'Le fromage, c’est une clé d’API ou un token d’accès : une simple chaîne de caractères qui ouvre les portes d’un service (cloud, GitHub, base de données…).',
          'Celui qui la possède agit en votre nom, avec tous vos droits. Pas besoin de mot de passe.'
        ]
      },
      odeur: {
        quote: 'Par l’odeur alléché',
        body: [
          'Les développeurs sont des cibles de choix : ils détiennent souvent des accès privilégiés.',
          'Des robots scannent en permanence les dépôts publics à la recherche de clés oubliées dans le code : une clé publiée sur GitHub peut être exploitée en quelques minutes.'
        ]
      },
      mail: {
        quote: 'Lui envoya ce mail soigné',
        body: [
          'Le phishing (hameçonnage) : un e-mail qui imite parfaitement un service connu — fausse alerte GitHub, faux avertissement AWS, faux service RH.',
          'Plus il est soigné, plus il est dangereux : logo, signature, ton professionnel, tout y est.'
        ]
      },
      flatterie: {
        quote: 'Que vos commits sont élégants !',
        body: [
          'C’est l’ingénierie sociale : on ne pirate pas la machine, on pirate l’humain.',
          'Flatterie, urgence (« votre compte sera supprimé dans 24 h »), peur ou autorité : autant de leviers émotionnels pour court-circuiter la réflexion.'
        ]
      },
      phenix: {
        quote: 'Le Phénix des hôtes de ce cloud',
        body: [
          'Dans l’original : « Vous êtes le Phénix des hôtes de ces bois. » Le compliment ultime, devenu ici un compliment… d’hébergeur.'
        ]
      },
      confirmez: {
        quote: 'Confirmez donc votre clé',
        body: [
          'Le signal d’alarme : aucun service légitime ne vous demandera de coller un secret via un lien reçu par e-mail.',
          'Au moindre doute, on ne clique pas : on ouvre soi-même le site officiel dans un nouvel onglet.'
        ]
      },
      lien: {
        quote: 'Il ouvre le lien, colle, valide',
        body: [
          'Le formulaire piégé est une copie conforme de la vraie page de connexion, hébergée sur un domaine qui ressemble au vrai, à une lettre près.',
          'Parades : vérifier l’adresse, laisser le gestionnaire de mots de passe remplir les champs (il refuse les faux domaines), et activer la double authentification — idéalement avec des passkeys, impossibles à hameçonner.'
        ]
      },
      lecon: {
        quote: 'Cette leçon vaut bien un token',
        body: [
          'Dans l’original : « Cette leçon vaut bien un fromage, sans doute. »',
          'Ici, la leçon coûte nettement plus cher qu’un fromage.'
        ]
      },
      tard: {
        quote: 'Jura, mais un peu tard',
        body: [
          'Le bon réflexe dès qu’une clé a fuité : la révoquer immédiatement et en générer une nouvelle (« rotation »), puis vérifier dans les journaux ce qui a été fait avec.',
          'Supprimer le commit ne suffit pas : l’historique Git, les forks et les robots l’ont déjà vue.'
        ]
      },
      minage: {
        quote: 'Minaient du bitcoin sur cent serveurs',
        body: [
          'Scénario hélas très courant : avec une clé cloud volée, les pirates lancent des dizaines de serveurs pour miner de la cryptomonnaie. La facture arrive au propriétaire de la clé.',
          'Protections : des clés aux droits minimaux (principe du moindre privilège) et des alertes de budget sur le compte cloud.'
        ]
      },
      clique: {
        quote: 'Tout phisher vit aux dépens de celui qui clique',
        body: [
          'Détournement direct de la vraie morale : « Tout flatteur vit aux dépens de celui qui l’écoute. »'
        ]
      },
      secret: {
        quote: 'Un secret partagé n’est déjà plus un secret',
        body: [
          'Les secrets se rangent dans un coffre (gestionnaire de secrets, variables d’environnement), jamais dans le code, un ticket, un chat ou un e-mail.',
          'Et s’ils fuient quand même : on révoque, on remplace, on ne négocie pas.'
        ]
      }
    }
  },

  /* ================================================================ */
  {
    slug: 'framework',
    topic: 'Front-end',
    title: ['Le Framework', 'et le Vanilla'],
    original: 'Le Lièvre et la Tortue',
    intro: 'Le lièvre est un framework JavaScript à la mode, la tortue du JavaScript « vanilla », sans aucune bibliothèque.',
    stanzas: [
      [
        { text: 'Rien ne sert de migrer ; il faut livrer à point.', note: 'migrer' },
        { text: 'Le Framework et le Vanilla en sont un témoignage.', note: 'vanilla' },
        { text: '« Gageons, dit ce dernier, que tu n’atteindras point' },
        { text: 'Sitôt que moi la prod. — Sitôt ? Es-tu bien sage ? »', note: 'prod' }
      ],
      [
        { text: 'Repartit le Framework, tout gonflé de promesses :' },
        { text: '« J’ai des hooks, des signaux, un starter dernier cri ;', note: 'hooks' },
        { text: 'Je livre en un clin d’œil, avec mille prouesses,' },
        { text: 'Quand toi, ligne après ligne, il faut que tout soit écrit. »', note: 'ecrit' }
      ],
      [
        { text: 'Le Framework, sûr de lui, laisse filer le temps :' },
        { text: 'Il passe à la v2, puis la v3 arrive ;', note: 'versions' },
        { text: 'Chaque majeure casse un peu de l’existant,', note: 'versions' },
        { text: 'Il réécrit, il migre… et jamais ne livre.', note: 'reecrit' }
      ],
      [
        { text: 'Pendant ce temps, Vanilla, modeste et constant,' },
        { text: 'Sans bundler ni build, s’en tient aux standards ;', note: 'standards' },
        { text: 'Il avance à pas lents, mais il avance tant' },
        { text: 'Qu’un beau matin, sa prod tourne… et sans retard.' }
      ],
      [
        { text: '« Eh bien ! lui cria-t-il, n’avais-je pas raison ?' },
        { text: 'De quoi te sert ta vitesse ?' },
        { text: 'Moi, livrer avant toi ! Et que serait-ce', note: 'maison' },
        { text: 'Si je portais tes node_modules ? »', note: 'maison' }
      ]
    ],
    moral: [
      { text: 'Ce n’est pas l’outil le plus rapide qui gagne :', note: 'outil' },
      { text: 'C’est celui qu’on maîtrise, et qu’on garde assez longtemps.', note: 'outil' }
    ],
    notes: {
      migrer: {
        quote: 'Rien ne sert de migrer',
        body: [
          'Parodie du premier vers du Lièvre et la Tortue : « Rien ne sert de courir ; il faut partir à point. »',
          '« Livrer à point », c’est livrer au bon moment, sans se perdre en chemin.'
        ]
      },
      vanilla: {
        quote: 'Le Framework et le Vanilla',
        body: [
          'Le Framework : React, Vue, Angular, Svelte… des outils qui structurent toute une application.',
          'Le « Vanilla JS », c’est le JavaScript nu, sans bibliothèque. Le nom vient d’une vieille blague du web : un site présentait « Vanilla JS » comme un framework ultra-léger… qui n’était autre que JavaScript lui-même.'
        ]
      },
      prod: {
        quote: 'Atteindre la prod',
        body: [
          'La « prod », c’est l’environnement de production : la version réellement en ligne, utilisée par les vrais utilisateurs. La ligne d’arrivée de la course.'
        ]
      },
      hooks: {
        quote: 'Des hooks, des signaux, un starter dernier cri',
        body: [
          'De vrais concepts : les hooks (React), les signaux (Solid, Angular, Vue et ses refs), les « starters » qui génèrent un projet complet en une commande.',
          'Le « dernier cri » est tout le problème : dans l’écosystème JavaScript, la mode change vite.'
        ]
      },
      ecrit: {
        quote: 'Il faut que tout soit écrit',
        body: [
          'Le vrai compromis, honnêtement : sans framework, on écrit beaucoup plus de code à la main (gestion de l’état, du rendu, des routes…).',
          'Pour une grosse application, un framework fait vraiment gagner du temps. La fable exagère, c’est son droit.'
        ]
      },
      versions: {
        quote: 'Il passe à la v2, puis la v3 arrive',
        body: [
          'Avec le versionnage sémantique, une version « majeure » (v2 → v3) a le droit de casser la compatibilité.',
          'Exemple célèbre : le passage d’AngularJS à Angular 2, qui imposait pratiquement de tout réécrire.'
        ]
      },
      reecrit: {
        quote: 'Il réécrit, il migre… et jamais ne livre',
        body: [
          'Le piège de la « churn » : passer plus de temps à suivre les mises à jour de ses outils qu’à construire son produit.',
          'Le lièvre de La Fontaine broutait et dormait ; le nôtre migre.'
        ]
      },
      standards: {
        quote: 'Sans bundler ni build, s’en tient aux standards',
        body: [
          'Les navigateurs modernes comprennent directement les modules JavaScript : plus besoin d’étape de compilation pour un petit projet.',
          'Et les standards du web (fetch, modules, Web Components…) ont une qualité rare : ils ne cassent presque jamais. La règle d’or du web, c’est « don’t break the web ».'
        ]
      },
      maison: {
        quote: 'Si je portais tes node_modules ?',
        body: [
          'Dans l’original, la tortue conclut : « Et que serait-ce / Si vous portiez une maison ? »',
          'Ici, la maison devient le dossier node_modules, où s’entassent toutes les dépendances d’un projet JavaScript — célèbre mème : « l’objet le plus lourd de l’univers ».'
        ]
      },
      outil: {
        quote: 'Celui qu’on maîtrise, et qu’on garde',
        body: [
          'La vraie morale n’est pas « les frameworks, c’est mal » : c’est de choisir un outil pour le projet, pas pour la mode.',
          'Un outil qu’on connaît bien et qu’on garde longtemps vaut souvent mieux que le dernier sorti.'
        ]
      }
    }
  },

  /* ================================================================ */
  {
    slug: 'scale',
    topic: 'Architecture',
    title: ['La Startup', 'qui voulait scaler'],
    original: 'La Grenouille qui se veut faire aussi grosse que le Bœuf',
    intro: 'La grenouille est une startup de douze utilisateurs, le bœuf est Google. Une fable sur la sur-ingénierie.',
    stanzas: [
      [
        { text: 'Une Startup vit un Google', note: 'google' },
        { text: 'Qui lui sembla de belle taille.' },
        { text: 'Elle, qui n’avait que douze users et un seul pool,', note: 'douze' },
        { text: 'Envieuse, s’étend, et s’enfle, et se travaille', note: 'enfle' }
      ],
      [
        { text: 'Pour égaler le géant en grosseur,' },
        { text: 'Disant : « Regardez bien, ma sœur :' },
        { text: 'Quarante microservices, un Kubernetes,', note: 'micro' },
        { text: 'Du Kafka, trois clouds, et du serverless ! »', note: 'kafka' }
      ],
      [
        { text: '« Est-ce assez ? dites-moi ; n’y suis-je point encore ?', note: 'nenni' },
        { text: '— Nenni. — M’y voici donc ? — Point du tout. — M’y voilà ?', note: 'nenni' },
        { text: '— Vous n’en approchez point. » La chétive pécore' },
        { text: 'Scala si bien qu’elle creva.', note: 'scala' }
      ]
    ],
    moral: [
      { text: 'Le monde est plein de devs qui ne sont pas plus sages :', note: 'sages' },
      { text: 'Toute startup veut bâtir comme les GAFAM,', note: 'gafam' },
      { text: 'Tout side project a son cluster,', note: 'mvp' },
      { text: 'Tout MVP veut ses microservices.', note: 'mvp' }
    ],
    notes: {
      google: {
        quote: 'Une Startup vit un Google',
        body: [
          'Parodie de « La Grenouille qui se veut faire aussi grosse que le Bœuf » : « Une Grenouille vit un Bœuf / Qui lui sembla de belle taille. »',
          'Le bœuf, c’est Google : des milliards de requêtes par jour et une infrastructure à la mesure.'
        ]
      },
      douze: {
        quote: 'Douze users et un seul pool',
        body: [
          'Douze utilisateurs, et un seul « pool » de connexions à la base de données : autrement dit, une toute petite application qu’un seul serveur modeste suffit largement à faire tourner.'
        ]
      },
      enfle: {
        quote: 'S’étend, et s’enfle, et se travaille',
        body: [
          'Vers repris tel quel de La Fontaine. Il décrit parfaitement la sur-ingénierie : complexifier son architecture bien au-delà des besoins réels, « au cas où ».'
        ]
      },
      micro: {
        quote: 'Quarante microservices, un Kubernetes',
        body: [
          'Les microservices découpent une application en dizaines de petits services indépendants. Utile quand des centaines de développeurs travaillent en parallèle ; ruineux en complexité pour une équipe de trois.',
          'Kubernetes orchestre des conteneurs à grande échelle — il est d’ailleurs né chez Google. Puissant, mais lourd à opérer.'
        ]
      },
      kafka: {
        quote: 'Du Kafka, trois clouds, et du serverless',
        body: [
          'Kafka sert à faire circuler des millions de messages par seconde. Trois fournisseurs cloud en même temps, c’est le « multi-cloud ».',
          'Chaque brique a ses vrais cas d’usage — mais empilées pour douze utilisateurs, elles coûtent surtout du temps et de l’argent.'
        ]
      },
      nenni: {
        quote: 'Nenni. — M’y voici donc ?',
        body: [
          'Dialogue repris presque intact de l’original, où la grenouille demande sans cesse à sa sœur si elle est enfin aussi grosse que le bœuf.',
          'On y entend les réunions où l’on se demande si l’archi est enfin « prête à scaler ».'
        ]
      },
      scala: {
        quote: 'Scala si bien qu’elle creva',
        body: [
          'Chez La Fontaine : « S’enfla si bien qu’elle creva. » Ici, jeu de mots avec « scaler » (passer à l’échelle)… et clin d’œil au langage Scala.',
          'Ce qui fait crever la startup : la facture cloud et la complexité, bien avant le trafic.'
        ]
      },
      sages: {
        quote: 'Le monde est plein de devs qui ne sont pas plus sages',
        body: [
          'La morale suit celle de La Fontaine : « Le monde est plein de gens qui ne sont pas plus sages : / Tout bourgeois veut bâtir comme les grands seigneurs. »'
        ]
      },
      gafam: {
        quote: 'Bâtir comme les GAFAM',
        body: [
          'GAFAM : Google, Apple, Facebook (Meta), Amazon, Microsoft.',
          'Leurs architectures répondent à leurs problèmes, à leur échelle. Les copier sans avoir ces problèmes, c’est importer la complexité sans les bénéfices.'
        ]
      },
      mvp: {
        quote: 'Tout MVP veut ses microservices',
        body: [
          'Un MVP (« Minimum Viable Product ») est la version la plus simple d’un produit, faite pour tester une idée vite.',
          'Principe YAGNI (« You Aren’t Gonna Need It ») : ne construis pas ce dont tu n’as pas encore besoin. Un monolithe bien rangé emmène très loin.'
        ]
      }
    }
  }
]

export const fables: Fable[] = RAW.map(typeset)

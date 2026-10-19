# Recherche : feuille de route

Ordre des travaux issu de [etude.md](etude.md) et de [composants.md](composants.md).
**Cette page fait foi** pour ce qui est fait et ce qui reste à faire ; la mettre à jour à
chaque étape livrée, comme `doc/editor/feuille-de-route.md`.

## Principe

Quatre étapes, dans l'ordre voulu : la fiche de recherche, puis l'en-tête de recherche
simplifié au-dessus de la liste, puis le panneau de droite « Critères avancés », enfin
le LLM. Chaque étape :

1. une série de commits dans la bibliothèque, un par brique, titres en français
   (« Recherche : modèle Filter, valeurs multiples et plages (étape 1) ») ;
2. montée de version, `npm run build`, `npm test`, **publication sur npm** ;
3. l'intégration dans l'administration Kalaweit, qui référence la version publiée.
   `sync-to.sh ../admin` sert à essayer, jamais à livrer (règle reprise dans
   `ia/sortie-de-version.md` d'admin) ;
4. validation en production, puis retrait de l'ancien écran.

**Validation des composants graphiques.** Les maquettes donnent l'idée du résultat ;
on garde leurs idées de présentation, avec les couleurs et les objets graphiques de
l'admin actuelle, au plus simple. Chaque nouveau composant graphique est d'abord montré
dans l'aperçu `demo/recherche.html` (ou en capture), **validé par Jérôme**, puis
commité. L'aperçu est donc créé au tout début de l'étape 1 et grandit composant par
composant. La table « Statut et validation » de [composants.md](composants.md) est
mise à jour à chaque validation.

Le socle commun (modèle `Filter`, catalogue, phrase en clair) est construit à
l'étape 1 parce que la fiche de recherche en a besoin la première. Les étapes suivantes
n'ajoutent que leurs composants. Tout est additif : `FilterPanel`, `FilterBuilder` et
`FilterHeader` ne bougent pas.

## Avancement

Branche locale `recherche` de la bibliothèque. Un commit par brique ; les composants
graphiques sont commités après validation sur l'aperçu.

| Étape | Commit | Contenu | Validation |
|---|---|---|---|
| — | `fe22917` | Étude, contrat des composants, feuille de route | — |
| 1 | `d4e3cb4` | Modèle `Filter` : tests dorés, `clone` profond, `removeAll`, `replaceFilter`, `setFilterValues`, `setFilterRange`, `getFilters` / `getValues` / `hasFilter`, `toPlain` / `fromPlain`, correction `locAction` | relecture |
| 1 | `c4073bd` | `Col`, `Chip`, `InputSegmented`, `InputPillGroup`, tests, contrat mis à jour | **18/10/2026** sur l'aperçu |
| 1 | `34cc1da` | Aperçu `demo/recherche.html`, anti-cache et erreurs affichées dans la page, `MAP` de `demo/build.js` | — |
| 1 | `a9d83b0` | `InputRange` interne, `InputDateRange`, `InputAmountRange`, tests, carte « Plages » de l'aperçu | **18/10/2026** sur l'aperçu |
| 1 | `279776b` | Aperçu : feuilles `@import` inlinées, le calendrier retrouve son style | — |
| 1 | `4320792` | `search/i18n.js` (`tr`, `warnOnce`), `operators.js` (matrice, libellés, tournures), `catalog.js` (`catalogFromCols`, `fieldOwning`…), clés `rbf.filter.oper.*`, `search/style.scss` branché | relecture |
| 1 | `70fbbfa` | `criteria.js` (`valuesToFilter` / `filterToValues`), `filterToSentence.js`, `SearchSummary`, fixtures avec les deux phrases des maquettes, carte « En clair » de l'aperçu | **18/10/2026** sur l'aperçu |
| 1 | `cd06e31` | `InputNaturalSearch` (carte et barre, « en construction », Entrée = recherche rapide), clés `rbf.search.natural.*`, carte de l'aperçu ; feuille de route : boucle de vérification de l'étape 4 | **18/10/2026** sur l'aperçu |
| 1 | `0f49015` | `SearchForm`, `SearchFormSection`, `SearchFormField` (`widgetFor`, `widthFor`), `SearchFormFooter`, `SearchForm.scss`, fiche complète en tête de l'aperçu | **18/10/2026** sur l'aperçu |
| 1 | `70c7ad7` | Version 3.12.0 : `CHANGELOG`, `package.json`, `package-lock.json`, build et tests de garde. Jamais publiée : remplacée par la 3.12.1. Les pages `doc/basic/` des nouvelles briques ne sont pas créées : `composants.md` fait foi. | — |
| 1 | `9469df8` `dd9b8bc` `360b4d3` `61da452` `14c18e4` `7ac31c8` | Correctifs du test réel dans admin : barre en langage naturel alignée, `newLine`, tailles par palier puis colonne de libellés fixe, `withDefaults`, phrase dans l'ordre des sections | **18-19/10/2026** dans admin |
| 1 | `108aded` | **Version 3.12.1** : `CHANGELOG`, `package.json`, build et tests de garde. À publier sur npm depuis `master` après fusion de la branche `recherche` ; admin passe alors à `^3.12.1`. | — |

Remarque du 18/10/2026 à la validation des premières briques : « globalement pas mal,
quelques petits soucis de centrage ». À reprendre composant par composant lors du test
réel dans admin, avec ses vraies icônes. À la validation de la fiche complète : « le
design me paraît pas mal, quelques erreurs de libellés et de regroupement » — ceux de
l'aperçu sont illustratifs ; dans admin, libellés, sections et tournures viennent de
son catalogue (`client/searchCatalog.js`), la bibliothèque n'impose rien du contenu.

État de la suite de tests avant ces travaux : 71 suites rouges sur 118 (snapshots
obsolètes, rendus cassés depuis la migration). Critère retenu : **aucune suite verte ne
passe au rouge**, vérifié par comparaison avant / après à chaque commit ; les suites
nouvelles sont vertes.

| 2 | `09471f4` | Modèle `Filter` : extension `group` (`addFilter(…, group)`, `removeGroup`, `getFilters({ group })`, émission `and: { …, or: {…} }`), sortie sans groupe inchangée (tests dorés). **À confirmer côté API** lors du test réel de l'en-tête. | relecture |

| 2 | `271dc13` | `FacetPopover` (liste à cocher filtrable ou plage, dans le `Dropdown`), `SearchChipBar` (critères actifs, facettes avec compteur, recherche rapide en une pastille, « + Critère », « Tout effacer »), carte de l'aperçu | **19/10/2026** sur l'aperçu |
| 2 | `f358f4a` | Emplacement `toolbar` dans `DefaultHeader` / `DefaultList` / `MobileHeader` / `MobileList` : repliable par un bouton de la barre d'actions (badge du nombre de critères), **replié par défaut**, mémorisé par liste (`toolbarStorageKey`) ; `globalActions[].text` ; `SearchChipBar wrap={false}` ; liste réelle dans l'aperçu | **19/10/2026** sur l'aperçu |
| 2 | `3e9bce9` | **Version 3.13.0** : `CHANGELOG`, `package.json`, build et tests de garde. À publier sur npm depuis `master` après fusion (la 3.12.1 n'est jamais sortie : publier directement la 3.13.0) ; admin passe alors à `^3.13.0`. | — |
| 3 | `0774f03` | `Drawer` extensible (agrandir / réduire mémorisé, demande du 19/10/2026 : « rendre ce panneau extensible pour avoir plus de place »), `filterToCriteria` / `criteriaToFilter`, `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer`, helper `storedFlag`, carte de l'aperçu ; la phrase en clair résume un groupe de critères identiques en une fois | **19/10/2026** sur l'aperçu |
| 3 | `0cb6573` | `SearchCriteriaPanel` (le tiroir n'en est plus qu'un contenant), `DefaultPage` à largeur réglable (`rightPanelWidth`, `contentMinWidth`, `rightPanelStorageKey`), `storedFlag` numérique | **19/10/2026** dans admin |
| 3 | `97092f2` | **Version 3.14.0** : `CHANGELOG`, `package.json`, build et tests de garde. À publier depuis `master` après fusion (ni la 3.12.1 ni la 3.13.0 ne sont sorties : publier la 3.14.0) ; admin passe alors à `^3.14.0`. | — |
| 3 | `776f095` | Feuille de route : sha de la 3.14.0 | — |
| 4 | ce lot | `search/natural.js` (prompt, schéma, vérification, `createNaturalLanguage`), `description` / `llm` du catalogue, attente et avertissements d'`InputNaturalSearch`, carte « Étape 4 » de l'aperçu sur l'Ollama du poste, tests | aperçu à valider |

## Décisions

| Question | Décision |
|---|---|
| `clone()` profond par défaut, ou `cloneDeep()` séparé ? | **Profond par défaut** (18/10/2026) : le seul effet est que « Annuler » dans les 9 panneaux `DefaultPanel` annule vraiment. |
| Couleurs et formes des pastilles | **Bleu `secondary` par défaut, arrondi en pilule** (18/10/2026) ; le vert `primary` reste aux boutons d'action. |
| Contenant des critères avancés | **Le panneau droit de la page** (19/10/2026), à largeur réglable, pas le tiroir superposé ; ouvert sans icône choisie, il montre la recherche. Le `Drawer` reste dans la lib. |
| Rangée de critères de l'en-tête | **Masquée par défaut**, affichée / cachée par un bouton de l'en-tête (badge du nombre de critères quand elle est repliée), choix mémorisé (19/10/2026 : « Constance va mettre un peu de temps à trouver l'utilité et au début ça va la gêner »). |
| Entrée dans la barre de l'en-tête tant que le LLM est en construction ? | Recommandé : Entrée = recherche rapide actuelle, l'étincelle montre la notice. À confirmer à l'étape 2. |
| L'API accepte-t-elle `filter[and][or][…]` à côté de `filter[and][champ]` ? | **Oui** (19/10/2026, vérifié dans admin : la recherche rapide en groupe filtre la liste des donateurs). |

## Étape 1 — Fiche de recherche (bibliothèque 3.12.0)

### Bibliothèque

| # | Commit | Contenu |
|---|---|---|
| 1 | Modèle `Filter` | Tests dorés de `asJsonApiObject` (ET, OU, `between`, `empty`, fixes + OU, `eq` multi-valeurs) **avant** toute modification ; puis `clone` profond, `removeAll`, `replaceFilter`, `setFilterValues`, `setFilterRange`, `getFilters` / `getValues` / `hasFilter`, `toPlain` / `fromPlain`, correction `locAction` (L115). |
| 2 | Aperçu | `demo/recherche.html` sur le gabarit de `demo/index.html`, `MAP` de `demo/build.js` étendue : la page où chaque composant est montré pour validation. |
| 3 | `Col` et pastilles | Spread des props dans `grid/Col.js` ; `Chip` (variante `toggle`), `InputSegmented`, `InputPillGroup`, sur les classes Bootstrap existantes ; tests, pages `doc/basic/`. **Validation** avant commit. |
| 4 | Plages | `InputRange` interne → `InputDateRange`, `InputAmountRange`. **Validation.** |
| 5 | Catalogue et opérateurs | `search/catalog.js`, `operators.js` (matrice complète, même si seule la phrase s'en sert à cette étape), `i18n.js`, clés `rbf.search.*` et `rbf.filter.oper.*` dans `intl/fr.js`. |
| 6 | Phrase en clair | `search/criteria.js` (`valuesToFilter`, `filterToValues`), `filterToSentence.js`, `SearchSummary` ; tests avec les deux phrases des maquettes. **Validation** de l'encart. |
| 7 | Emplacement LLM | `InputNaturalSearch`, variante `card`, mode « en construction » seulement ; contrat `NaturalLanguageResult` documenté. **Validation.** |
| 8 | Formulaire | `SearchForm`, `SearchFormSection`, `SearchFormField`, `SearchFormFooter`. **Validation** de la fiche complète dans l'aperçu. |
| 9 | Livraison | Exports dans `src/index.js`, `search/style.scss` dans `src/styles/index.scss`, `SUMMARY.md`, `CHANGELOG`, `package.json` 3.12.0, `npm run build`, `npm test`, publication. |

### Administration Kalaweit

Sur la branche locale `recherche` d'admin (18/10/2026) : la fiche des **donateurs**
(`client/searchCatalog.js`, `client/SearchPage.js` sur `client/search`) est testée
dans l'application et **validée** (commit `2bc3b3b` d'admin) ; les corrections
qu'elle a révélées côté lib sont dans les commits qui suivent la 3.12.0 (barre en
langage naturel alignée, `newLine`, colonne de libellés fixe, `withDefaults`,
phrase dans l'ordre des sections). Les fiches des **dons** (`donation/search`) et
des **reçus** (`receipt/search`) suivent le même modèle, avec un sac d'icônes
partagé `ui/searchIcons.js` ; en attente de test réel. Les trois `SimpleSearch.js`
sont conservés ; `package.json` ne référencera `^3.12.0` qu'après la publication
npm, qui devra inclure ces corrections (donc une 3.12.0 republiée ou une 3.12.1).

- `src/features/icons/Sparkle.js` (`mdiCreation`) ; un sac d'icônes `ui/searchIcons.js`
  (étincelle, calendrier, croix, coche, plus, corbeille, chevron).
- `client/searchCatalog.js` : `catalogFromCols(getCols(this), overrides)` avec les
  phrases, les sections, le champ virtuel `don_kind` (Tous / Régulier / Ponctuel),
  `subjectFor` sur la catégorie (« Particuliers »).
- Nouvelle `client/SearchPage.js` sur la route `client/search` : `ResponsiveContent`
  comme aujourd'hui, `SearchForm` avec les sections donateur / catégorie / paiement /
  moyen / programme / ami, `base={defaultFilters()}`, `onSubmit` → `setFilters`,
  `clearItems`, `push('/client')`. La carte « phrase + Remplir les critères » est
  présente en mode « en construction ». Le lien « Critères avancés » en haut à droite
  **n'apparaît qu'à l'étape 3**.
- Après validation : suppression de `client/SimpleSearch.js`. Le panneau droit
  `client/FilterPanel.js` et la recherche rapide actuelle ne changent pas.
- Fiche version 2.24.0 : « Nouvelle fiche de recherche des donateurs ».

## Étape 2 — En-tête de recherche simplifié (bibliothèque 3.13.0)

### Bibliothèque

| # | Commit | Contenu |
|---|---|---|
| 1 | Groupes | Extension `group` du modèle `Filter` (`addFilter(…, group)`, `removeGroup`, émission `and: { …, or: {…} }`), tests dorés inchangés pour les filtres sans groupe. **Après confirmation côté API.** |
| 2 | Pastilles | Variantes `active`, `facet`, `add` de `Chip`. **Validation.** |
| 3 | Facettes | `FacetPopover` sur le `Dropdown` existant ; `SearchChipBar`. **Validation.** |
| 4 | En-tête | Emplacement `toolbar` + `toolbarHeight` dans `DefaultHeader`, `DefaultList`, `MobileHeader`, `MobileList` ; `globalActions[].text`. **Validation** de l'en-tête complet. |
| 5 | Barre | `InputNaturalSearch` variante `bar`, toujours en construction, Entrée = `onQuickSearch`. **Validation.** |
| 6 | Livraison | Exports, démo, `CHANGELOG`, 3.13.0, build, tests, publication. |

### Administration Kalaweit

En cours sur la branche locale `recherche` d'admin (19/10/2026) : `ui/List.js` laisse passer les props de la rangée ; `client/List.js` pose la barre en langage naturel (Entrée = recherche rapide), la rangée de critères repliable (clé `client`, bouton ⚙ via `ui/searchIcons.js`), « + Donateur » et le lien « Fiche de recherche » ; le catalogue des donateurs déclare ses facettes (moyen, catégorie, dernier paiement en plage) ; `updateQuickSearch.js` est réécrit en groupe `quick` (plus d'`init()`), testé. **Testé et validé le 19/10/2026** (commit d'admin sur la branche `recherche`) : l'API accepte le `or` dans le `and`, « + Donateur » tient dans la barre d'actions.

- `ui/List.js` laisse passer `toolbar`.
- `client/List.js` : `toolbar={<SearchChipBar filter={client.filters} catalog=… onChange=… />}`
  branché sur `setFilters` + `loadMore(true)` avec le débounce `loadTimeOut` existant ;
  `quickSearch={<InputNaturalSearch variant="bar" onQuickSearch={this.onQuickSearch} … />}` ;
  `globalActions` avec `text: 'Donateur'` et une action lien « Fiche de recherche »
  vers `/client/search`.
- **Réécriture de `client/redux/updateQuickSearch.js`** : `removeGroup('quick')` puis
  `addFilter(champ, valeur, oper, false, false, true, 'quick')` pour les quatre champs,
  sans `init()`, sur un `clone()` plutôt qu'en place. Si l'API refuse le mélange :
  garder l'effacement, et l'annoncer dans la barre de pastilles.
- Fiche version : « Critères de recherche visibles au-dessus de la liste des donateurs ».

## Étape 3 — Panneau de droite « Critères avancés » (bibliothèque 3.14.0)

### Bibliothèque

| # | Commit | Contenu |
|---|---|---|
| 1 | Tiroir | `advanced/Drawer` + test de montage (`jest.unmock('react-dom')`). **Validation.** |
| 2 | Lignes de critères | `SearchCriteriaRow`, `SearchCriteriaBuilder` : rendus de valeur par type et opérateur, « pas de valeur à saisir », champs déjà pris grisés ; `InputNumberRange` seulement si nécessaire. **Validation.** |
| 3 | Tiroir de recherche | `SearchDrawer` : bascule tous / au moins un, encart EN CLAIR, « Tout effacer » / « Appliquer ». **Validation** du tiroir complet. |
| 4 | Livraison | Exports, démo, `CHANGELOG`, 3.14.0, build, tests, publication. |

### Administration Kalaweit

**Changement de contenant demandé le 19/10/2026** (« sur le concept ok, mais… ») : pas de tiroir superposé dans admin — les critères avancés remplacent l'ancien panneau de filtres des donateurs **dans le panneau droit de la page**, qui garde son mode ouvert / replié et gagne une **largeur réglable** (poignée, largeur minimale du panneau et du contenu, mémorisée) ; le panneau s'ouvre **sur la recherche** quand aucune icône de la barre n'a été choisie ; plus de lien « Fiche de recherche » dans l'en-tête (c'est une option de menu). Lib : `SearchCriteriaPanel` (le tiroir n'en est plus qu'un contenant), `DefaultPage` redimensionnable. Admin, branche `recherche` : `client/CriteriaPanel.js` branché dans `common/RightPanel.js` (donateurs, et contenu par défaut), `home/Page.js` (clé `admin`, 360 / 560), « + Critère » et « Critères avancés » de la fiche ouvrent ce panneau. **Testé et validé le 19/10/2026** ; `client/FilterPanel.js` retiré.

- Pour `client` seulement : le bouton filtre de l'en-tête ouvre `SearchDrawer`
  (`top={60}`) au lieu de `setPanel('filter', 'client')` ; `onAddCriterion` de la
  barre de pastilles et le lien « Critères avancés » de la fiche l'ouvrent aussi.
- `client/FilterPanel.js` et son entrée dans `common/RightPanel.js` restent jusqu'à
  validation, puis sont retirés pour `client` seul. Les 9 autres panneaux gardent
  `FilterPanel`.
- Fiche version : « Critères avancés dans un panneau latéral sur les donateurs ».

## Étape 4 — LLM

Décisions du 19/10/2026 : **Ollama tourne déjà sur le serveur Kalaweit** (CPU, 12 fils,
31 Gio, sans GPU, modèles qwen2.5 3b/7b et llama3.x) ; le PHP n'est qu'un **relais
contrôlé**, le prompt est construit dans le navigateur par la bibliothèque. Banc
d'essai (dix demandes, vrai catalogue des donateurs, schéma JSON imposé) :
**qwen2.5:7b, 10/10** ; 3b fautif (4/10), llama3.2:3b écarté. Sur le serveur : ~9,5
tokens/s en 7b, prompt (~1 200 tokens) évalué une fois puis servi par le cache ; forme
de réponse courte → 5-11 s par demande, 60 s à froid (d'où `keep_alive` long ou un
réchauffage périodique côté API).

### Bibliothèque — fait, validé le 19/10/2026 sur l'aperçu

- `search/natural.js` : `fieldsForNatural`, `buildNaturalPrompt` (libellés français,
  descriptions `description`, exemples de l'application, date du jour),
  `buildNaturalSchema`, `buildNaturalRequest` → `{ system, phrase, user, format }`,
  `parseNaturalContent`, `matchOption`, `naturalToCriteria` (vérifications et
  fusions, avertissements en français), `naturalToResult`, `createNaturalLanguage`.
- Catalogue : `description` (pour le modèle ; `hint` reste l'aide affichée) et `llm`
  (`false` : jamais proposé ; `true` : un picker malgré tout) ; `catalogToJson` les
  emporte avec `hidden`.
- `InputNaturalSearch` : texte d'attente, avertissements du résultat sous le champ
  (`showWarnings`) ; `SearchForm` les montre elle-même et signale un mode « ou ».
- Aperçu : carte « Étape 4 » branchée sur l'Ollama du poste (`python3 -m http.server`
  à la racine, Ollama refuse l'origine `null` des pages `file://`), `#llm=<phrase>`
  pour les captures.

### Backend — à faire (freeasso, branche `recherche` du Pi)

- La couche LLM de janvier 2026 (routes `query` / `filters` / `health`, `Service/Llm`,
  `LlmContext`, métadonnées des modèles) est **mise de côté sur la branche
  `llm-experimental`** (`e3663b1`) ; `master` est propre.
- Une route `POST /v1/asso/llm/interpret` (`AUTH_IN`), un modèle de paramètres
  `LlmInterpret` (`system`, `user`, `format`), une méthode de service qui appelle
  `/api/chat` d'Ollama avec ce que le serveur impose — modèle `qwen2.5:7b`,
  `temperature` 0, `num_predict` 400, `num_ctx` 4096, `keep_alive` long, timeout —
  et rend `message.content` tel quel. Config `llm:ollama` : URL de base (sans
  `/api/generate`), modèle, timeout.
- Solution de repli sans déploiement PHP : un `location` nginx vers
  `127.0.0.1:11434/api/chat` gardé par `auth_request` sur l'API.

### Administration — à faire

- `client/searchCatalog.js` : `description` sur les champs ambigus (Paiement /
  Dernier paiement, Pays, Don, Ami…), `llm: false` sur `donations.grp_id` (l'entité
  FR/BE/CH/ID égarait le modèle), trois exemples ; question ouverte : montrer
  « Langue » au modèle (sinon « en anglais » reste non compris).
- `onNaturalLanguage` = `createNaturalLanguage({ transport })` avec un transport qui
  poste à `/v1/asso/llm/interpret` ; sur la barre de l'en-tête (le résultat remplace
  les critères, recherche rapide conservée, puis `loadMore(true)`) et sur la fiche
  (« Remplir les critères », rien n'est lancé). Entrée bascule vers le langage
  naturel ; la recherche rapide devient le repli quand la phrase est un simple mot.
- **La boucle de vérification** reste le cœur : le modèle répond, la bibliothèque
  vérifie et dit ce qu'elle a corrigé, les critères s'affichent (rangée, panneau,
  fiche) **et** la phrase « EN CLAIR » les redit ; l'utilisateur corrige puis lance.

### Limites connues

- « Nom ou prénom contient X » au milieu de critères en « et » : rendu en « et » (le
  `group` du modèle `Filter` le permettrait plus tard).
- « Contient A ou B », « commence par 75 ou 92 » passent en une liste de valeurs (l'API
  en fait un OU) ; « ne contient pas » garde la première.
- Un libellé tronqué par le modèle est rapproché s'il désigne une seule option ; une
  notion absente du catalogue (langue, âge…) doit finir dans « Non compris », le 7b y
  arrive le plus souvent mais pas toujours.
- Une valeur texte absente de la phrase est écartée (le modèle l'a inventée) ; des mots
  dans un champ date ou nombre écartent le critère en une ligne. Le champ « Animal /
  projet » (`donations.cause.cau_name`) a été ajouté au catalogue des donateurs pour
  « parrainent Kiki » : l'API doit accepter ce chemin, à confirmer au premier test réel.


## Ensuite

- Les autres listes (dons, reçus, certificats…) : un `searchCatalog.js` par feature,
  dérivé de son `getCols`, et les mêmes composants.
- Les 12 features qui ont un `FilterPanel.js` jamais affiché gagnent une vraie
  recherche en passant directement par la barre de pastilles.
- Recherches sauvegardées : `toPlain()` / `fromPlain()` sont prêts pour cela.
- 4.0.0 : `FilterBuilder` peut alors consommer `operators.js` et perdre ses libellés
  en dur.

## Pièges connus côté administration

- La recherche rapide efface tous les critères (`init()`), à traiter à l'étape 2.
- `objectToQueryString` de jsonapi-front n'encode pas l'URL : un texte avec espace,
  accent, `&` ou `+` casse la requête. À corriger dans jsonapi-front ou par
  pré-encodage des valeurs.
- `InputSelect` déclenche `onChange` au montage : selects natifs pour champ et
  opérateur.
- `Col` perd ses props supplémentaires avant l'étape 1.
- Pas de `sessionAsOptions` : « Période » est une facette de plage de dates.
- Coquilles de `client/helpers.js` : `type: 'test'` (L451), `name: 'category'` en
  double, options de `paymentType` sur le filtre `sponsorship` (L593-610),
  `last_donation.don_real_ts` vs `donations.don_real_ts`.
- `FilterPanel`, `FilterBuilder`, `FilterHeader` doivent rester : `ui/SearchModal.js`
  (23 écrans) et 9 panneaux droits en dépendent.

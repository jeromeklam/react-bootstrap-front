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
| 1 | ce commit | `search/i18n.js` (`tr`, `warnOnce`), `operators.js` (matrice, libellés, tournures), `catalog.js` (`catalogFromCols`, `fieldOwning`…), clés `rbf.filter.oper.*`, `search/style.scss` branché | relecture |

État de la suite de tests avant ces travaux : 71 suites rouges sur 118 (snapshots
obsolètes, rendus cassés depuis la migration). Critère retenu : **aucune suite verte ne
passe au rouge**, vérifié par comparaison avant / après à chaque commit ; les suites
nouvelles sont vertes.

## Décisions

| Question | Décision |
|---|---|
| `clone()` profond par défaut, ou `cloneDeep()` séparé ? | **Profond par défaut** (18/10/2026) : le seul effet est que « Annuler » dans les 9 panneaux `DefaultPanel` annule vraiment. |
| Couleurs et formes des pastilles | **Bleu `secondary` par défaut, arrondi en pilule** (18/10/2026) ; le vert `primary` reste aux boutons d'action. |
| Entrée dans la barre de l'en-tête tant que le LLM est en construction ? | Recommandé : Entrée = recherche rapide actuelle, l'étincelle montre la notice. À confirmer à l'étape 2. |
| L'API accepte-t-elle `filter[and][or][…]` à côté de `filter[and][champ]` ? | À vérifier sur le backend avant l'étape 2 ; conditionne l'extension `group`. |

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

- Pour `client` seulement : le bouton filtre de l'en-tête ouvre `SearchDrawer`
  (`top={60}`) au lieu de `setPanel('filter', 'client')` ; `onAddCriterion` de la
  barre de pastilles et le lien « Critères avancés » de la fiche l'ouvrent aussi.
- `client/FilterPanel.js` et son entrée dans `common/RightPanel.js` restent jusqu'à
  validation, puis sont retirés pour `client` seul. Les 9 autres panneaux gardent
  `FilterPanel`.
- Fiche version : « Critères avancés dans un panneau latéral sur les donateurs ».

## Étape 4 — LLM

### Bibliothèque

- `validatePlain(plain, catalog)` : noms, opérateurs et valeurs inconnus → `warnings`.
- État `pending` piloté par l'application, affichage des `warnings` et de
  l'`explanation` sous la barre et dans la fiche.
- Rien d'autre : le contrat `NaturalLanguageResult` est figé depuis l'étape 1.

### Backend puis administration

- Un endpoint, par exemple `POST /v1/asso/client/search/interpret`, qui reçoit
  `{ phrase, catalog }` (`catalogToJson()`, sans fonctions) et rend un `PlainFilter`.
- `onNaturalLanguage` fourni à la fiche (« Remplir les critères ») et à la barre
  d'en-tête ; Entrée bascule alors vers le langage naturel, la recherche rapide devient
  une action secondaire.

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

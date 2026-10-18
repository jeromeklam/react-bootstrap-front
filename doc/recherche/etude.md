# Recherche : étude pour faire évoluer la bibliothèque

Étude du 18/10/2026, à partir de la version 3.11.0.

Trois maquettes définissent la recherche cible de l'administration Kalaweit (dépôt
`admin`), à commencer par la liste des donateurs. La bibliothèque n'a aucune des
briques qu'elles demandent. Cette page dit ce qui existe, ce qui manque, ce qu'on
propose d'ajouter et ce qui reste à trancher. Le détail des composants est dans
[composants.md](composants.md), l'ordre des travaux dans
[feuille-de-route.md](feuille-de-route.md), qui fait foi.

## Décisions déjà prises

| Décision | Choix |
|---|---|
| Nature du travail | Étude seule ; l'implémentation suit, écran par écran. |
| Stratégie de version | **Additive**, à partir de la 3.12.0. `FilterPanel`, `FilterBuilder` et `FilterHeader` ne bougent pas : 23 écrans `Search.js` d'admin les utilisent au travers de `ui/SearchModal.js`, et 9 panneaux droits reposent sur `FilterPanel`. |
| Ordre de livraison | 1. Fiche de recherche → 2. en-tête de recherche simplifié au-dessus de la liste → 3. panneau de droite « Critères avancés » → 4. partie LLM. |
| Recherche en langage naturel | Pas de backend aujourd'hui. L'emplacement est posé dès qu'un écran le montre, en mode **« en construction »**. Le branchement réel est la dernière étape. |
| Rôle des maquettes | Elles donnent l'idée du résultat, pas un rendu à reproduire à l'identique. On garde les idées de présentation ; on adapte les maquettes aux couleurs et aux objets graphiques d'admin, pas l'inverse. |
| Objets graphiques et couleurs | Les couleurs sont celles de l'admin actuelle (`$theme-colors` de `src/styles/variables.scss`), aucune clé nouvelle. Pour les objets graphiques, **au plus simple** : classes Bootstrap 4 et motifs existants de la bibliothèque avant tout SCSS neuf. |
| Validation | **Tout nouveau composant graphique passe par la validation de Jérôme** avant d'être intégré : montré dans l'aperçu `demo/recherche.html` (ou une capture), validé, puis commité. La liste des composants ci-dessous est une proposition, pas un acquis. |

## 1. Les trois écrans

### Écran A : fiche de recherche (étape 1)

Page « Rechercher des donateurs », remplaçante de `client/SimpleSearch.js`.

- En haut : une carte avec une icône étincelle, une phrase en langage naturel
  (« particuliers qui ont donné par chèque en 2025 pour la forêt ») et un bouton
  « Remplir les critères ». Dessous, l'indication « Les critères ci-dessous ont été
  remplis depuis votre phrase. Vérifiez-les avant de lancer. »
- Un lien « Critères avancés » en haut à droite, qui ouvre l'écran C.
- Une carte en sections horizontales, libellé en capitales à gauche :
  - **DONATEUR** : Nom, Prénom, E-mail, Adresse, Code postal, Ville, Pays ;
  - **CATÉGORIE** : pastilles à bascule (Administration, Association / Fondation,
    Autre, Entreprise, Legs, Particulier, Revenus financiers, Zoo), indication
    « Aucune cochée = toutes » ;
  - **PAIEMENT** : « du [date] au [date] », « de [min] à [max] € », groupe segmenté
    Tous | Régulier | Ponctuel ;
  - **MOYEN** : pastilles des moyens de paiement ;
  - **PROGRAMME** : pastilles Dulan, Forêt, Parrainages, Soutien ;
  - **AMI** : « enregistré du [date] au [date] ».
- Une barre de pied : la synthèse en clair avec les valeurs en gras
  (« **Particuliers** ayant payé entre le **01/01/2025** et le **31/12/2025**, par
  **chèque**, pour le programme **Forêt**. »), le lien « Tout effacer », le bouton
  « Voir les donateurs ».

### Écran B : en-tête de recherche simplifié (étape 2)

Au-dessus de la liste des donateurs.

- Ligne 1 : titre « Donateurs » et compteur « [N] résultats » ; une large barre de
  recherche avec l'étincelle, la phrase « donateurs réguliers du programme Dulan » et
  l'indication clavier « Entrée » ; le lien « Fiche de recherche » ; le bouton
  « + Donateur ».
- Ligne 2 : les critères actifs en pastilles supprimables (« Don : Régulier × »,
  « Programme : Dulan × ») ; des facettes à chevron (« Moyen de paiement ▾ »,
  « Catégorie ▾ », « Période ▾ ») ; une pastille pointillée « + Critère » ; le lien
  « Tout effacer ».
- La facette ouverte : un champ « Filtrer... », une liste à cocher (CB, Chèque ✓,
  Espèces, HelloAsso, Paypal, Prélèvement ✓, Stripe), un pied avec le compteur
  « 16 moyens » et le bouton « Appliquer ».

### Écran C : panneau de droite « Critères avancés » (étape 3)

Un tiroir d'environ 560 px, pleine hauteur sous l'en-tête de l'application, par-dessus
la liste assombrie.

- Titre « Critères avancés » et croix de fermeture.
- « Afficher les donateurs qui remplissent » + bascule « tous les critères | au moins
  un » (mode ET / OU du filtre).
- Une ligne par critère : [champ] [opérateur] [valeur(s)] [×]. Exemples : « Dernier
  paiement / entre / 01/01/2025, 31/12/2025 », « Association / est / Kalaweit
  France », « Ville / commence par / Valeur », « E-mail / est vide / pas de valeur à
  saisir ».
- « + Ajouter un critère » en pointillés.
- Un encart **EN CLAIR** : « Donateurs dont le dernier paiement est entre le
  01/01/2025 et le 31/12/2025, rattachés à Kalaweit France, dont la ville commence
  par …, sans e-mail. »
- Pied : « Tout effacer », « Appliquer ».

## 2. Ce que la bibliothèque offre aujourd'hui

### Le modèle `Filter`

`src/features/filter/Filter.js`. C'est la bibliothèque qui le définit, pas
`jsonapi-front` (qui ne fournit que `objectToQueryString`).

- Un `Filter` racine de type GROUP porte `data.filters[]`, des `Filter` de type ELEM.
  Chaque ELEM a `filter_name`, `operator`, `filter_crits` (clés `default`, `between`,
  ou des clés aléatoires pour les valeurs « ou » supplémentaires) et les drapeaux
  `fixed`, `default`, `enable`.
- `addFilter()` (L169) fusionne sur le nom : **un seul opérateur par champ**. « Dernier
  paiement entre A et B » et « Dernier paiement est vide » ne peuvent pas coexister.
- Le mode ET / OU est **global** (`data.mode`). Aucun mélange possible : c'est la
  raison pour laquelle la recherche rapide d'admin fait `init()` et efface tout.
- `asJsonApiObject()` (L221-281) produit `{ filter: { and: { champ: { oper: valeur } } } }` ;
  en mode OU `{ filter: { and: { or: { … } }, …fixes } }` ; `between` → `[a, b]` ;
  `empty` / `nempty` → `{ empty: null }` ; plusieurs valeurs d'un même champ sont
  jointes par des virgules.
- Opérateurs (`src/features/filter/index.js`) : `contains`, `soundex`, `ncontains`,
  `containsb`, `containse`, `eq`, `neq`, `empty`, `nempty`, `ltw`, `ltwe`, `ltwen`,
  `gt`, `gte`, `gten`, `in`, `nin`, `between`.
- Défauts connus :
  - `clone()` (L283-288) est **superficiel** : le tableau des enfants est partagé. Les
    brouillons de `DefaultPanel` fuient donc dans le filtre stocké en Redux avant
    validation ;
  - `if (fixed !== {})` (L261) est toujours vrai, la branche L272-278 est morte ;
  - `setFilterCrit` (L102-118) écrit `filter_crits[action]` au lieu de
    `filter_crits[locAction]` dans la branche par défaut ;
  - `setSearch()` / `FILTER_SEARCH_*` sont posés mais jamais lus.

### Les composants de filtre

- `FilterBuilder.jsx` dessine un `form-group` par colonne `filterable` ;
  `getOptionsForType` (L27-70) est une constante **privée au module**, libellés
  français en dur (dont « Est différenrt de »). Lacunes : `number` n'a pas de second
  champ pour `between`, `datetime` est rendu en texte, `in` / `nin` ne sont jamais
  proposés.
- `DefaultPanel.jsx` (exporté sous le nom `FilterPanel`) : panneau absolu, barre de
  50 px, onglets Filtres / Tri sauf `simpleMode`. Son `getDerivedStateFromProps`
  compare `props.filters` à `state.filters` alors que la clé d'état est `filter`.
- `FilterHeader.jsx` : radio et / ou + opérateur global.
- `ResponsiveQuickSearch` → `DefaultQuickSearch` : un formulaire `input-group` qui
  appelle `onSubmit(texte, mode)` avec `simple`, `plus` ou `reset`. Il ne touche jamais
  au `Filter`.

### L'en-tête de liste

`src/features/list/DefaultHeader.jsx` : une barre absolue de 50 px, trois `Col`
(lg 14 / 8 / 14 sur 36). À gauche icône, titre, compteur ; au centre le nœud
`quickSearch` (L226-236, n'importe quel élément) ; à droite le tri, le menu de
sélection, le bouton filtre (`onFilters`), le bouton de purge et les `globalActions`
(L357). **Aucun emplacement pour une seconde rangée.** `DefaultList.jsx` cale le corps
à `top: 50px` (L34-36) et sait déjà passer à 72 px avec `titleMultiline` (L314-327) :
c'est le précédent pour une rangée de pastilles. `MobileHeader` n'affiche pas
`quickSearch`.

### Les briques réutilisables

| Brique | Ce qu'elle sait faire | Pour quel écran |
|---|---|---|
| `basic/Dropdown` | Menu dans un `Portal` en position fixe, placement propre (`computePlacement`, retournement, maintien dans la fenêtre), fermeture au clic extérieur en capture, repositionnement au défilement et au redimensionnement, `align`, `maxHeight`, ancre `myRef` | La facette (B) telle quelle |
| `advanced/DropdownWrapper` | Clone un déclencheur, `children` en fonction `({ onClose })`. `autoClose` (L72) ferme à **tout** clic intérieur : à passer à `false` pour une liste à cocher | B |
| `advanced/Portal` | `div` ajouté à `body`, z-index croissant à partir de 1200 (L5), au-dessus de l'en-tête de page (900) | Le tiroir (C) |
| `react-transition-group` | Embarqué, déjà utilisé par le panneau de `DefaultList` | C |
| `basic/InputDate` | Natif sur mobile, masque jj/mm/aaaa + react-datepicker dans un `Dropdown` ailleurs ; émet `YYYY-MM-DD` ; exige `calIcon` et `delIcon` | Plages de dates (A, B, C) |
| `basic/InputMonetary`, `InputText` | Saisie monétaire et texte | A, C |
| `basic/InputSelect` | Select natif habillé. **Déclenche `onChange` au montage** si la valeur n'est pas dans les options (L80-110) : à éviter pour les sélecteurs de champ et d'opérateur | — |
| `basic/InputRadio`, `InputGroup` | Radios en ligne ; libellé, aide, erreur, disposition `labelTop` | A |
| `grid/Row`, `Col` | Grille 36 colonnes avec classes de conteneur (`WidthObserver`). `Col.js` L7 perd les props supplémentaires (`otherProps` sans spread) | A |
| `editor/HtmlEditor` | Prend un sac `icons` : précédent pour les composites | Convention |

### Ce qui manque

Tiroir / offcanvas, pastille supprimable, groupe segmenté, plage de dates ou de
montants, bascule multi-sélection, popover à facettes, section de formulaire, résumé
en clair. Aucun jeu d'icônes (tout est injecté par props), aucune variable SCSS propre.

### Contraintes de livraison

- Seuls les noms ré-exportés par `src/index.js` (99 exports) sont visibles d'admin, qui
  consomme le bundle `dist/`.
- Webpack 4 UMD, 6,4 Mo, seuls `react` et `react-dom` sont externes.
  `tests/dist.test.js` impose ES2019 dans le bundle.
- Jest 26 + enzyme. `__mocks__/react-dom.js` mocke automatiquement `react-dom`
  (`createPortal` factice) : un test de montage commence par
  `jest.unmock('react-dom')` puis `ReactDOM.render`, comme
  `tests/features/basic/DropdownPlacement.test.js`.
- `demo/` est un aperçu autonome du seul `HtmlEditor` (`node demo/build.js ../admin`),
  exclu du paquet npm par `.npmignore`.
- Une application ne doit jamais dépendre d'une copie manuelle : `sync-to.sh` sert à
  essayer, la livraison passe par npm (règle de `doc/editor/feuille-de-route.md`,
  reprise dans `ia/sortie-de-version.md` d'admin).

## 3. Ce que l'application admin attend

- **Liste des donateurs** : `client/List.js` → `ui/List.js` → `ResponsiveList`. La
  recherche rapide est `ResponsiveQuickSearch` (L248-261). Le bouton filtre fait
  `setPanel('filter', 'client')` ; `common/RightPanel.js` (L84-95) monte alors
  `client/FilterPanel.js`, qui est le `FilterPanel` de la bibliothèque en `simpleMode`.
  10 features sont branchées sur ce panneau droit, 12 autres ont un `FilterPanel.js`
  jamais affiché.
- **Catalogue des champs** : `client/helpers.js`, `getCols(this)` (L308-634), colonnes
  `filterable: { type, options, col }`. Les options viennent de helpers `*AsOptions`
  sur des slices chargées au démarrage (`home/redux/loadAll.js` L34-56) :
  `paymentType`, `clientCategory`, `causeType` (programmes), `lang`, `country`,
  `site`… Il n'existe **pas** de `sessionAsOptions` : la facette « Période » n'a pas
  de liste à proposer. Coquilles à tolérer : `type: 'test'` sur `cli_email` (L451),
  `name: 'category'` en double, filtre `sponsorship` nourri avec les options de
  `paymentType` (L593-610), « Dernier paiement » = `last_donation.don_real_ts` alors
  que la fiche actuelle filtre `donations.don_real_ts`.
- **Recherche rapide** : `client/redux/updateQuickSearch.js` (L20-43) fait
  `init(OR, LIKE)` puis quatre `addFilter` (prénom, nom, deux e-mails). Elle **efface
  tout autre critère** et modifie l'objet en place.
- **Chargement** : `client/redux/loadMore.js` (L26-47) envoie
  `filters.asJsonApiObject()` + page + tri à `GET /v1/asso/client` via
  `objectToQueryString` de jsonapi-front, **sans encodage d'URL**.
- **Fiche actuelle** : `client/SimpleSearch.js`, `search()` (L161-346) : identité et
  adresse en `contains`, catégories → `client_category.clic_id` `eq` multi-valeurs,
  dates et montants en `between` / `gte` / `ltwe`, ami → `sponsorships.spo_ts`,
  régulier / ponctuel → `donations.sponsorship.spo_id` `nempty` / `empty`, moyens →
  `donations.payment_type.ptyp_id`, programmes →
  `donations.cause.cause_type.caut_id`. Puis `setFilters`, `clearItems`,
  `push('/client')`. Même schéma pour `donation` et `receipt`.
- Aucune recherche sauvegardée nulle part.
- **Icônes** : admin dessine avec `@mdi/js` 5.9.55. `Close`, `MenuDropDown`, `AddOne`,
  `DelOne`, `Calendar`, `Filter*` existent dans `src/features/icons` ; l'étincelle
  (`mdiCreation`) et le chevron (`mdiChevronDown`) sont à ajouter.

## 4. Écarts entre les écrans et la bibliothèque

| Élément d'écran | Existe | À créer |
|---|---|---|
| Carte « phrase + Remplir les critères » (A), barre étincelle (B) | Le nœud `quickSearch` de l'en-tête accepte n'importe quoi | `InputNaturalSearch` (variantes `card` et `bar`, mode « en construction ») |
| Sections à libellé en capitales (A) | `Row` / `Col` | `SearchForm`, `SearchFormSection`, `SearchFormField`, `SearchFormFooter` |
| Pastilles à bascule (A) | — | `Chip` variante `toggle`, `InputPillGroup` |
| « du … au … », « de … à … € » (A, C) | `InputDate`, `InputMonetary` | `InputDateRange`, `InputAmountRange`, `InputNumberRange` |
| Tous / Régulier / Ponctuel (A), tous / au moins un (C) | motif `btn-group` + `active` dans `DefaultList` | `InputSegmented` |
| Synthèse en clair (A, C) | — | `filterToSentence` + `SearchSummary` |
| Pastilles de critères actifs, facettes, « + Critère » (B) | — | `Chip` variantes `active`, `facet`, `add` ; `SearchChipBar` |
| Facette ouverte (B) | `Dropdown` | `FacetPopover` (contenu seulement) |
| Seconde rangée d'en-tête (B) | précédent `titleMultiline` | prop `toolbar` sur `DefaultHeader` / `DefaultList` / `MobileHeader` / `MobileList` |
| Bouton « + Donateur » avec texte (B) | `globalActions` icône seule | `globalActions[].text` |
| Tiroir (C) | `Portal`, transitions | `Drawer` |
| Lignes champ / opérateur / valeur (C) | matrice privée de `FilterBuilder` | `operators.js`, `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer` |
| Recherche rapide qui coexiste avec les critères (B) | impossible (mode global) | extension `group` du modèle `Filter` |
| Une seule définition des champs pour les trois écrans | `getCols` d'admin | contrat de **catalogue** + `catalogFromCols` |

## 5. Architecture proposée

Résumé ; signatures et fichiers dans [composants.md](composants.md). Chaque composant
graphique de cette liste est une **proposition** : il est montré dans l'aperçu et validé
avant d'être codé pour de bon (voir la feuille de route). Si un motif Bootstrap ou une
brique existante suffit, on s'en contente.

### Primitives, dans les dossiers existants

- `advanced/Drawer` : tiroir dans un `Portal`, `open`, `onClose`, `side`, `width`
  (560), `top` (décalage sous l'en-tête, fourni par l'application : 60 sur bureau,
  40 sur mobile), fond assombri, Échap, déplacement et restitution du focus.
- `basic/Chip` : `variant` `active | facet | add | toggle | default`, `onRemove`,
  `count`, `caretIcon`, `checkIcon` ; `React.forwardRef` pour servir d'ancre à
  `Dropdown`. Construite sur `btn btn-sm` et les classes `btn-outline-*` / `btn-*`
  de Bootstrap : le SCSS propre se limite au bouton × et à la bordure pointillée.
- `basic/InputSegmented` : le motif `btn-group` + `active` déjà utilisé par
  `DefaultList`, avec le rôle `radiogroup` et les flèches clavier. Aucun SCSS.
- `basic/InputDateRange`, `InputAmountRange` : valeur `[de, à]`, la forme même du
  `between` du modèle. `InputNumberRange` seulement si un champ `number` a besoin de
  « entre » dans le tiroir (étape 3, à valider).
- `basic/InputPillGroup` : pastilles à bascule, multi-sélection, indication
  « Aucune cochée = toutes ».
- Correction additive de `grid/Col.js` : spread des props restantes, pour que `id`,
  `role` et `aria-*` atteignent le DOM.

### Composites, dans un nouveau `src/features/search/`

Modules purs d'abord, parce que ce sont eux que les trois écrans partagent :
`catalog.js` (normalisation du catalogue, dérivation depuis `getCols`), `operators.js`
(la matrice opérateurs / type **en données**, libellés via `t`, qui comble les lacunes
de `FilterBuilder` sans le toucher), `criteria.js` (aller-retour valeurs ↔ `Filter`,
lignes ↔ `Filter`), `filterToSentence.js` (la phrase en clair), `i18n.js`.

Puis les composants : `SearchSummary` ; `SearchForm` et ses sections (écran A) ;
`InputNaturalSearch` ; `FacetPopover` et `SearchChipBar` (écran B) ;
`SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer` (écran C).

Règles communes : composants de classe React 16 comme le reste de la bibliothèque, `t`
par défaut `rbfIntl` avec de nouvelles clés `rbf.search.*` dans `src/features/intl/fr.js`,
icônes injectées (un sac `icons` pour les composites, des props explicites pour les
primitives), selects **natifs** pour les champs et opérateurs, aucune dépendance npm
nouvelle, aucun hook pour rester homogène.

### En-tête de liste

Pas de nouvel en-tête : une prop additive `toolbar` (et `toolbarHeight`, 44 par
défaut) sur `DefaultHeader`, `DefaultList`, `MobileHeader`, `MobileList`, sur le
modèle de `titleMultiline`. Quand `toolbar` est fourni, la barre passe de 50 à
50 + 44 px et le corps de liste se décale d'autant. `globalActions[].text` affiche un
libellé après l'icône. Le centre de la première ligne reste `quickSearch`, où admin
place `InputNaturalSearch`.

## 6. Le catalogue de champs

Un seul objet JavaScript, construit par l'application à partir de son `getCols`, qui
pilote les quatre usages : les champs du formulaire (A), les facettes et les
pastilles (B), les lignes de critères (C) et la phrase en clair (A, C).

```js
{
  name: 'cli_town',             // nom de champ du Filter, ce qu'émet asJsonApiObject
  label: 'Ville',
  type: 'text',                 // text | number | monetary | date | datetime | bool | select | picker
  defaultOperator: 'containsb', // opérateur présélectionné ; text → contains, select → eq, date / monetary → between
  operators: [...],             // sous-ensemble facultatif de la matrice du type
  options: [{ value, label }],  // select : la forme des *AsOptions d'admin
  multiple: true, multiOperator: 'eq',   // plusieurs valeurs jointes par virgule, ce que l'API accepte déjà
  format: v => '…',             // valeur → texte pour la phrase
  phrase: { label: 'le dernier paiement', eq: 'rattachés à {value}' },
  facet: { order: 10, kind: 'options' | 'range', searchable: true, countLabel: n => `${n} moyens` },
  section: 'paiement', widget: 'date-range',   // formulaire
  subjectFor: values => 'Particuliers',        // remplace le sujet de la phrase
}
```

Les besoins métier qui ne sont pas un champ (Tous / Régulier / Ponctuel, qui se
traduit par `nempty` / `empty` sur `donations.sponsorship.spo_id`) sont des **champs
virtuels** déclarés par l'application : `{ virtual: true, fields: [...], toFilter,
fromFilter, toText }`. La bibliothèque reste générique, admin garde la connaissance
du domaine.

`catalogFromCols(cols, overrides)` dérive le catalogue de `getCols(this)` et tolère
les coquilles d'admin (`'test'` → `'text'` avec avertissement, doublons de nom,
`'boolean'` → `'bool'`). « Période » devient une facette `range` sur
`last_donation.don_real_ts`, faute de liste de sessions.

La phrase en clair se compose par fragments (« dont {label} {opérateur} {valeur} »,
`empty` → « sans e-mail », `between` → « entre le A et le B »), avec un sujet
(« Donateurs », ou « Particuliers » quand `subjectFor` répond) et le connecteur du mode
(« et » / « ou »). Les deux phrases des maquettes sont les fixtures des tests :

- « Donateurs dont le dernier paiement est entre le 01/01/2025 et le 31/12/2025, rattachés à Kalaweit France, dont la ville commence par …, sans e-mail. »
- « Particuliers ayant payé entre le 01/01/2025 et le 31/12/2025, par chèque, pour le programme Forêt. »

## 7. Évolutions du modèle `Filter`

Toutes additives, dans `src/features/filter/Filter.js`. **La sortie de
`asJsonApiObject()` ne change pas** pour un filtre sans groupe : des tests dorés
(ET, OU, `between`, `empty`, fixes + OU, `eq` multi-valeurs) sont écrits avant la
première modification.

| Ajout | Rôle |
|---|---|
| `clone(deep = true)` | Copie profonde des enfants et de leurs `filter_crits`. `clone(false)` garde l'ancien comportement. Seul effet visible : le « Annuler » de `DefaultPanel` annule vraiment. |
| `removeAll({ keepFixed = true, keepDefault = true })` | « Tout effacer » sans toucher aux critères fixes et par défaut. |
| `replaceFilter(name, values, oper, flags)` | Remplacer un critère sans repasser par `init()`. |
| `setFilterValues(name, values = [], oper = 'eq')` | Plusieurs valeurs d'un coup (`default` + clés aléatoires) ; tableau vide = retrait. Remplace la danse `addFilter` + `updateFilter(randomString)` de `SimpleSearch.js`. |
| `setFilterRange(name, from, to)` | `between` si deux bornes, `gte` ou `ltwe` si une seule, retrait si aucune : la règle de `SimpleSearch.js`, centralisée. |
| `getFilters({ enabledOnly, fixed, default })`, `getValues()`, `hasFilter(name)` | Itérer sans toucher `data`. |
| `toPlain()` / `Filter.fromPlain(obj)` | Forme JSON `{ mode, operator, filters: [{ name, operator, values, fixed, default, enable, group }] }` : recherches sauvegardées, sortie du LLM, fixtures. `fromJsonApiObject` est **différé** (il faudrait le catalogue pour découper les valeurs jointes). |
| `group` sur un ELEM, `addFilter(…, group)`, `removeGroup(group)` | En mode ET, les éléments d'un groupe sont émis en `and: { …critères, or: { …groupe } }`. **Seule façon** de faire coexister la recherche rapide (OU sur quatre champs) et les critères (ET). Cette forme est déjà celle du mode OU, l'API la lit donc très probablement : à confirmer avant l'étape 2. |
| Correction `locAction` dans `setFilterCrit` (L115) | Couverte par un test. |

Ne pas remplacer `fixed !== {}` (L261) par un vrai test de vide : cela changerait la
sortie du mode OU sans élément fixe.

## 8. Emplacement LLM « en construction »

Le contrat est fixé dès l'étape 1 pour ne plus bouger :

```ts
onNaturalLanguage?: (phrase, { catalog /* catalogToJson() */, filter, locale })
  => Promise<{ filter?, plain?, values?, mode?, warnings?, explanation? }>
```

- `InputNaturalSearch` : `comingSoon` vaut `!onNaturalLanguage`. Tant que c'est le
  cas, soumettre affiche une notice sous le champ (« Recherche en langage naturel : en
  construction pour l'instant », via `t`) et rien d'autre. Dans la barre d'en-tête,
  la touche Entrée **conserve la recherche rapide actuelle** (`onQuickSearch`) pour ne
  rien casser ; c'est l'étincelle qui montre la notice.
- `SearchForm` : à la réception d'un résultat, les valeurs sont fusionnées dans le
  formulaire, l'indication « Les critères ci-dessous ont été remplis depuis votre
  phrase… » apparaît avec les `warnings` ; rien n'est lancé automatiquement.
- Le tiroir n'a pas d'emplacement LLM (la maquette n'en montre pas).
- Rien d'autre n'est implémenté avant l'étape 4 : ni endpoint, ni validation, ni
  état d'attente serveur.

## 9. Thème et SCSS

Règle : **on garde les couleurs de l'admin actuelle et on adapte les maquettes**, pas
l'inverse. Les maquettes donnent l'idée du résultat ; leurs teintes exactes n'ont pas à
être reproduites.

- Aucune clé nouvelle dans la map `$theme-colors` d'admin
  (`src/styles/variables.scss`). Tout passe par les classes Bootstrap générées depuis
  cette map (`btn-outline-secondary`, `bg-light`, `text-secondary`…) et, dans le SCSS
  de la bibliothèque, par `theme-color()` sur les clés qu'elle utilise déjà.
- Correspondance avec admin : boutons d'action `primary` (vert), en-tête et textes
  `secondary` (bleu), fonds clairs `light` (le bleu très pâle des encarts existants).
  `primary-light` est vert pâle dans admin : ne pas s'en servir comme fond neutre.
- Au plus simple : un composant se construit d'abord avec les classes Bootstrap 4 et
  les motifs déjà présents dans la bibliothèque (`btn-group` + `active`, `badge`,
  `custom-checkbox`, `.custom-scrollbar`, `.modal-shadow`). Un SCSS propre n'est écrit
  que pour ce que Bootstrap ne fait pas : position et transition du tiroir, bouton ×
  d'une pastille, bordure pointillée de « + Critère ».
- Un fichier SCSS par composant qui en a besoin, importé par le `style.scss` de sa
  feature ; le nouveau `search/style.scss` est ajouté à `src/styles/index.scss`.
- `look2.scss` pose `user-select: none` sur tout (L46-49) : les champs de saisie le
  réactivent déjà, les pastilles n'en ont pas besoin.

## 10. Mobile (moins de 768 px)

Volontairement minimal et explicite :

- tiroir pleine largeur (`width: 100%` en media query), `top` fourni par l'application ;
- barre de pastilles sur une ligne en défilement horizontal (classes de conteneur
  `container-xxs` / `container-xs` déjà produites par `WidthObserver`) ;
- facette : toujours `Dropdown`, largeur `calc(100vw - 16px)`, hauteur 60vh ;
- formulaire : les sections s'empilent par la grille (`xxs: 36`), les plages se
  superposent sous 512 px, le pied reste collant ;
- `MobileHeader` reçoit seulement l'emplacement `toolbar`. Il n'affiche toujours pas
  `quickSearch` : ce qu'on met sur mobile (pastilles seules, ou pastilles + barre)
  reste au choix de l'application.

## 11. Tests et aperçu

- Unitaires : modèle (`clone` profond, `removeAll`, `setFilterValues`,
  `setFilterRange`, `toPlain` / `fromPlain`, `group`, fixtures dorées),
  `operators.js`, `catalog.js` sur une copie du `getCols` d'admin, `criteria.js`,
  `filterToSentence.js` avec les deux phrases des maquettes.
- Montage, sur le motif de `DropdownPlacement.test.js` : `Drawer` (portail, Échap,
  fond, focus), `FacetPopover` (filtrage, cases, Appliquer, Entrée, clic extérieur),
  `SearchCriteriaRow` (changement d'opérateur → changement de rendu),
  `SearchChipBar` (une pastille par critère, × rend un nouveau `Filter` sans toucher
  l'original), `InputNaturalSearch` (notice en construction, aucun appel).
- `tests/dist.test.js` reste la garde ES2019.
- Aperçu : une seconde page `demo/recherche.html` sur le gabarit de
  `demo/index.html` (bundle `dist/`, `app.css` compilé d'admin, icônes MDI), montant
  la fiche, la barre de pastilles et le tiroir sur un catalogue de donateurs codé en
  dur, avec `filter.asJsonApiObject()` et la phrase affichés en direct. `MAP` de
  `demo/build.js` étendue (`sparkle: 'mdiCreation'`, `caret: 'mdiChevronDown'`,
  `close: 'mdiClose'`, `check: 'mdiCheck'`, `plus: 'mdiPlus'`, `calendar: 'mdiCalendar'`).

## 12. Risques et questions ouvertes

| Sujet | Risque | Recommandation |
|---|---|---|
| Mélange ET / OU | La recherche rapide efface les critères, et la barre de l'écran B rend cela visible | Extension `group` + **vérification côté API** que `filter[and][or][…]` est accepté à côté de `filter[and][champ]`. Repli : un champ de recherche serveur unique, ou garder l'effacement en l'annonçant dans les pastilles. À trancher avant l'étape 2. |
| Entrée dans la barre, tant que le LLM est en construction | Régression de la recherche rapide | Entrée = recherche rapide actuelle, étincelle = notice. À confirmer. |
| `clone()` profond par défaut | Change le « Annuler » des 9 panneaux `DefaultPanel` (en mieux) | Profond par défaut ; sinon `cloneDeep()` séparé. À trancher avant l'étape 1. |
| Un opérateur par champ | Deux lignes sur le même champ impossibles dans le tiroir | Limitation acceptée : le sélecteur de champ grise les champs déjà utilisés. |
| Encodage d'URL | « Ville commence par » avec espace, accent, `&` ou `+` casse la requête | Correction dans jsonapi-front (`objectToQueryString`) ou pré-encodage des valeurs côté admin. Indépendant de cette bibliothèque. |
| Bornes de dates | `between` sur un horodatage : borne haute inclusive ou non | Question backend, identique à la fiche actuelle. |
| Taille du bundle | Déjà 6,4 Mo | Ajout d'environ 1 500 lignes sans dépendance : négligeable. Le vrai levier reste la 4.0.0 (retrait de draft-js). |
| React 16 | `findDOMNode` dans `Dropdown` ; `forwardRef` disponible | Rien à faire pour l'instant. |
| Icônes | La bibliothèque n'en fournit pas | Admin crée `icons/Sparkle.js` (`mdiCreation`) et fournit chevron, croix, plus, corbeille, calendrier, coche. |
| Chaînes en dur | `FilterBuilder` garde ses libellés | Les nouveaux textes passent tous par `t` ; `FilterBuilder` pourra consommer `operators.js` plus tard. |
| Accessibilité | Pastilles, popover, tiroir au clavier | Boutons avec `aria-label`, `role="dialog"`, Échap, focus restitué, `radiogroup` fléché, `aria-pressed`. |
| Transition | Tiroir et panneau droit coexistent un temps | La barre de pastilles lit `client.filters` : elle reflète les deux. |
| Pluriel du sujet | « Particulier » → « Particuliers » | Fourni par l'application via `subjectFor`, la bibliothèque n'accorde pas. |

Suite : [feuille-de-route.md](feuille-de-route.md).

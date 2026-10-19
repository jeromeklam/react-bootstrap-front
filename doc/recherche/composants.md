# Recherche : contrat des composants

Signatures et fichiers des briques décrites dans [etude.md](etude.md). Les props
sont données au format des pages `doc/basic/*.md`. Les types sont ceux de
`prop-types` ; « req. » = obligatoire.

## Statut et validation

Les maquettes donnent l'idée du résultat, pas un rendu à reproduire à l'identique. On
garde leurs idées de présentation ; les couleurs et les objets graphiques sont ceux de
l'admin actuelle, **au plus simple**. **Chaque composant graphique ci-dessous est une
proposition** : il est montré dans l'aperçu `demo/recherche.html` (ou une capture) et
validé par Jérôme avant d'être commité. Les modules purs et les méthodes du modèle
`Filter` n'ont pas de rendu : ils suivent la relecture de code habituelle.

| Composant graphique | Étape | Statut |
|---|---|---|
| `Chip` (variante `toggle`), `InputSegmented`, `InputPillGroup` | 1 | **validé le 18/10/2026** sur l'aperçu |
| `InputDateRange`, `InputAmountRange` | 1 | **validé le 18/10/2026** sur l'aperçu |
| `SearchSummary` | 1 | **validé le 18/10/2026** sur l'aperçu |
| `InputNaturalSearch` (variantes `card` et `bar`) | 1 | **validé le 18/10/2026** sur l'aperçu ; centrage à reprendre à la revue de la fiche |
| `SearchForm`, `SearchFormSection`, `SearchFormField`, `SearchFormFooter` | 1 | **validé le 18/10/2026** sur l'aperçu |
| `Chip` (variantes `active`, `facet`, `add`) | 2 | rendu **validé le 18/10/2026** sur l'aperçu |
| `FacetPopover`, `SearchChipBar` | 2 | **validé le 19/10/2026** sur l'aperçu ; la rangée doit pouvoir se masquer (bouton d'en-tête, masquée par défaut) |
| Emplacement `toolbar` de l'en-tête (repliable, mémorisé), `InputNaturalSearch` (variante `bar`) | 2 | **validé le 19/10/2026** sur l'aperçu (« nickel ») |
| `Drawer` (extensible), `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer` | 3 | **validé le 19/10/2026** sur l'aperçu (« pas mal du tout ») ; admin retient le panneau droit de la page (`SearchCriteriaPanel`), pas le tiroir |
| Panneau droit de `DefaultPage` à largeur réglable, `SearchCriteriaPanel` dans ce panneau | 3 | **validé le 19/10/2026** dans admin (« pas mal du tout ») |
| `InputNumberRange` | 3 | optionnel, à valider |
| `InputNaturalSearch` : attente et avertissements sous le champ ; carte « Étape 4 » de l'aperçu, branchée sur l'Ollama du poste | 4 | **validé le 19/10/2026** sur l'aperçu avec le vrai modèle (« ça me paraît pas mal du tout ») |

Mettre cette table à jour à chaque validation.

## Conventions communes

- Composants de classe React 16, comme le reste de la bibliothèque.
- Libellés via la prop `t`, par défaut `rbfIntl` ; nouvelles clés `rbf.search.*`,
  `rbf.range.*` et `rbf.filter.oper.*` dans `src/features/intl/fr.js`. Le petit module
  `search/i18n.js` fournit `tr(t, id, defaultMessage, values)`, qui appelle `t` puis
  remplace les `{token}` restants, pour fonctionner aussi bien avec `rbfIntl` (qui
  ignore `values`) qu'avec `intl.formatMessage`, et `warnOnce(message)` (un
  avertissement par message, les catalogues se reconstruisant à chaque rendu).
- Icônes injectées : props explicites sur les primitives (`calIcon`, `delIcon`,
  `removeIcon`…), un sac `icons` sur les composites (précédent : `HtmlEditor`).
- Les champs émettent `{ target: { name, value } }`, comme `InputDateWeb.onClear` ou
  `InputMonetary.onAccept`.
- Sélecteurs de champ et d'opérateur : `<select>` natifs, jamais `InputSelect` (qui
  déclenche `onChange` au montage).
- Aucune dépendance npm nouvelle. Les transitions utilisent `react-transition-group`,
  déjà embarqué.
- Au plus simple : classes Bootstrap 4 et couleurs de la map `$theme-colors` d'admin,
  motifs déjà présents dans la bibliothèque. Un fichier SCSS par composant seulement
  s'il reste quelque chose que Bootstrap ne fait pas.

## Primitives

### `Drawer` — `src/features/advanced/Drawer.js`

Tiroir latéral dans un `Portal`, **extensible**.

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `open` | bool, req. | | Ouvert ou fermé (fermé : rien n'est rendu) |
| `onClose` | func, req. | | Croix, Échap, clic sur le fond |
| `side` | `'right'` \| `'left'` | `'right'` | |
| `width` | number \| string | `560` | Largeur normale |
| `expandedWidth` | number \| string | `'85vw'` | Largeur agrandie |
| `expandable` | bool | `true` | Le bouton agrandir / réduire de l'en-tête |
| `expanded` | bool | `null` | Contrôlé par l'application si fourni ; sinon mémorisé |
| `defaultExpanded` | bool | `false` | |
| `storageKey` | string | | Mémorisation de l'agrandissement (`localStorage`, `rbf.drawer.<clé>.expanded`) |
| `onExpandToggle` | func | | `(expanded)` |
| `top` | number | `0` | Décalage sous l'en-tête de l'application (60 sur bureau dans admin). La bibliothèque ne devine pas la hauteur de l'en-tête. |
| `backdrop`, `closeOnBackdrop`, `closeOnEscape` | bool | `true` | |
| `title` | node | | |
| `closeIcon`, `expandIcon`, `collapseIcon` | element | `×`, `⇥`, `⇤` à défaut | |
| `footer` | node | | Barre de pied |
| `children` | node | | Corps, défilant |
| `className` | string | | |

Rendu : `Portal` → `.rbf-drawer-backdrop` (fixe sous `top`, assombri `rgba(dark, .35)`)
+ `aside.rbf-drawer.bg-white.modal-shadow` (`role="dialog" aria-modal`, `tabIndex=-1`,
glissé depuis son bord en 300 ms) : en-tête (titre `h5`, agrandir / réduire, croix),
corps `.custom-scrollbar`, pied. Échap écouté sur `document` en capture ; le focus passe
au panneau à l'ouverture et revient à l'élément d'origine à la fermeture. Pleine largeur
sous 768 px. Pas de blocage du défilement : `look2.scss` pose déjà `overflow: hidden` sur
`html, body`. `src/features/helpers/storedFlag.js` (`readStoredFlag`, `writeStoredFlag`)
porte la mémorisation, partagée avec la rangée d'outils des listes.

Tests de montage : `tests/features/advanced/Drawer.test.js`, après
`jest.unmock('react-dom')`, sans l'`act` de `react-dom/test-utils`.

### `Chip` — `src/features/basic/Chip.js`

Pastille. `React.forwardRef` : elle peut servir d'ancre `myRef` à `Dropdown`.

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `label` | node, req. | | |
| `variant` | `'default'` \| `'active'` \| `'facet'` \| `'add'` \| `'toggle'` | `'default'` | |
| `theme` | string | `'secondary'` | Clé de `$theme-colors`. Le bleu d'admin ; le vert `primary` reste aux boutons d'action. |
| `active` | bool | `false` | `toggle` sélectionnée, `facet` avec valeur |
| `count` | number | | Badge de compteur (facette) |
| `onClick` | func | | |
| `onRemove` | func | | Affiche le bouton × |
| `removeIcon`, `caretIcon`, `checkIcon` | element | | |
| `disabled` | bool | `false` | |
| `size` | `'sm'` | | |
| `title`, `className` | string | | |

Rendu : `button.btn.btn-sm.rbf-chip` avec les classes Bootstrap `btn-outline-{theme}`
(inactive) ou `btn-{theme}` (active), arrondie ; libellé, éventuel `badge` de
compteur, éventuel `button.rbf-chip-remove[aria-label]`. `facet` →
`aria-haspopup="dialog" aria-expanded` ; `toggle` → `aria-pressed`. Le SCSS propre se
limite au bouton ×, à la bordure pointillée de `add` et au rayon.

### `InputSegmented` — `src/features/basic/InputSegmented.js`

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `name` | string, req. | | |
| `value` | string | | |
| `options` | `[{ value, label, icon? }]`, req. | | |
| `onChange` | func | | `{ target: { name, value } }` |
| `theme` | string | `'secondary'` | |
| `size` | `'sm'` | `'sm'` | |
| `allowEmpty` | bool | `false` | Re-cliquer désélectionne |
| `disabled` | bool | | |
| `label`, `labelTop`, `help` | | | Comme `InputGroup` |

Rendu : `form-group` + libellé (comme `InputRadio`) + `div.btn-group[role=group]` de
`button.btn[aria-pressed]`, navigation au clavier par Tab (pas de focus tournant : au
plus simple). `btn-outline-{theme}` inactif, `btn-{theme} active` actif : le motif de
`DefaultList`, aucun SCSS.

### `InputDateRange`, `InputAmountRange` (et `InputNumberRange`, optionnel) — `src/features/basic/`

Déclinaisons d'un `InputRange` interne. `InputNumberRange` n'est écrit que si un champ
`number` a besoin de « entre » dans le tiroir (étape 3).

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `name` | string, req. | | |
| `value` | `[from, to]` | `[null, null]` | La forme du `between` du modèle |
| `onChange` | func | | `{ target: { name, value: [from, to] } }` |
| `fromLabel`, `toLabel` | node | « du » / « au » (`rbf.range.from` / `.to`), « de » / « à » (`rbf.range.min` / `.max`) via `t` | Préfixes, passés en `prepend` aux champs |
| `label`, `labelTop`, `size`, `disabled`, `error` | | | |
| `calIcon`, `delIcon` | element, req. (dates) | | Transmis à `InputDate` : natif sur mobile, masque + calendrier ailleurs |
| `unit` | string | `'€'` (montants) | |
| `allowNull` | bool | `true` (montants) | |

Rendu : `.rbf-input-range` (un `form-group` avec le libellé), deux champs du type
voulu (`InputDate` ou `InputMonetary`, chacun avec son `prepend`) nommés `name.from` et
`name.to`, côte à côte en flex, l'un sous l'autre quand la place manque. Une borne
absente vaut `''` ; `onClear` d'un champ vide sa borne.

### `InputPillGroup` — `src/features/basic/InputPillGroup.js`

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `name` | string, req. | | |
| `value` | array | `[]` | |
| `options` | `[{ value, label, count? }]`, req. | | |
| `onChange` | func | | `{ target: { name, value: array } }` |
| `multiple` | bool | `true` | |
| `hint` | node | | « Aucune cochée = toutes » |
| `checkIcon` | element | | |
| `theme` | string | `'secondary'` | |
| `size`, `disabled`, `label`, `labelTop` | | | |

Rendu : `.rbf-pill-group[role=group]` de `Chip variant="toggle"`. Les valeurs sont
comparées en chaînes (`'3'` et `3` se valent), l'événement rend les valeurs d'origine.

### Correction de `Col` — `src/features/grid/Col.js`

L7 lit `const { size, otherProps } = props` : `otherProps` n'existe jamais, aucune
prop supplémentaire n'atteint le `div`. Remplacer par
`const { size, textAlign, className, children, ...otherProps } = props`. Sans effet
pour les appelants actuels ; nécessaire à `SearchFormSection` (`aria-labelledby`).

## Modèle `Filter` : méthodes ajoutées — `src/features/filter/Filter.js`

Rappel des signatures dont les composites dépendent ; le pourquoi est dans
[etude.md](etude.md), section 7. Toutes additives, sortie de `asJsonApiObject()`
inchangée pour un filtre sans groupe.

| Méthode | Signature | Étape |
|---|---|---|
| `clone` | `clone(deep = true) → Filter` | 1 |
| `removeAll` | `removeAll({ keepFixed = true, keepDefault = true } = {})` | 1 |
| `replaceFilter` | `replaceFilter(name, values, oper = 'eq', { fixed, default, enable } = {})` | 1 |
| `setFilterValues` | `setFilterValues(name, values = [], oper = 'eq')` — tableau vide = retrait | 1 |
| `setFilterRange` | `setFilterRange(name, from, to)` — `between`, `gte`, `ltwe` ou retrait | 1 |
| `getFilters` | `getFilters({ enabledOnly = true, fixed = false, default: true } = {}) → Filter[]` (ELEM) | 1 |
| `getValues` | sur un ELEM : `getValues() → [default, between?, ...extras]` | 1 |
| `hasFilter` | `hasFilter(name) → bool` | 1 |
| `toPlain` / `fromPlain` | `toPlain() → PlainFilter`, `static fromPlain(obj) → Filter` ; `PlainFilter = { mode, operator, filters: [{ name, operator, values, fixed, default, enable, group }] }` | 1 |
| `addFilter` | septième paramètre `group = ''` ; `setGroup` / `getGroup` sur un ELEM ; `replaceFilter`, `setFilterValues`, `setFilterRange` acceptent `group` dans leurs drapeaux ; `getFilters({ group })` ; `toPlain` / `fromPlain` le conservent. En mode ET, les critères groupés sortent en `and: { …, or: { …groupe } }` ; sans groupe la sortie est inchangée ; en mode OU le groupe est ignoré. | 2 |
| `removeGroup` | `removeGroup(group)` | 2 |

## Modules purs — `src/features/search/`

### `catalog.js`

- `normalizeType(type)` : `text`, `number`, `monetary`, `date`, `datetime`, `bool`,
  `select`, `picker` ; alias tolérés avec un avertissement unique (`'test'` →
  `'text'`, `'boolean'` → `'bool'`, `int` / `float` → `number`, `money` →
  `monetary`…) ; inconnu → `text`.
- `normalizeField(field)` : complète `label`, `type`, `defaultOperator` (par type),
  `multiple` (vrai pour `select`), `multiOperator` (`'eq'`), `options`, `hidden`,
  `virtual`, `fields`.
- `normalizeCatalog(fields)` : `normalizeField` sur chaque entrée, ignore les
  entrées sans `name`, dédoublonne par `name` (le dernier contenu gagne, à la place du
  premier), un avertissement par problème.
- `catalogFromCols(cols, overrides = {})` : garde les colonnes `filterable` qui ont
  un libellé (ou dont `overrides[name]` en donne un), `name = filterable.col ||
  col.col`, `type = filterable.type`, `options`, `picker` (`onSearch`, `display`, qui
  force le type `picker`) ; fusionne `overrides[name]` ; ajoute `overrides.extra`
  (champs virtuels).
- `orderCatalogBySections(catalog, sections)` : les champs des sections d'abord, dans
  leur ordre, puis les autres — `SearchForm` s'en sert pour que la phrase suive la fiche
  et non la liste dont le catalogue est dérivé.
- `findField(catalog, name)` ; `fieldOwning(catalog, name)` : le champ virtuel qui
  liste ce nom dans `fields`, sinon le champ lui-même ; `fieldsForRows` (non
  cachés), `fieldsForFacets` (ceux à `facet`, triés par `facet.order` puis libellé),
  `fieldsForSection(catalog, section)`.
- `catalogToJson(catalog)` : nom, libellé, type, opérateurs, options, section,
  virtuel et ses champs ; aucune fonction.

### `operators.js`

La matrice de `FilterBuilder.getOptionsForType` ré-exprimée en données, étendue :

| Type | Opérateurs proposés |
|---|---|
| `text` | `contains`, `ncontains`, `containsb`, `containse`, `soundex`, `eq`, `neq`, `empty`, `nempty` |
| `number`, `monetary` | `eq`, `neq`, `gt`, `gte`, `ltw`, `ltwe`, `between`, `empty`, `nempty` (`gten` / `ltwen` seulement si listés dans `field.operators`) |
| `date`, `datetime` | `eq`, `neq`, `gt`, `gte`, `ltw`, `ltwe`, `between`, `empty`, `nempty` — libellés « Postérieur à » / « Antérieur à » |
| `select` | `eq`, `neq`, `empty`, `nempty` (+ `in` / `nin` si `multiOperator: 'in'`) |
| `bool` | `eq`, `empty`, `nempty` |
| `picker` | `eq`, `neq`, `empty`, `nempty` |

Fonctions : `getOperatorsForType(type, t, { multiOperator })`,
`getFieldOperators(field, t)`, `operatorLabel(oper, type, t)` (sélecteurs : « est »,
« commence par », « entre », « à partir du » pour les dates…, clés
`rbf.filter.oper.<oper>` et `rbf.filter.oper.<oper>.date`), `operatorPhrase(oper,
type, t)` (phrase en clair : « est entre », « est avant le »…, clés
`rbf.filter.phrase.<oper>[.date]`, défauts dans le code), `needsValue(oper)` (faux
pour `empty` / `nempty`), `isRange(oper)`, `defaultOperatorForType(type)`,
`DEFAULT_OPERATOR_BY_TYPE`, `OPERATORS_BY_TYPE`.

### `criteria.js`

L'aller-retour du formulaire (étape 1) :

- `valuesToFilter(values, catalog, base, { mode })` : `newFilter(base, mode)` (copie
  profonde de `base` vidée de tout sauf ses fixes et défauts, ou filtre neuf en mode
  ET), puis pour chaque champ du catalogue, **dans l'ordre du catalogue** : virtuel →
  `field.toFilter(valeur, filtre, champ)` (appelé même sans valeur, pour retirer) ;
  plage (`widget` `*-range`, ou type date / monétaire / nombre avec `between` par
  défaut) → `setFilterRange` ; multiple (`widget: 'pills'`, select multiple) →
  `setFilterValues` (`eq` ou `in` selon `multiOperator`) ; texte →
  `replaceFilter(nom, [valeur], defaultOperator)` ; sinon `eq`. Une valeur vide ne crée
  rien.
- `filterToValues(filter, catalog)` : l'inverse ; une plage en `gte` donne `[de, '']`,
  en `ltwe` `['', à]` ; `empty` / `nempty` n'ont pas de valeur de formulaire ; les
  virtuels passent par `fromFilter`.
- `hasValue`, `isRangeField(field)`, `isMultiField(field)`, `newFilter(base, mode)`.

Pour le tiroir (étape 3) : `filterToCriteria(filter, catalog)` → `[{ id, name,
operator, values }]` pour chaque critère actif non fixe, non par défaut et hors groupe
(les virtuels regroupent leurs noms) ; `criteriaToFilter(rows, mode, catalog, base)` →
copie de `base` dont les critères éditables sont remplacés par les lignes (fixes, défauts
et groupes conservés) ; une ligne sans champ, sans valeur (hors `empty` / `nempty`) ou
sur un champ déjà pris est ignorée. `newCriterionId()`.

### `filterToSentence.js`

- `filterToFragments(filter, catalog, t, { withDefaults })` → un fragment par critère
  actif non fixe, dans l'ordre des critères du filtre : `{ name, label, operator,
  value, parts: [{ text, bold? }], text }`. Les champs virtuels regroupent leurs noms
  (`fromFilter` puis `toText`, qui rend une chaîne ou des `parts`) ; un nom hors
  catalogue donne « nom opérateur valeur ».
- `filterToSentenceParts(filter, catalog, t, { subject, withDefaults })` → les parties
  de la phrase complète, sujet en tête (`bold`, `subject: true`), ou `null` sans
  critère ; `filterToSentence(...)` → la chaîne.
- Règles : valeur par `field.format(valeur, champ)` sinon par type (`formatDate`
  jj/mm/aaaa, `formatAmount` « 12,5 € » avec `field.unit`, libellé d'option, oui / non) ;
  plusieurs valeurs « A, B ou C » ; `between` → « dont {label} est entre le {from} et
  le {to} » (dates) ou « … entre {from} et {to} » ; `empty` → « sans {label} »,
  `nempty` → « avec {label} » ; sinon « dont {label} {operatorPhrase} {value} » ;
  `label` = `phrase.label` sinon le libellé en minuscules ; `phrase[oper]` remplace le
  gabarit entier (jetons `{label}`, `{value}`, `{from}`, `{to}`). Les valeurs sont les
  parties en gras. Sujet = premier `subjectFor` qui répond (son critère sort de la
  phrase), sinon `subject`, sinon « Résultats ». Fragments séparés par des virgules ;
  en mode OU, « ou » avant le dernier. Point final.
- Les gabarits passent par `t` avec leurs jetons comme valeurs (un `formatMessage` les
  rend tels quels, `rbfIntl` les ignore) ; `renderTemplate(texte, vars)` est exporté.
- Fixtures de tests : les deux phrases des maquettes, mot pour mot.

### `natural.js` (étape 4)

Du catalogue vers le modèle de langage, et retour. Le modèle ne voit que des libellés
français ; il répond dans une **forme courte** `{ mode, c: [{ f, o, v }], unmatched }`
(chaque token de sortie coûte ~0,1 s sur le serveur sans GPU) ; la phrase en clair
n'est pas demandée, `filterToSentence` la produit.

- `fieldsForNatural(catalog)` : les champs proposés — ni `hidden`, ni `llm: false`, ni
  les pickers (sauf `llm: true`) ; deux libellés identiques → le premier seul.
  `naturalType(champ)` : `select` dès qu'il y a des options (le virtuel « Don »),
  sinon le type.
- `buildNaturalPrompt(catalog, { today, subject, examples, intro })` : le prompt
  système, **stable pour un catalogue donné** (Ollama garde son évaluation en cache
  et ne relit que la phrase) : une ligne par champ « libellé : type [choix] —
  description », les opérateurs par type, les règles (dates AAAA-MM-JJ avec la date du
  jour, montants en euros, « ne rien inventer, `unmatched` plutôt qu'un champ
  approchant »), puis les exemples de l'application. `naturalFieldLine`,
  `naturalExampleToText` (un exemple = `{ phrase, mode?, criteria: [{ name, operator,
  values }], unmatched? }`, valeurs écrites comme le modèle doit les rendre).
- `buildNaturalSchema(catalog)` : le schéma JSON imposé (`format` d'Ollama) — `f` dans
  un `enum` des libellés, `o` dans la matrice, `v` tableau de chaînes.
- `buildNaturalRequest(phrase, catalog, options)` → `{ system, phrase, user, format }` :
  ce que l'application envoie à son service ; le service choisit le modèle et ses
  options (`temperature` 0, `num_predict` 400, `keep_alive` long).
- `parseNaturalContent(réponse)` : objet, chaîne JSON ou clôture markdown ; lève une
  erreur sinon.
- `naturalToCriteria(brut, catalog, { t })` → `{ mode, criteria: [{ id, name,
  operator, values }], warnings, unmatched }`. Accepte aussi la forme pleine
  `{ criteria: [{ field, operator, values }] }` (par nom ou par libellé). Vérifie et
  dit, en français (`rbf.search.natural.*`), tout ce qui est corrigé ou ignoré : champ
  inconnu ; opérateur hors de la matrice du type (→ `eq` pour un choix, sinon
  l'opérateur par défaut — mais des mots avec un opérateur de texte sur une date ou
  un nombre, « Ami contient Kiki », c'est un mauvais champ : écarté en une ligne,
  comme un critère dont aucune valeur n'est une date ou un nombre ; et une comparaison
  sur un texte, « code postal entre 75000 et 75019 », est écartée en une ligne par
  champ — le prompt dit qu'un texte « commence par » ou « contient ») ; valeurs — option par `matchOption` (valeur, libellé sans
  accent ni casse, puis préfixe ou inclusion **uniques** : « Association » →
  « Association / Fondation »), booléen (oui/non/1/0), nombre (« 1 500,50 € »), date
  (ISO ou jj/mm/aaaa, calendrier vérifié), texte **présent dans la demande** quand
  elle est fournie (une ville ou un pays absents de la phrase ont été inventés :
  « en anglais » → « United Kingdom ») ; `between` sans deux bornes ; critère sans
  valeur. Puis un seul critère par champ : mêmes opérateurs → valeurs réunies ; une
  borne basse et une haute (date, nombre, montant) → `between` ; sinon le premier
  gagne. Texte : plusieurs valeurs seulement avec `eq` / `neq` (jointes par virgule
  comme les listes de choix), « contient A ou B » garde A. Mode `OR` ramené à `AND`
  s'il reste moins de deux critères.
- `naturalToResult(brut, catalog, { base, t })` → le `NaturalLanguageResult` :
  `filter` bâti par `criteriaToFilter` sur `base` (fixes, défauts et groupes — la
  recherche rapide — conservés, le reste remplacé), `mode`, `criteria`, `warnings`
  précédés de « Non compris : « … » » s'il y a des `unmatched`, `unmatched`.
- `createNaturalLanguage({ transport, catalog, base, examples, subject, intro, today,
  t })` fabrique le `onNaturalLanguage` d'une application : `transport(request,
  context)` rend ou promet la réponse du modèle (chaîne, objet ou `{ content }`) ;
  `catalog` et `base` peuvent être des fonctions ; sans `base`, `context.filter` sert
  de socle.
- Mesures (19/10/2026, `doc/recherche/feuille-de-route.md`) : qwen2.5:7b 10/10 sur dix
  demandes ; 3b et llama3.2:3b écartés.

## Composites — `src/features/search/`

### `SearchSummary`

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `filter` | `Filter`, req. | | |
| `catalog` | array, req. | | |
| `variant` | `'box'` \| `'inline'` | `'box'` | Encart (C) ou ligne du pied (A) |
| `title` | string | « En clair » | |
| `subject` | string | | |
| `emptyText` | string | « Aucun critère » | |
| `theme` | string | `'light'` | Fond clair, comme les encarts existants d'admin |

Rendu : `.rbf-search-summary.bg-{theme}.border.border-secondary-light`, titre en
petites capitales ; en `inline`, les fragments `bold` dans `<strong>`.

### `SearchForm`, `SearchFormSection`, `SearchFormField`, `SearchFormFooter` (écran A)

`SearchForm` (composant de classe) :

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `catalog` | array, req. | | |
| `sections` | `[{ name, label, fields?: [noms ou champs], render?: ctx => node, hint? }]`, req. | | |
| `values` / `defaultValues` | object | | Contrôlée (`values` + `onChange`) ou non |
| `onChange` | func | | `(values)` complètes |
| `onSubmit` | func, req. | | `(filter, values)` |
| `onClear` | func | | |
| `base` | `Filter` | | Ses fixes et défauts sont conservés (`defaultFilters()`) |
| `mode` | `'AND'` \| `'OR'` | `'AND'` | |
| `submitLabel`, `clearLabel` | string | « Rechercher », « Tout effacer » | |
| `subject`, `emptyText` | string | | Pour la phrase du pied |
| `withDefaults` | bool | `true` | `false` : les critères par défaut de `base` (ex. l'association courante) ne sont pas redits dans la phrase |
| `naturalLanguage` | `{ onNaturalLanguage?, comingSoon?, comingSoonMessage?, onComingSoon?, onError?, onResult?, placeholder, hint, sparkleIcon? }` | | La carte du haut ; absente si non fournie |
| `advancedLink` | `{ label?, onClick }` | | Lien « Critères avancés » en haut à droite (étape 3) |
| `icons` | `{ calendar, clear, check, sparkle }` | | |
| `title` | node | | |
| `showLabels` | bool | `false` | Libellés au-dessus des champs ; sinon le libellé sert de placeholder |
| `size`, `disabled`, `locale`, `className`, `t` | | | |

Comportement : `filter = valuesToFilter(values, catalog, base, { mode })` à chaque rendu ;
le pied affiche `SearchSummary variant="inline"` ; « Tout effacer » vide `values` ;
soumettre appelle `onSubmit(filter, values)`. À la réception d'un résultat
d'interprétation (`values`, `plain` via `Filter.fromPlain`, ou `filter`), les valeurs
sont fusionnées, l'indication devient « Les critères ci-dessous ont été remplis depuis
votre phrase. Vérifiez-les avant de lancer. », les `warnings` s'affichent en liste ;
rien n'est soumis. Le contexte passé au service : `{ catalog: catalogToJson(),
filter, locale }`.

Rendu : un `Container` de la bibliothèque (grille à requêtes de conteneur), un
`form`, l'en-tête (titre `h4` + lien), la carte de langage naturel, puis
`.rbf-search-form-body.border.rounded.bg-white` avec les sections et le pied.

`SearchFormSection` : `label` (req.), `hint`, `id`, `first` (pas de bordure haute),
et soit `children`, soit `catalog` + `fields` (noms résolus dans le catalogue, un
inconnu est écarté avec un avertissement) + `values` + `onChange` + `icons`. Rendu
un squelette en **flex pur** (`SearchForm.scss`) : colonne de libellés à largeur fixe
(10 rem, `.rbf-search-form-section-label-col`, empilée sous 576 px de fenêtre) en
petites capitales, puis `.rbf-search-form-section-content` qui prend le reste. Les
champs, eux, sont sur la grille de la bibliothèque (`Row` / `Col`), qui est par palier
de conteneur **sans cumul** : chaque colonne porte ses six tailles (`fieldSize(width)`
= 36 sous `sm`, la largeur du champ au-delà). Le libellé ne dépend donc d'aucune
détection de largeur. `role="group" aria-labelledby`.

Un champ à `newLine: true` commence une nouvelle ligne de la section (un `div.w-100`
Bootstrap est inséré devant lui) : sa largeur reste la sienne, sans l'étirer.

`SearchFormField` : `field`, `value`, `onChange` (`{ target: { name, value } }`),
`icons`, `showLabel`, `size`, `disabled`. Le composant vient de `widgetFor(field)` :
`field.widget`, sinon par type (`text` → `InputText` avec le libellé en placeholder,
`number` → `<input type=number>`, `monetary` → `InputAmountRange` si `between` par
défaut sinon `InputMonetary`, `date` / `datetime` → `InputDateRange` ou `InputDate`,
`bool` → `InputSegmented` Tous / oui / non, `select` → `InputPillGroup` si `multiple`
sinon `<select class=custom-select>`, `picker` → rien sans `field.render`, avec
avertissement). `field.render({ field, value, onChange, icons, t, widget })` remplace
tout. `widthFor(field)` : `field.width`, sinon pastilles 36, plage de dates 15, plage de
montants 12, segmenté et booléen `auto`, le reste 12 (un tiers).

`SearchFormFooter` : `summary`, `onClear`, `onSubmit` (sinon bouton `submit` du
formulaire), `submitLabel`, `clearLabel`, `disabled`. Barre `d-flex border-top
bg-light`, collante en bas du conteneur défilant (`SearchForm.scss`, la seule feuille
de la fiche, avec un peu d'espacement de lettres sur les libellés de section).

### `InputNaturalSearch` (écrans A et B)

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `name` | string | `'natural'` | |
| `value` / `defaultValue` | string | | |
| `placeholder` | string | | |
| `sparkleIcon` | element, req. | | |
| `kbdHint` | string \| false | « Entrée » (`rbf.search.natural.kbd`) | Indication clavier à droite, un `badge badge-light` Bootstrap |
| `variant` | `'bar'` \| `'card'` | `'bar'` | En-tête de liste ou carte de la fiche |
| `submitLabel` | string | « Remplir les critères » | Variante `card` |
| `hint` | node | | Sous le champ, variante `card` |
| `onNaturalLanguage` | func | | `(phrase, { ...context, phrase }) => Promise<Result>`, appelé immédiatement |
| `context` | object | `{}` | Ce que reçoit le service en plus de la phrase : `catalog` (`catalogToJson`), `filter`, `locale`… |
| `onChange` | func | | `{ target: { name, value } }` à chaque frappe ; `value` rend le champ contrôlé |
| `comingSoon` | bool | `!onNaturalLanguage` | |
| `comingSoonMessage` | string | « Recherche en langage naturel : en construction pour l'instant » | |
| `onComingSoon` | func | | Pour compter les essais, si l'application le souhaite |
| `pending` | bool | | Contrôlable, sinon interne |
| `showWarnings` | bool | `true` | Les `warnings` du résultat s'affichent sous le champ (liste `text-warning`) ; la fiche passe `false` et les montre elle-même |
| `onResult`, `onError` | func | | `(result, phrase)` / `(error, phrase)` ; en erreur, une notice s'affiche aussi |
| `onQuickSearch` | func | | `(texte, mode)` : repli sur la recherche rapide actuelle. Tant que `comingSoon`, **Entrée appelle `onQuickSearch`** et le bouton étincelle montre la notice |
| `size` | string | | |

Rendu : `form.rbf-natural-search > .input-group` : l'étincelle en préfixe
(`btn-outline-rbf bg-light text-secondary`, comme les boutons accolés des autres
champs de la bibliothèque ; elle lance l'interprétation ou montre la notice), le champ
`border-rbf form-control` (focus discret de la bibliothèque, pas le halo Bootstrap),
puis le badge « Entrée » ou `SmLoading3Dots` en attente ; sous le champ, la notice
`small.form-text.text-warning[role=status]` (effacée après 4 s), sinon pendant
l'attente « Analyse de la phrase en cours, quelques secondes… » (`text-muted`,
`rbf.search.natural.pending`), sinon la liste des `warnings` du dernier résultat,
effacée à la demande suivante. La
variante `card` enferme le tout dans un bloc `border rounded bg-white` avec le bouton
`btn-primary` « Remplir les critères », l'indication `hint` en dessous.
`InputNaturalSearch.scss` : deux règles, les boutons du groupe à `font-size: inherit`
(admin réduit la police des `.input-group` sous 1200 px, les `.btn` Bootstrap restent à
1 rem) et l'icône bornée à 1,25 em. Une phrase vide n'appelle pas le service.

Résultat attendu, figé dès l'étape 1 :

```ts
type NaturalLanguageResult = {
  filter?: Filter;        // ou
  plain?: PlainFilter;    // la forme de Filter.fromPlain, noms du catalogue (virtuels compris)
  values?: object;        // ou directement des valeurs de SearchForm
  mode?: 'AND' | 'OR';
  criteria?: [{ id, name, operator, values }];  // ce que natural.js a retenu
  warnings?: string[];    // en français : non compris, corrigé, ignoré
  unmatched?: string[];   // les morceaux de phrase non compris, bruts
  explanation?: string;   // une ligne, affichée sous l'indication (facultative)
};
```

`createNaturalLanguage` (natural.js) le produit avec `filter`, `mode`, `criteria`,
`warnings` et `unmatched` ; la fiche ajoute un avertissement quand le mode est `OR`
(elle combine toujours avec « et »).

### `FacetPopover` (écran B)

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `field` | objet du catalogue, req. | | `facet.kind` `'options'` (défaut) ou `'range'` |
| `value` | array \| `[from, to]` | `[]` | |
| `onApply` | func, req. | | `(value)` |
| `onClose` | func, req. | | |
| `myRef` | ref, req. | | La pastille ancre |
| `align` | string | `'bottom-left'` | |
| `maxHeight` | number | `360` | Transmis au `Dropdown` ; la liste défile elle-même à 15 rem |
| `width` | string | `'18rem'` | |
| `searchable` | bool | automatique à partir de `searchFrom` (8) options | Champ « Filtrer… », insensible aux accents |
| `showCounts` | bool | `false` | `option.count` entre parenthèses |
| `icons` | `{ calendar, clear }` | | Pour la plage de dates |

Rendu : le `Dropdown` existant, utilisé directement (il place, retourne, se ferme au
clic extérieur). Contenu `.rbf-facet-popover-body[role=dialog]` : champ de filtre
(focus à l'ouverture), liste `custom-checkbox` Bootstrap (libellés cliquables), pied
avec le compteur (`field.facet.countLabel(n)` ou « {n} sélectionnée(s) ») et
« Appliquer ». Rien n'est émis avant « Appliquer » ou Entrée ; Échap ferme sans
appliquer. `multiple: false` → un seul choix. Variante `range` : `InputDateRange`, ou
`InputAmountRange` pour un montant ou un nombre. `FacetPopover.scss` : une règle (la
liste défile).

### `SearchChipBar` (écran B)

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `filter` | `Filter`, req. | | Lu, jamais modifié |
| `catalog` | array, req. | | |
| `onChange` | func, req. | | `(nouveauFilter)` |
| `facets` | `[names]` | champs à `facet`, triés par `facet.order` | |
| `onAddCriterion` | func | | Affiche « + Critère » (étape 3 : ouvre le tiroir) |
| `onClearAll` | func | | Appelé après « Tout effacer » |
| `showDefaults` | bool | `false` | Montrer aussi les critères par défaut |
| `quickGroup` | string | `'quick'` | Le groupe de la recherche rapide, rendu en une seule pastille « Recherche : … » |
| `icons` | `{ close, caret, add, calendar, clear }` | | |
| `className` | string | | |

Comportement : `filter.getFilters({ fixed: false })` → une pastille `active` par
critère dont le champ n'est pas une facette (« Ville : Metz », « Paiement : 01/01/2025 –
31/12/2025 », « E-mail : vide », virtuel via `toText`) ; les champs à facette sont
représentés par leur pastille de facette, avec le compteur de valeurs choisies ; le
groupe `quickGroup` donne une seule pastille. × → `clone()` + `removeFilter` (ou
`virtual.toFilter('')`, ou `removeGroup`) → `onChange`. Une facette ouvre son
`FacetPopover` ancré sur la pastille ; « Appliquer » → `setFilterValues` (`eq`, ou `in`
si `multiOperator: 'in'`) ou `setFilterRange`. « Tout effacer » → `removeAll()` (les
fixes et défauts restent), masqué quand le filtre est vide. Rendu `.rbf-chip-bar` en
`d-flex flex-wrap`, classes Bootstrap seulement.

### `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer` (écran C)

`SearchCriteriaRow` : `catalog` (req.), `criterion: { id, name, operator, values }`
(req.), `usedNames` (champs déjà pris, grisés dans le select), `onChange(criterion)`,
`onRemove(id)`, `icons: { remove, calendar, clear, check }`, `size` (`'sm'`),
`disabled`. Quatre cellules en flex (`SearchCriteriaRow.scss` : champ 11 rem,
opérateur 10 rem, la valeur prend le reste, passage à la ligne si la place manque) :
select de champ natif (`fieldsForRows`), select d'opérateur natif
(`getFieldOperators` ; virtuel → « est » figé), zone de valeur, bouton ×. La zone de
valeur est un `SearchFormField` dont le `widget` vient de `widgetForOperator(field,
oper)` : `between` → plage du type, select multiple avec `eq` / `neq` / `in` / `nin` →
pastilles, select simple → select, booléen → segmenté, date → `InputDate`, montant →
`InputMonetary`, nombre → `<input type=number>`, virtuel → son widget, sinon texte ;
`empty` / `nempty` → « pas de valeur à saisir ». Les zones larges (pastilles, plages) prennent toute une ligne sous le champ et
l'opérateur, le × restant en haut à droite ; les autres tiennent sur la ligne. Choisir un
champ pose son opérateur par défaut et vide la valeur ; changer d'opérateur garde la
valeur si sa forme ne change pas.

`SearchCriteriaBuilder` : `catalog`, `rows`, `mode`, `onRowsChange`, `onModeChange`,
`modeToggle` (`true`), `subject` (« les donateurs »), `maxRows`, `icons`, `size`. Sans
état. Phrase d'introduction + `InputSegmented` [tous les critères | au moins un], une
`SearchCriteriaRow` par ligne, « Aucun critère : tous les résultats. » sinon, `Chip
variant="add"` « + Ajouter un critère » (désactivée quand tous les champs sont pris).

`SearchCriteriaPanel` : le panneau lui-même, sans contenant — constructeur, encart,
« Tout effacer » / « Appliquer » en pied collant. Props : `filter` (req.), `catalog`
(req.), `onApply(filter)` (req.), `onClearAll`, `title` (node, rendu en `h5`),
`subject`, `sentenceSubject`, `showSummary`, `modeToggle`, `maxRows`, `icons`, `size`,
`className`, `t`. Les lignes sont dérivées du filtre au montage puis **chaque fois que
`filter` change d'identité** (un nouveau `Filter` posé par la liste), jamais sur un simple
re-rendu : le brouillon tient. C'est lui qu'admin pose dans le panneau droit de la page.

`SearchDrawer` : le même panneau dans un `Drawer` superposé (le tiroir démonte son
contenu quand il est fermé, donc relecture à chaque ouverture) :

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `open`, `onClose` | req. | | |
| `filter` | `Filter`, req. | | |
| `catalog` | array, req. | | |
| `onApply` | func, req. | | `(filter)` |
| `onClearAll` | func | | Après « Tout effacer » |
| `title` | string | « Critères avancés » | |
| `subject` | string | | Pour l'introduction (« les donateurs ») |
| `sentenceSubject` | string | | Pour l'encart (« Donateurs ») |
| `width`, `expandedWidth`, `storageKey`, `top` | | `560`, `'85vw'`, —, `0` | Transmis à `Drawer` |
| `showSummary`, `modeToggle` | bool | `true` | |
| `maxRows` | number | | |
| `icons` | `{ close, expand, collapse, add, remove, calendar, clear, check }` | | |

Comportement : à l'ouverture (transition `open` faux → vrai, et seulement là), `rows =
filterToCriteria(filter, catalog)` et `mode = filter.getMode()` ; un re-rendu du parent
n'écrase pas le brouillon. L'encart EN CLAIR est recalculé sur `criteriaToFilter(rows,
mode, catalog, filter)` ; « Appliquer » le remet par `onApply` : les critères fixes, par
défaut et le groupe de recherche rapide sont conservés, le reste remplacé par les lignes.
« Tout effacer » vide les lignes.

## Emplacement d'en-tête de liste

Props additives sur `ResponsiveList` (transmises à `DefaultList` / `DefaultHeader` et à
`MobileList` / `MobileHeader`), comportement par défaut inchangé.

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `toolbar` | node | | La rangée d'outils sous la ligne de titre (la `SearchChipBar`) |
| `toolbarHeight` | number | `44` | Hauteur de la rangée ; l'en-tête passe de 50 à 50 + `toolbarHeight` px et le corps de liste se décale d'autant |
| `toolbarOpen` | bool | `null` | Contrôlé par l'application si fourni ; sinon la liste mémorise l'état elle-même |
| `toolbarDefaultOpen` | bool | `false` | **Repliée par défaut** : l'utilisateur la découvre par son bouton |
| `toolbarStorageKey` | string | | Clé de mémorisation (`localStorage`, `rbf.list.toolbar.<clé>`), une par liste ; silencieux sans stockage |
| `onToolbarToggle` | func | | `(open)` à chaque bascule |
| `toolbarIcon` | element | | L'icône du bouton d'affichage, dans la barre d'actions à gauche du bouton filtre |
| `toolbarCount` | number | calculé | Le badge du bouton quand la rangée est repliée : `filters.getFilters({ fixed: false }).length` sinon |
| `globalActions[].text` | string | | Un libellé après l'icône (« + Donateur ») |

Le bouton porte `aria-expanded` et son titre (« Afficher / Masquer les critères »,
`rbf.list.header.toolbar.*`). La rangée reprend un interligne normal (l'en-tête impose
50 px à sa ligne de titre) ; pour y tenir sur une ligne, la `SearchChipBar` reçoit
`wrap={false}` (défilement horizontal, pas de marge basse). `DefaultHeader` : `sort`
vaut désormais `[]` par défaut (`sortToText` itère dessus). Mobile : même emplacement,
même bouton, même mémorisation.

## Panneau droit de la page à largeur réglable

Props additives sur `ResponsivePage` / `DefaultPage`, comportement par défaut inchangé
(400 px) :

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `rightPanelWidth` | number | `null` | Contrôlée par l'application si fournie |
| `rightPanelDefaultWidth` | number | `400` | |
| `rightPanelMinWidth` | number | `320` | Largeur minimale du panneau |
| `contentMinWidth` | number | `480` | Largeur minimale garantie au contenu : la borne haute vaut fenêtre − menu latéral − `contentMinWidth` |
| `rightPanelStorageKey` | string | | Mémorisation de la largeur (`localStorage`, `rbf.page.rightPanel.<clé>.width`) |
| `onRightPanelResize` | func | | `(width)` à la fin d'un glissement ou d'un réglage clavier |

Panneau ouvert, une poignée `.rbf-page-right-resizer` (`role="separator"`, 6 px sur le
bord gauche) se tire à la souris ou au doigt — vers la gauche pour élargir — et se
règle aux flèches ← → (16 px, 64 avec Maj). Pendant le glissement, les transitions sont
coupées pour suivre le pointeur. Les positions du panneau replié (barre d'icônes de
60 px) et du contenu sont recalculées de la largeur courante. Le mode ouvert / replié
reste celui de `rightPanelOpened`.

## Contrat du catalogue

```js
{
  name: 'donations.payment_type.ptyp_id',   // nom du Filter = filterable.col || col.col
  label: 'Moyen de paiement',
  type: 'select',
  defaultOperator: 'eq',          // text → contains, select → eq, date / monetary → between, bool → eq
  operators: undefined,           // sous-ensemble facultatif de la matrice du type
  options: paymentTypeAsOptions(props.paymentType.items),
  multiple: true,
  multiOperator: 'eq',            // 'eq' = valeurs jointes par virgule (ce que l'API lit déjà) ; 'in' sinon
  format: undefined,              // valeur → texte ; défaut par type
  phrase: { eq: 'par {value}' },  // fragments de phrase par opérateur
  facet: { order: 10, kind: 'options', searchable: true, countLabel: n => `${n} moyens` },
  section: 'moyen', widget: 'pills',
  newLine: false,                 // true : commence une nouvelle ligne dans sa section, largeur inchangée
  picker: undefined,              // type picker : { onSearch, display }
  hidden: false,                  // jamais proposé dans « + Ajouter un critère » ni le formulaire, mais affiché en pastille
  description: 'date du dernier paiement reçu',  // pour le modèle de langage seulement (étape 4) ; `hint` reste l'aide affichée
  llm: undefined,                 // false : jamais proposé au modèle ; true : un picker malgré tout
  subjectFor: undefined,          // values => 'Particuliers' | null
}
```

Champ virtuel, défini par l'application (exemple complet, côté admin dans
`client/searchCatalog.js`) :

```js
{
  name: 'don_kind', virtual: true, label: 'Don', section: 'paiement', widget: 'segmented',
  options: [{ value: '', label: 'Tous' }, { value: 'regular', label: 'Régulier' }, { value: 'once', label: 'Ponctuel' }],
  fields: ['donations.sponsorship.spo_id'],
  toFilter: (v, f) => {
    f.removeFilter('donations.sponsorship.spo_id');
    if (v === 'regular') f.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_NOT_EMPTY);
    if (v === 'once') f.addFilter('donations.sponsorship.spo_id', null, FILTER_OPER_EMPTY);
  },
  fromFilter: f => {
    const e = f.findFirst('donations.sponsorship.spo_id');
    return !e ? '' : e.getOperator() === FILTER_OPER_NOT_EMPTY ? 'regular' : 'once';
  },
  toText: v => (v === 'regular' ? 'donateurs réguliers' : v === 'once' ? 'donateurs ponctuels' : ''),
}
```

Les catégories (« Aucune cochée = toutes ») n'ont pas besoin de champ virtuel :
`client_category.clic_id`, `widget: 'pills'`, tableau vide = aucun critère, sinon
`setFilterValues(name, values, 'eq')`.

Usage par écran : formulaire = `sections[].fields` ; facettes = `fieldsForFacets` ;
lignes = `fieldsForRows` ; phrase = tout.

## Exports à ajouter dans `src/index.js`

```js
export { default as Drawer } from './features/advanced/Drawer';
export { default as Chip } from './features/basic/Chip';
export { default as InputSegmented } from './features/basic/InputSegmented';
export { default as InputDateRange } from './features/basic/InputDateRange';
export { default as InputAmountRange } from './features/basic/InputAmountRange';
export { default as InputNumberRange } from './features/basic/InputNumberRange';
export { default as InputPillGroup } from './features/basic/InputPillGroup';
export * from './features/search/index.js';
```

`search/index.js` ré-exporte `SearchForm`, `SearchFormSection`, `SearchFormField`,
`SearchFormFooter`, `SearchSummary`, `InputNaturalSearch`, `FacetPopover`,
`SearchChipBar`, `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer`, et les
fonctions `catalogFromCols`, `normalizeCatalog`, `catalogToJson`,
`getOperatorsForType`, `getFieldOperators`, `filterToSentence`, `filterToFragments`,
`filterToCriteria`, `criteriaToFilter`, `valuesToFilter`, `filterToValues`.

Chaque feature ajoute ses imports dans son `style.scss` ; `search/style.scss` est
ajouté à `src/styles/index.scss`.

## Clés de traduction

Dans `src/features/intl/fr.js`, à la suite des 37 clés existantes :
`rbf.search.summary.title`, `rbf.search.summary.empty`, `rbf.search.natural.kbd`,
`rbf.search.natural.comingSoon`, `rbf.search.natural.submit`,
`rbf.search.natural.filledHint`, `rbf.search.facet.filter`,
`rbf.search.facet.count`, `rbf.search.facet.apply`, `rbf.search.chip.remove`,
`rbf.search.chip.add`, `rbf.search.clearAll`, `rbf.search.drawer.title`,
`rbf.search.drawer.intro`, `rbf.search.drawer.modeAll`, `rbf.search.drawer.modeAny`,
`rbf.search.drawer.apply`, `rbf.search.row.noValue`, `rbf.search.row.valuePlaceholder`,
`rbf.range.from` / `.to` / `.min` / `.max` (plages), `rbf.search.form.submit`,
`rbf.search.form.noneChecked`, et `rbf.filter.oper.<opérateur>` (avec les variantes
`.date` pour « Postérieur à » / « Antérieur à »).
Étape 4 : `rbf.search.natural.pending`, `.unmatched`, `.unknownField`,
`.operatorReplaced`, `.unknownValue`, `.notInPhrase`, `.notA`, `.textCompare`, `.badRange`, `.noValue`, `.duplicate`,
`.singleValue`, `.orMode` (jetons `{label}`, `{field}`, `{value}`, `{from}`, `{to}`,
`{items}`).

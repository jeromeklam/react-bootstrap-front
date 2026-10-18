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
| `FacetPopover`, `SearchChipBar` | 2 | proposé, à valider |
| Emplacement `toolbar` de l'en-tête, `InputNaturalSearch` (variante `bar`) | 2 | proposé, à valider |
| `Drawer`, `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer` | 3 | proposé, à valider |
| `InputNumberRange` | 3 | optionnel, à valider |

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

Tiroir latéral dans un `Portal`.

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `open` | bool, req. | | Ouvert ou fermé |
| `onClose` | func, req. | | Croix, Échap, clic sur le fond |
| `side` | `'right'` \| `'left'` | `'right'` | |
| `width` | number \| string | `560` | |
| `top` | number | `0` | Décalage sous l'en-tête de l'application (60 sur bureau, 40 sur mobile). La bibliothèque ne devine pas la hauteur de l'en-tête. |
| `backdrop` | bool | `true` | Fond assombri |
| `closeOnBackdrop`, `closeOnEscape` | bool | `true` | |
| `title` | node | | |
| `closeIcon` | element | | |
| `footer` | node | | Barre de pied |
| `children` | node | | Corps, défilant |
| `className` | string | | |

Rendu : `.rbf-drawer-backdrop` + `.rbf-drawer` (`position: fixed; top; bottom: 0;
width`), `CSSTransition` 300 ms en translation ; en-tête `.rbf-drawer-header`, corps
`.rbf-drawer-body.custom-scrollbar`, pied `.rbf-drawer-footer`. `role="dialog"
aria-modal="true" aria-labelledby`. Le focus passe au panneau à l'ouverture et revient
à l'élément d'origine à la fermeture. Pas de blocage du défilement : `look2.scss` pose
déjà `overflow: hidden` sur `html, body`. Pleine largeur sous 768 px.

Test de montage : `tests/features/advanced/Drawer.test.js`, après
`jest.unmock('react-dom')`.

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
| `addFilter` | septième paramètre `group = ''` | 2 |
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
operator, values }]`, et `criteriaToFilter(rows, mode, catalog, base)` ; les lignes sans
valeur (hors `empty` / `nempty`) sont ignorées, un champ en double est refusé.

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
`Row` → libellé `Col size={{ xxs: 36, md: 6 }}` en petites capitales
`.rbf-search-form-section-label`, contenu `Col size={{ xxs: 36, md: 30 }}` où chaque
champ occupe `Col size={{ xxs: 36, md: widthFor(field) }}` ; `role="group"
aria-labelledby`.

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
| `onResult`, `onError` | func | | `(result, phrase)` / `(error, phrase)` ; en erreur, une notice s'affiche aussi |
| `onQuickSearch` | func | | `(texte, mode)` : repli sur la recherche rapide actuelle. Tant que `comingSoon`, **Entrée appelle `onQuickSearch`** et le bouton étincelle montre la notice |
| `size` | string | | |

Rendu : `form.rbf-natural-search > .input-group` : l'étincelle en préfixe
(`btn-outline-rbf bg-light text-secondary`, comme les boutons accolés des autres
champs de la bibliothèque ; elle lance l'interprétation ou montre la notice), le champ
`border-rbf form-control` (focus discret de la bibliothèque, pas le halo Bootstrap),
puis le badge « Entrée » ou `SmLoading3Dots` en attente ; notice
`small.form-text.text-warning[role=status]` sous le champ, effacée après 4 s. La
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
  warnings?: string[];    // morceaux de phrase non compris
  explanation?: string;   // une ligne, affichée sous l'indication
};
```

### `FacetPopover` (écran B)

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `field` | objet du catalogue, req. | | `facet.kind` `'options'` (défaut) ou `'range'` |
| `value` | array \| `[from, to]` | | |
| `onApply` | func, req. | | `(value)` |
| `onClose` | func, req. | | |
| `myRef` | ref, req. | | La pastille ancre |
| `align` | string | `'bottom-left'` | |
| `maxHeight` | number | `360` | |
| `searchable` | bool | automatique au-delà de 7 options | Champ « Filtrer... » |
| `showCounts` | bool | `false` | |
| `icons` | `{ check, calendar, clear }` | | |

Rendu : le `Dropdown` existant, utilisé directement avec un état d'ouverture propre
(pas `DropdownWrapper`, dont `autoClose` ferme à tout clic ; s'il est préféré, passer
`autoClose={false}`). Contenu `.rbf-facet-popover[role=dialog]` : champ de filtre
(focus à l'ouverture), liste `.custom-scrollbar` de `custom-control custom-checkbox`
Bootstrap (libellés cliquables, contrairement à `SvgCheckbox`), pied avec le compteur
(`field.facet.countLabel(n)` ou « {n} valeurs ») et le bouton « Appliquer ». Entrée
dans le champ = Appliquer, Échap = fermer sans appliquer. Variante `range` :
`InputDateRange` ou `InputAmountRange` + Appliquer. Sur mobile `calc(100vw - 16px)`.

### `SearchChipBar` (écran B)

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `filter` | `Filter`, req. | | Lu, jamais modifié |
| `catalog` | array, req. | | |
| `onChange` | func, req. | | `(nouveauFilter)` |
| `facets` | `[names]` | champs à `facet`, triés | |
| `onAddCriterion` | func | | Affiche « + Critère » (étape 3 : ouvre le tiroir) |
| `onClearAll` | func | | |
| `showDefaults` | bool | `false` | Montrer aussi les critères par défaut |
| `icons` | `{ close, caret, add, check, calendar, clear }` | | |
| `className` | string | | |

Comportement : `filter.getFilters({ fixed: false })` → une pastille `active` par
critère (le champ virtuel propriétaire d'abord, puis le champ réel) ; × →
`f = filter.clone(); f.removeFilter(name)` (ou `virtual.toFilter('', f)`) →
`onChange(f)` ; facette appliquée → `f.setFilterValues(...)` ou `f.setFilterRange(...)` ;
« Tout effacer » → `f.removeAll()` ; le groupe de recherche rapide (`group: 'quick'`)
apparaît comme une seule pastille « Recherche : … ». Rendu `.rbf-chip-bar` en
`flex-wrap` ; défilement horizontal sur une ligne sous `container-xs`.

### `SearchCriteriaRow`, `SearchCriteriaBuilder`, `SearchDrawer` (écran C)

`SearchCriteriaRow` : `catalog` (req.), `criterion: { id, name, operator, values }`
(req.), `usedNames` (champs déjà pris, grisés), `onChange(criterion)`,
`onRemove(id)`, `icons: { remove, calendar, clear }`, `autoFocus`. Quatre cellules :
select de champ, select d'opérateur (`getFieldOperators`), zone de valeur, bouton ×.
Zone de valeur selon l'opérateur et le type : `empty` / `nempty` → « pas de valeur à
saisir » en gris ; `between` → plage du type ; `text` → `<input>` « Valeur » ;
`number` → `<input type=number>` ; `date` → `InputDate` ; `datetime` → `InputDatetime` ;
`monetary` → `InputMonetary allowNull` ; `select` → select, ou `InputPillGroup` si
`field.multiple` et opérateur `eq` / `neq` / `in` / `nin` ; `bool` → `InputSegmented`
Oui / Non ; `picker` → `InputAutocomplete` existant ; champ virtuel → son `widget`,
opérateur « est » figé.

`SearchCriteriaBuilder` : `catalog`, `rows`, `mode`, `onRowsChange`, `onModeChange`,
`maxRows`, `icons`. Phrase d'introduction + `InputSegmented` [tous les critères | au
moins un], lignes, `Chip variant="add"` « + Ajouter un critère » (désactivée quand
tous les champs sont pris).

`SearchDrawer` :

| Prop | Type | Défaut | Rôle |
|---|---|---|---|
| `open`, `onClose` | req. | | |
| `filter` | `Filter`, req. | | |
| `catalog` | array, req. | | |
| `onApply` | func, req. | | `(filter)` |
| `onClearAll` | func | | |
| `title` | string | « Critères avancés » | |
| `width`, `top` | | `560`, `0` | Transmis à `Drawer` |
| `showSummary`, `modeToggle` | bool | `true` | |
| `icons` | `{ close, add, remove, calendar, clear }` | | |

Comportement : à l'ouverture (transition `open` faux → vrai, et seulement là, pour
éviter l'écueil de `DefaultPanel`), `rows = filterToCriteria(filter, catalog)` et
`mode = filter.getMode()`. L'encart EN CLAIR est recalculé en direct sur un
`criteriaToFilter` jetable. « Appliquer » → `onApply(criteriaToFilter(rows, mode,
catalog, filter))`. « Tout effacer » vide les lignes.

## Emplacement d'en-tête de liste

Props additives, comportement par défaut inchangé.

- `list/DefaultHeader.jsx` : `toolbar` (node) et `toolbarHeight` (number, 44). Si
  `toolbar` est fourni, la barre absolue passe de 50 à `50 + toolbarHeight` px et une
  seconde rangée `.rbf-list-header-toolbar` est rendue sous la `Row` actuelle.
  `globalActions[].text` (string) affiché après l'icône.
- `list/DefaultList.jsx` : `listStyle.top` et `height` calculés avec la même hauteur,
  comme le fait déjà `titleMultiline` (L314-327).
- `list/MobileHeader.jsx`, `MobileList.jsx` : même emplacement, seconde rangée fixe,
  `datastyle.top` ajusté.
- `ResponsiveList` transmet déjà toutes les props.

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

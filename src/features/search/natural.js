import {
  FILTER_MODE_AND,
  FILTER_MODE_OR,
  FILTER_OPER_LIKE,
  FILTER_OPER_START_WITH,
  FILTER_OPER_END_WITH,
  FILTER_OPER_SOUND_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_BETWEEN,
  FILTER_OPER_GREATER,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_LOWER,
  FILTER_OPER_LOWER_OR_EQUAL,
} from '../filter';
import { OPERATORS_BY_TYPE, needsValue, operatorLabel } from './operators';
import { criteriaToFilter, newCriterionId } from './criteria';
import { tr, warnOnce } from './i18n';

/**
 * La recherche en langage naturel : du catalogue vers le prompt et le schéma JSON
 * imposé au modèle, puis de sa réponse vers des critères vérifiés et un Filter.
 *
 * Le modèle ne voit que des libellés français : « Catégorie », jamais
 * `client_category.clic_id`. Il répond { mode, c: [{ f, o, v }], unmatched } —
 * forme courte parce que chaque token de sortie coûte ~0,1 s sur un serveur sans
 * GPU (banc du 19/10/2026, doc/recherche/feuille-de-route.md). La phrase en clair
 * n'est pas demandée au modèle : filterToSentence la produit.
 *
 * Tout ce qui revient est vérifié ici (champ, opérateur, valeurs, doublons) ; ce qui
 * est corrigé ou ignoré est dit en français dans `warnings`, et ce que le modèle n'a
 * pas su traduire arrive dans `unmatched`. Rien n'est inventé à sa place — et ce
 * qu'il a inventé (une valeur texte absente de la demande) est écarté.
 */
const ORDERED_TYPES = ['number', 'monetary', 'date', 'datetime'];
const KIND_OF = { date: 'une date', datetime: 'une date', number: 'un nombre', monetary: 'un montant' };
const LOW_OPERS = [FILTER_OPER_GREATER, FILTER_OPER_GREATER_OR_EQUAL];
const HIGH_OPERS = [FILTER_OPER_LOWER, FILTER_OPER_LOWER_OR_EQUAL];
const COMPARE_OPERS = LOW_OPERS.concat(HIGH_OPERS, [FILTER_OPER_BETWEEN]);
/* Plusieurs valeurs jointes par une virgule : l'API en fait un OU pour ces opérateurs
   (FreeFW Conditions) ; « ne contient pas » ou « différent » n'ont de sens qu'à une. */
const TEXT_MULTI_OPERS = [FILTER_OPER_LIKE, FILTER_OPER_START_WITH, FILTER_OPER_END_WITH, FILTER_OPER_SOUND_LIKE, FILTER_OPER_EQUAL];

export const NATURAL_OPERATORS = Object.keys(OPERATORS_BY_TYPE).reduce((acc, type) => {
  OPERATORS_BY_TYPE[type].forEach(oper => {
    if (!acc.includes(oper)) {
      acc.push(oper);
    }
  });
  return acc;
}, []);

/* Le type sous lequel le modèle voit un champ : à choix dès qu'il a des options
   (le virtuel « Don » est typé text), texte pour un picker autorisé. */
export const naturalType = field => {
  if (field.options && field.options.length > 0) {
    return 'select';
  }
  return field.type === 'picker' ? 'text' : field.type;
};

/* Les champs proposés au modèle : ni cachés, ni `llm: false`, ni les pickers
   (leurs valeurs sont des identifiants que le modèle ne connaît pas) — sauf `llm: true`,
   qui l'emporte (« Langue », cachée dans la fiche mais utile à « en anglais »).
   Deux libellés identiques se gêneraient dans le schéma : le premier gagne. */
export const fieldsForNatural = (catalog = []) => {
  const labels = new Set();
  return catalog.filter(field => {
    if (field.llm === false || ((field.hidden || field.type === 'picker') && field.llm !== true)) {
      return false;
    }
    const label = String(field.label);
    if (labels.has(label)) {
      warnOnce(`libellé « ${label} » porté par deux champs : seul le premier est proposé au langage naturel`);
      return false;
    }
    labels.add(label);
    return true;
  });
};

const isoDate = value => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
};

export const naturalFieldLine = field => {
  let line = `- ${field.label} : ${naturalType(field)}`;
  if (field.options && field.options.length > 0) {
    line += ' [' + field.options.map(option => String(option.label)).join(' | ') + ']';
  }
  if (field.description) {
    line += ` — ${field.description}`;
  }
  return line;
};

/* Un exemple fourni par l'application : { phrase, mode?, criteria: [{ name, operator,
   values }], unmatched? }. Les valeurs sont écrites comme le modèle doit les rendre
   (libellés des choix, dates AAAA-MM-JJ). */
export const naturalExampleToText = (example, catalog) => {
  const c = (example.criteria || [])
    .map(crit => {
      const field = catalog.find(f => f.name === crit.name);
      if (!field) {
        warnOnce(`exemple de langage naturel sur un champ inconnu « ${crit.name} », ignoré`);
        return null;
      }
      const values = Array.isArray(crit.values) ? crit.values : [crit.values];
      /* Une valeur d'option (son identifiant) s'écrit par son libellé, comme le modèle doit la rendre. */
      const asText = value => {
        const option = (field.options || []).find(o => String(o.value) === String(value));
        return option ? String(option.label) : String(value);
      };
      return { f: field.label, o: crit.operator, v: values.filter(v => v !== null && typeof v !== 'undefined').map(asText) };
    })
    .filter(Boolean);
  const answer = { mode: example.mode === FILTER_MODE_OR ? FILTER_MODE_OR : FILTER_MODE_AND, c, unmatched: example.unmatched || [] };
  return `Demande : « ${example.phrase} »\n${JSON.stringify(answer)}`;
};

/**
 * Le prompt système. Stable d'une demande à l'autre pour un même catalogue : Ollama
 * garde son évaluation en cache et ne relit que la phrase. `vocabulary` : les mots
 * du métier expliqués par les utilisateurs eux-mêmes, [{ term, meaning }] — « banlieue »
 * : les départements 77, 78, 91… — que le modèle applique comme une règle de plus.
 */
export const buildNaturalPrompt = (catalog, { today = null, subject = null, examples = [], vocabulary = [], intro = null } = {}) => {
  const fields = fieldsForNatural(catalog);
  const lines = fields.map(naturalFieldLine).join('\n');
  const what = subject || 'une liste';
  const head =
    intro ||
    `Tu convertis une demande écrite en français en critères de recherche sur ${what}. Tu réponds uniquement par le JSON demandé : {"mode":…,"c":[{"f":champ,"o":opérateur,"v":[valeurs]}],"unmatched":[…]}.`;
  const parts = [
    head,
    '',
    'CHAMPS DISPONIBLES (champ : type [choix possibles]) :',
    lines,
    '',
    'OPÉRATEURS SELON LE TYPE DU CHAMP :',
    '- text : contains (contient), ncontains (ne contient pas), containsb (commence par), containse (finit par), eq (égal), neq (différent), empty (vide), nempty (renseigné)',
    "- date, monetary, number : eq, neq, gt (après / plus de), gte (à partir de / au moins), ltw (avant / moins de), ltwe (jusqu'à / au plus), between (deux valeurs : début puis fin), empty, nempty",
    '- select, bool : eq, neq, empty, nempty',
    '',
    'RÈGLES :',
    '- "f" est toujours un champ de la liste ci-dessus, écrit exactement comme dans la liste.',
    '- Champ select : "v" contient les libellés des choix, écrits exactement comme dans la liste. Plusieurs choix acceptés pour un même champ → plusieurs valeurs dans "v" avec l\'opérateur eq.',
    '- Champ bool : "v" vaut ["1"] pour oui, ["0"] pour non.',
    `- Dates au format AAAA-MM-JJ. Aujourd'hui : ${isoDate(today)}. Une année seule → between du 1er janvier au 31 décembre. « depuis N mois / plus de N ans » → calcule la date à partir d'aujourd'hui.`,
    '- Montants en euros, nombres sans symbole ni espace.',
    '- Un champ text ne se compare pas (jamais gt, gte, ltw, ltwe ni between dessus) : « contient » ou « commence par », avec une ou plusieurs valeurs dans "v" (plusieurs = l\'une ou l\'autre : "commence par" ["77","78"]).',
    '- "mode" vaut "AND" (tous les critères, cas normal) ou "OR" si la demande oppose des critères portant sur des champs différents par « ou ».',
    '- N\'invente aucun critère. Ce que la demande dit et que tu ne peux pas traduire avec ces champs va dans "unmatched" (les mots concernés, en français), pas dans "c" : une langue, une nationalité, un âge, un métier… ne se remplacent pas par un pays ni par un autre champ approchant.',
  ];
  const words = (vocabulary || []).filter(entry => entry && entry.term && entry.meaning);
  if (words.length > 0) {
    parts.push('', 'VOCABULAIRE (ce que ces mots veulent dire ici) :');
    words.forEach(entry => parts.push(`- « ${String(entry.term).trim()} » : ${String(entry.meaning).trim()}`));
  }
  /* Un mot du vocabulaire dont les critères sont connus devient aussi un exemple :
     c'est ce que les petits modèles suivent le mieux. */
  const learned = words
    .filter(entry => Array.isArray(entry.criteria) && entry.criteria.length > 0)
    .map(entry => ({ phrase: entry.term, mode: entry.mode, criteria: entry.criteria, unmatched: [] }));
  const shown = (examples || []).concat(learned);
  if (shown.length > 0) {
    parts.push('', 'EXEMPLES :');
    shown.forEach(example => parts.push(naturalExampleToText(example, catalog)));
  }
  return parts.join('\n');
};

/* Le schéma JSON imposé au modèle (`format` d'Ollama) : le champ est un enum des
   libellés, l'opérateur un enum de la matrice. */
export const buildNaturalSchema = catalog => ({
  type: 'object',
  properties: {
    mode: { type: 'string', enum: [FILTER_MODE_AND, FILTER_MODE_OR] },
    c: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          f: { type: 'string', enum: fieldsForNatural(catalog).map(field => String(field.label)) },
          o: { type: 'string', enum: NATURAL_OPERATORS },
          v: { type: 'array', items: { type: 'string' } },
        },
        required: ['f', 'o', 'v'],
      },
    },
    unmatched: { type: 'array', items: { type: 'string' } },
  },
  required: ['mode', 'c', 'unmatched'],
});

const escapeRegExp = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Les mots du vocabulaire présents dans la phrase (mot entier, pluriel en s toléré,
   accents et casse ignorés). */
export const vocabularyIn = (phrase, vocabulary = []) => {
  const asked = fold(phrase);
  return (vocabulary || []).filter(entry => {
    if (!entry || !entry.term || !entry.meaning) {
      return false;
    }
    const term = escapeRegExp(fold(entry.term));
    return new RegExp(`(^|[^\\p{L}\\p{N}])${term}s?([^\\p{L}\\p{N}]|$)`, 'u').test(asked);
  });
};

/* Le message utilisateur : la demande, puis — c'est ce qu'un petit modèle suit le
   mieux — les définitions des mots du vocabulaire qu'elle contient, répétées là,
   sous ses yeux, sans toucher au prompt système que le serveur garde en cache. */
export const naturalUserMessage = (phrase, vocabulary = []) => {
  const hits = vocabularyIn(phrase, vocabulary);
  let user = `Demande : « ${phrase} »`;
  if (hits.length > 0) {
    user += '\nPrécisions : ' + hits.map(entry => `« ${String(entry.term).trim()} » = ${String(entry.meaning).trim()}`).join(' ; ');
  }
  return user;
};

/* Ce que l'application envoie à son service : le prompt système, la phrase telle
   quelle, le message utilisateur prêt, le schéma. Le service choisit le modèle et
   ses options. */
export const buildNaturalRequest = (phrase, catalog, options = {}) => ({
  system: buildNaturalPrompt(catalog, options),
  phrase,
  user: naturalUserMessage(phrase, options.vocabulary),
  format: buildNaturalSchema(catalog),
});

/* La réponse du modèle : déjà un objet, ou une chaîne JSON, éventuellement dans une
   clôture markdown. Lève une erreur si rien n'est lisible. */
export const parseNaturalContent = content => {
  if (content && typeof content === 'object') {
    return content;
  }
  const text = String(content || '')
    .replace(/```json\s*/gi, '')
    .replace(/```/g, '')
    .trim();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('natural: réponse illisible');
  }
  return parsed;
};

const fold = value =>
  String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/* Une valeur rendue par le modèle vers une option : valeur exacte, libellé exact
   (accents et casse ignorés), puis l'unique libellé qui commence par elle ou la
   contient (« Association » → « Association / Fondation »). */
export const matchOption = (field, value) => {
  const options = field.options || [];
  const wanted = fold(value);
  if (wanted === '') {
    return null;
  }
  let found = options.find(option => String(option.value) === String(value).trim());
  if (!found) {
    found = options.find(option => fold(option.label) === wanted);
  }
  if (!found) {
    const starts = options.filter(option => fold(option.label).startsWith(wanted) || wanted.startsWith(fold(option.label)));
    if (starts.length === 1) {
      found = starts[0];
    }
  }
  if (!found) {
    const contains = options.filter(option => fold(option.label).includes(wanted) || wanted.includes(fold(option.label)));
    if (contains.length === 1) {
      found = contains[0];
    }
  }
  return found || null;
};

const normalizeBool = value => {
  const v = fold(value);
  if (['1', 'true', 'oui', 'yes', 'vrai'].includes(v)) {
    return '1';
  }
  if (['0', 'false', 'non', 'no', 'faux'].includes(v)) {
    return '0';
  }
  return null;
};

const normalizeNumber = value => {
  const text = String(value)
    .replace(/[\s €$]/g, '')
    .replace(',', '.');
  if (text === '' || isNaN(Number(text))) {
    return null;
  }
  return text;
};

const normalizeDate = value => {
  const text = String(value).trim();
  let match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    const fr = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (fr) {
      match = [null, fr[3], fr[2], fr[1]];
    }
  }
  if (!match) {
    return null;
  }
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (isNaN(date.getTime()) || date.getUTCMonth() !== Number(m) - 1 || date.getUTCDate() !== Number(d)) {
    return null;
  }
  return `${y}-${m}-${d}`;
};

const unique = values => values.filter((value, index) => values.indexOf(value) === index);

/**
 * La réponse brute du modèle en critères vérifiés : { mode, criteria: [{ id, name,
 * operator, values }], warnings, unmatched }. Accepte la forme courte { c: [{ f, o,
 * v }] } comme la forme pleine { criteria: [{ field, operator, values }] }.
 */
export const naturalToCriteria = (raw = {}, catalog = [], { t = null, phrase = null, vocabulary = [] } = {}) => {
  const asked = phrase === null || typeof phrase === 'undefined' ? null : fold(phrase);
  /* Une valeur texte est légitime si la demande la contient, si c'est un code (chiffres :
     « Paris » → 75), ou si le vocabulaire l'a apportée (« banlieue » → 77, 78…). */
  const words = (vocabulary || []).filter(entry => entry && entry.meaning);
  const legitimate = value => {
    if (asked === null || asked.includes(fold(value)) || /^[\d\s.,/-]+$/.test(String(value))) {
      return true;
    }
    return words.some(
      entry =>
        fold(entry.meaning).includes(fold(value)) ||
        fold(entry.term || '') === fold(value) ||
        (Array.isArray(entry.criteria) && entry.criteria.some(c => (Array.isArray(c.values) ? c.values : [c.values]).some(v => fold(v) === fold(value))))
    );
  };
  const fields = fieldsForNatural(catalog);
  const byLabel = new Map(fields.map(field => [fold(field.label), field]));
  const byName = new Map(fields.map(field => [field.name, field]));
  const items = Array.isArray(raw.c)
    ? raw.c.map(item => ({ field: item && item.f, operator: item && item.o, values: item && item.v }))
    : Array.isArray(raw.criteria)
      ? raw.criteria.map(item => (item && !item.field && item.name ? { ...item, field: item.name } : item))
      : [];
  const warnings = [];
  const rows = [];
  const textCompared = new Map();
  items.forEach(item => {
    if (!item) {
      return;
    }
    const key = item.field === null || typeof item.field === 'undefined' ? '' : String(item.field);
    const field = byName.get(key) || byLabel.get(fold(key));
    if (!field) {
      warnings.push(tr(t, 'rbf.search.natural.unknownField', 'Champ inconnu « {field} », critère ignoré', { field: key }));
      return;
    }
    const type = naturalType(field);
    const allowed = OPERATORS_BY_TYPE[type] || OPERATORS_BY_TYPE.text;
    let oper = String(item.operator || '').toLowerCase();
    let values = (Array.isArray(item.values) ? item.values : [item.values])
      .filter(value => value !== null && typeof value !== 'undefined' && String(value).trim() !== '')
      .map(value => String(value).trim());
    const notA = () =>
      warnings.push(
        tr(t, 'rbf.search.natural.notA', '{label} attend {kind}, pas « {values} » : critère ignoré', {
          label: field.label,
          kind: KIND_OF[type],
          values: values.join(' '),
        })
      );
    if (!allowed.includes(oper)) {
      /* Des mots avec un opérateur de texte sur une date ou un nombre : le modèle
         s'est trompé de champ, inutile d'insister (« Ami contient Kiki »). */
      if (oper && ORDERED_TYPES.includes(type) && OPERATORS_BY_TYPE.text.includes(oper) && values.length > 0) {
        notA();
        return;
      }
      /* Une comparaison sur un texte (« code postal entre 75000 et 75019 ») : l'idée
         est bonne, le champ ne la permet pas ; une ligne par champ, pas par valeur. */
      if (oper && type === 'text' && COMPARE_OPERS.includes(oper)) {
        const list = textCompared.get(field.label) || [];
        list.push(values.join(oper === FILTER_OPER_BETWEEN ? ' à ' : ' '));
        textCompared.set(field.label, list);
        return;
      }
      const replacement = !oper ? field.defaultOperator : type === 'select' || type === 'bool' ? FILTER_OPER_EQUAL : field.defaultOperator;
      if (oper) {
        warnings.push(
          tr(t, 'rbf.search.natural.operatorReplaced', '{label} : « {from} » remplacé par « {to} »', {
            label: field.label,
            from: operatorLabel(oper, type, t),
            to: operatorLabel(replacement, type, t),
          })
        );
      }
      oper = replacement;
    }
    if (!needsValue(oper)) {
      values = [];
    } else {
      const given = values.length;
      const bad = [];
      values = values
        .map(value => {
          let kept = value;
          if (type === 'select') {
            const option = matchOption(field, value);
            kept = option ? String(option.value) : null;
          } else if (type === 'bool') {
            kept = normalizeBool(value);
          } else if (ORDERED_TYPES.includes(type)) {
            kept = type === 'number' || type === 'monetary' ? normalizeNumber(value) : normalizeDate(value);
            if (kept === null) {
              bad.push(value);
              return null;
            }
          } else if (!legitimate(value)) {
            /* Un nom, une ville, un pays viennent de la demande elle-même : une valeur
               texte qui n'y figure pas a été inventée (« en anglais » → « United
               Kingdom »), elle part avec un mot. */
            warnings.push(tr(t, 'rbf.search.natural.notInPhrase', '{label} : « {value} » n’est pas dans la demande, ignoré', { label: field.label, value }));
            return null;
          }
          if (kept === null) {
            warnings.push(tr(t, 'rbf.search.natural.unknownValue', '{label} : valeur « {value} » inconnue, ignorée', { label: field.label, value }));
          }
          return kept;
        })
        .filter(value => value !== null);
      if (bad.length > 0) {
        if (values.length === 0) {
          /* Rien d'utilisable : une seule ligne, pas une par valeur ni « début et fin ». */
          values = bad;
          notA();
          return;
        }
        bad.forEach(value =>
          warnings.push(tr(t, 'rbf.search.natural.unknownValue', '{label} : valeur « {value} » inconnue, ignorée', { label: field.label, value }))
        );
      }
      if (oper === FILTER_OPER_BETWEEN && values.length !== 2) {
        warnings.push(tr(t, 'rbf.search.natural.badRange', '{label} : il faut un début et une fin, critère ignoré', { label: field.label }));
        return;
      }
      if (values.length === 0) {
        /* Chaque valeur écartée a déjà son mot ; on ne le répète que si rien n'était donné. */
        if (given === 0) {
          warnings.push(tr(t, 'rbf.search.natural.noValue', '{label} : pas de valeur donnée, critère ignoré', { label: field.label }));
        }
        return;
      }
    }
    rows.push({ id: newCriterionId(), name: field.name, operator: oper, values, field, type });
  });

  textCompared.forEach((list, label) =>
    warnings.push(
      tr(t, 'rbf.search.natural.textCompare', '{label} : « {values} » ignoré — un texte ne se compare pas, il « commence par » ou « contient »', {
        label,
        values: list.join(' », « '),
      })
    )
  );

  /* Un seul critère par champ : mêmes opérateurs → valeurs réunies ; une borne basse
     et une haute → between ; sinon le premier gagne. */
  const merged = [];
  const byField = new Map();
  rows.forEach(row => {
    const prev = byField.get(row.name);
    if (!prev) {
      byField.set(row.name, row);
      merged.push(row);
      return;
    }
    if (prev.operator === row.operator && needsValue(row.operator) && row.operator !== FILTER_OPER_BETWEEN) {
      prev.values = unique(prev.values.concat(row.values));
      return;
    }
    const ordered = ORDERED_TYPES.includes(row.type);
    const lowThenHigh = LOW_OPERS.includes(prev.operator) && HIGH_OPERS.includes(row.operator);
    const highThenLow = HIGH_OPERS.includes(prev.operator) && LOW_OPERS.includes(row.operator);
    if (ordered && (lowThenHigh || highThenLow)) {
      prev.values = lowThenHigh ? [prev.values[0], row.values[0]] : [row.values[0], prev.values[0]];
      prev.operator = FILTER_OPER_BETWEEN;
      return;
    }
    warnings.push(tr(t, 'rbf.search.natural.duplicate', '{label} : un seul critère retenu', { label: row.field.label }));
  });

  /* Texte : « contient A ou B », « commence par 77, 78 ou 91 » passent en une liste ;
     les opérateurs négatifs gardent la première valeur. */
  merged.forEach(row => {
    if (row.type === 'text' && row.values.length > 1 && !TEXT_MULTI_OPERS.includes(row.operator)) {
      warnings.push(tr(t, 'rbf.search.natural.singleValue', '{label} : une seule valeur retenue, « {value} »', { label: row.field.label, value: row.values[0] }));
      row.values = [row.values[0]];
    }
  });

  let mode = String(raw.mode || '').toUpperCase() === FILTER_MODE_OR ? FILTER_MODE_OR : FILTER_MODE_AND;
  if (mode === FILTER_MODE_OR && merged.length < 2) {
    mode = FILTER_MODE_AND;
  }
  const unmatched = (Array.isArray(raw.unmatched) ? raw.unmatched : [])
    .map(item => (item === null || typeof item === 'undefined' ? '' : String(item).trim()))
    .filter(item => item !== '');
  return {
    mode,
    criteria: merged.map(row => ({ id: row.id, name: row.name, operator: row.operator, values: row.values })),
    warnings,
    unmatched,
  };
};

/**
 * Le NaturalLanguageResult complet : le Filter bâti sur `base` (ses fixes, défauts
 * et groupes conservés, le reste remplacé), le mode, les critères, et les
 * avertissements précédés des morceaux non compris.
 */
export const naturalToResult = (raw, catalog = [], { base = null, t = null, phrase = null, vocabulary = [] } = {}) => {
  const { mode, criteria, warnings, unmatched } = naturalToCriteria(raw, catalog, { t, phrase, vocabulary });
  const filter = criteriaToFilter(criteria, mode, catalog, base);
  const all = warnings.slice();
  if (unmatched.length > 0) {
    all.unshift(tr(t, 'rbf.search.natural.unmatched', 'Non compris : {items}', { items: unmatched.map(item => `« ${item} »`).join(', ') }));
  }
  return { filter, mode, criteria, warnings: all, unmatched };
};

/**
 * Fabrique le `onNaturalLanguage` d'une application : `transport(request, context)`
 * rend (ou promet) la réponse du modèle — une chaîne, un objet, ou { content }.
 * `catalog`, `base` et `vocabulary` peuvent être des fonctions, lues à chaque
 * demande ; sans `base`, le filtre courant du contexte sert de socle.
 */
export const createNaturalLanguage = ({ transport, catalog, base = null, examples = [], vocabulary = [], subject = null, intro = null, today = null, t = null }) => {
  if (typeof transport !== 'function') {
    throw new Error('createNaturalLanguage : transport requis');
  }
  return (phrase, context = {}) => {
    const fields = typeof catalog === 'function' ? catalog(context) : catalog;
    const socle = typeof base === 'function' ? base(context) : base || context.filter || null;
    const words = typeof vocabulary === 'function' ? vocabulary(context) : vocabulary;
    const request = buildNaturalRequest(phrase, fields, { examples, vocabulary: words, subject, intro, today });
    return Promise.resolve(transport(request, context)).then(response => {
      const content = response && typeof response === 'object' && Object.prototype.hasOwnProperty.call(response, 'content') ? response.content : response;
      return naturalToResult(parseNaturalContent(content), fields, { base: socle, t, phrase, vocabulary: words });
    });
  };
};

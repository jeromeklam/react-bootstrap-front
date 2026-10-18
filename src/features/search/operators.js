import {
  FILTER_OPER_LIKE,
  FILTER_OPER_NOT_LIKE,
  FILTER_OPER_START_WITH,
  FILTER_OPER_END_WITH,
  FILTER_OPER_SOUND_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_NOT_EQUAL,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
  FILTER_OPER_GREATER,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_GREATER_OR_EQUAL_OR_NULL,
  FILTER_OPER_LOWER,
  FILTER_OPER_LOWER_OR_EQUAL,
  FILTER_OPER_LOWER_OR_EQUAL_OR_NULL,
  FILTER_OPER_BETWEEN,
  FILTER_OPER_IN,
  FILTER_OPER_NOT_IN,
} from '../filter';
import { tr } from './i18n';

/**
 * Les opérateurs proposés par type de champ, en données.
 *
 * Reprend la matrice de FilterBuilder.getOptionsForType en comblant ses manques
 * (between sur number, datetime, in / nin), sans toucher à FilterBuilder.
 */
const TEXT = [
  FILTER_OPER_LIKE,
  FILTER_OPER_NOT_LIKE,
  FILTER_OPER_START_WITH,
  FILTER_OPER_END_WITH,
  FILTER_OPER_SOUND_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_NOT_EQUAL,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
];
const ORDERED = [
  FILTER_OPER_EQUAL,
  FILTER_OPER_NOT_EQUAL,
  FILTER_OPER_GREATER,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_LOWER,
  FILTER_OPER_LOWER_OR_EQUAL,
  FILTER_OPER_BETWEEN,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
];
const CHOICE = [FILTER_OPER_EQUAL, FILTER_OPER_NOT_EQUAL, FILTER_OPER_EMPTY, FILTER_OPER_NOT_EMPTY];

export const OPERATORS_BY_TYPE = {
  text: TEXT,
  number: ORDERED,
  monetary: ORDERED,
  date: ORDERED,
  datetime: ORDERED,
  select: CHOICE,
  picker: CHOICE,
  bool: [FILTER_OPER_EQUAL, FILTER_OPER_EMPTY, FILTER_OPER_NOT_EMPTY],
};

export const DEFAULT_OPERATOR_BY_TYPE = {
  text: FILTER_OPER_LIKE,
  number: FILTER_OPER_BETWEEN,
  monetary: FILTER_OPER_BETWEEN,
  date: FILTER_OPER_BETWEEN,
  datetime: FILTER_OPER_BETWEEN,
  select: FILTER_OPER_EQUAL,
  picker: FILTER_OPER_EQUAL,
  bool: FILTER_OPER_EQUAL,
};

/* Libellés des sélecteurs (« Ville  commence par  … »). */
const LABELS = {
  [FILTER_OPER_LIKE]: 'contient',
  [FILTER_OPER_NOT_LIKE]: 'ne contient pas',
  [FILTER_OPER_START_WITH]: 'commence par',
  [FILTER_OPER_END_WITH]: 'finit par',
  [FILTER_OPER_SOUND_LIKE]: 'ressemble à',
  [FILTER_OPER_EQUAL]: 'est',
  [FILTER_OPER_NOT_EQUAL]: 'n’est pas',
  [FILTER_OPER_EMPTY]: 'est vide',
  [FILTER_OPER_NOT_EMPTY]: 'n’est pas vide',
  [FILTER_OPER_GREATER]: 'supérieur à',
  [FILTER_OPER_GREATER_OR_EQUAL]: 'supérieur ou égal à',
  [FILTER_OPER_GREATER_OR_EQUAL_OR_NULL]: 'vide ou supérieur ou égal à',
  [FILTER_OPER_LOWER]: 'inférieur à',
  [FILTER_OPER_LOWER_OR_EQUAL]: 'inférieur ou égal à',
  [FILTER_OPER_LOWER_OR_EQUAL_OR_NULL]: 'vide ou inférieur ou égal à',
  [FILTER_OPER_BETWEEN]: 'entre',
  [FILTER_OPER_IN]: 'parmi',
  [FILTER_OPER_NOT_IN]: 'hors de',
};
const DATE_LABELS = {
  [FILTER_OPER_GREATER]: 'après le',
  [FILTER_OPER_GREATER_OR_EQUAL]: 'à partir du',
  [FILTER_OPER_GREATER_OR_EQUAL_OR_NULL]: 'vide ou à partir du',
  [FILTER_OPER_LOWER]: 'avant le',
  [FILTER_OPER_LOWER_OR_EQUAL]: 'jusqu’au',
  [FILTER_OPER_LOWER_OR_EQUAL_OR_NULL]: 'vide ou jusqu’au',
};

/* Tournures de la phrase en clair (« dont la ville  commence par  … »). */
const PHRASES = {
  [FILTER_OPER_LIKE]: 'contient',
  [FILTER_OPER_NOT_LIKE]: 'ne contient pas',
  [FILTER_OPER_START_WITH]: 'commence par',
  [FILTER_OPER_END_WITH]: 'finit par',
  [FILTER_OPER_SOUND_LIKE]: 'ressemble à',
  [FILTER_OPER_EQUAL]: 'est',
  [FILTER_OPER_NOT_EQUAL]: 'n’est pas',
  [FILTER_OPER_GREATER]: 'est supérieur à',
  [FILTER_OPER_GREATER_OR_EQUAL]: 'est supérieur ou égal à',
  [FILTER_OPER_GREATER_OR_EQUAL_OR_NULL]: 'est vide ou supérieur ou égal à',
  [FILTER_OPER_LOWER]: 'est inférieur à',
  [FILTER_OPER_LOWER_OR_EQUAL]: 'est inférieur ou égal à',
  [FILTER_OPER_LOWER_OR_EQUAL_OR_NULL]: 'est vide ou inférieur ou égal à',
  [FILTER_OPER_BETWEEN]: 'est entre',
  [FILTER_OPER_IN]: 'est parmi',
  [FILTER_OPER_NOT_IN]: 'n’est pas parmi',
};
const DATE_PHRASES = {
  [FILTER_OPER_GREATER]: 'est après le',
  [FILTER_OPER_GREATER_OR_EQUAL]: 'est à partir du',
  [FILTER_OPER_GREATER_OR_EQUAL_OR_NULL]: 'est vide ou à partir du',
  [FILTER_OPER_LOWER]: 'est avant le',
  [FILTER_OPER_LOWER_OR_EQUAL]: 'est jusqu’au',
  [FILTER_OPER_LOWER_OR_EQUAL_OR_NULL]: 'est vide ou jusqu’au',
};

const isDateType = type => type === 'date' || type === 'datetime';

export const needsValue = oper => oper !== FILTER_OPER_EMPTY && oper !== FILTER_OPER_NOT_EMPTY;

export const isRange = oper => oper === FILTER_OPER_BETWEEN;

export const defaultOperatorForType = type => DEFAULT_OPERATOR_BY_TYPE[type] || FILTER_OPER_LIKE;

export const operatorLabel = (oper, type, t) => {
  if (isDateType(type) && DATE_LABELS[oper]) {
    return tr(t, `rbf.filter.oper.${oper}.date`, DATE_LABELS[oper]);
  }
  return tr(t, `rbf.filter.oper.${oper}`, LABELS[oper] || oper);
};

export const operatorPhrase = (oper, type, t) => {
  if (isDateType(type) && DATE_PHRASES[oper]) {
    return tr(t, `rbf.filter.phrase.${oper}.date`, DATE_PHRASES[oper]);
  }
  return tr(t, `rbf.filter.phrase.${oper}`, PHRASES[oper] || LABELS[oper] || oper);
};

/* [{ value, label }] pour un sélecteur. `multiOperator: 'in'` ajoute in / nin
   aux listes de choix. */
export const getOperatorsForType = (type, t, { multiOperator = 'eq' } = {}) => {
  let opers = OPERATORS_BY_TYPE[type] || TEXT;
  if ((type === 'select' || type === 'picker') && multiOperator === 'in') {
    opers = [FILTER_OPER_EQUAL, FILTER_OPER_NOT_EQUAL, FILTER_OPER_IN, FILTER_OPER_NOT_IN, FILTER_OPER_EMPTY, FILTER_OPER_NOT_EMPTY];
  }
  return opers.map(value => ({ value, label: operatorLabel(value, type, t) }));
};

/* Les opérateurs d'un champ du catalogue : sa liste `operators` si elle existe,
   dans l'ordre donné, sinon la matrice de son type. */
export const getFieldOperators = (field, t) => {
  if (Array.isArray(field.operators) && field.operators.length > 0) {
    return field.operators.map(value => ({ value, label: operatorLabel(value, field.type, t) }));
  }
  return getOperatorsForType(field.type, t, { multiOperator: field.multiOperator });
};

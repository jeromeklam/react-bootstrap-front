/* MODES */
export const FILTER_MODE_OR = 'OR';
export const FILTER_MODE_AND = 'AND';
/* OPERATORS */
export const FILTER_OPER_LIKE = 'contains';
export const FILTER_OPER_SOUND_LIKE = 'soundex';
export const FILTER_OPER_NOT_LIKE = 'ncontains';
export const FILTER_OPER_START_WITH = 'containsb';
export const FILTER_OPER_END_WITH = 'containse';
export const FILTER_OPER_EQUAL = 'eq';
export const FILTER_OPER_NOT_EQUAL = 'neq';
export const FILTER_OPER_EMPTY = 'empty';
export const FILTER_OPER_NOT_EMPTY = 'nempty';
export const FILTER_OPER_LOWER = 'ltw';
export const FILTER_OPER_LOWER_OR_EQUAL = 'ltwe';
export const FILTER_OPER_LOWER_OR_EQUAL_OR_NULL = 'ltwen';
export const FILTER_OPER_GREATER = 'gt';
export const FILTER_OPER_GREATER_OR_EQUAL = 'gte';
export const FILTER_OPER_GREATER_OR_EQUAL_OR_NULL = 'gten';
export const FILTER_OPER_IN = 'in';
export const FILTER_OPER_NOT_IN = 'nin';
export const FILTER_OPER_BETWEEN = 'between';
/* TYPES */
export const FILTER_TYPE_GROUP = 'GROUP';
export const FILTER_TYPE_ELEM = 'ELEM';
/* SEARCH MODE */
export const FILTER_SEARCH_NONE = 'NONE';
export const FILTER_SEARCH_QUICK = 'QUICK';
export const FILTER_SEARCH_SIMPLE = 'SIMPLE';

export { default as DefaultPanel } from './DefaultPanel.jsx';
export { default as Filter } from './Filter.js';
export { default as FilterBuilder } from './FilterBuilder.jsx';
export { default as InputAutocomplete } from './InputAutocomplete';
export { default as FilterHeader } from './FilterHeader.jsx';

import {
  Filter,
  FILTER_MODE_AND,
  FILTER_OPER_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_IN,
  FILTER_OPER_BETWEEN,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_LOWER_OR_EQUAL,
} from '../filter';
import { needsValue } from './operators';

/**
 * Aller-retour entre les valeurs d'un formulaire de recherche ({ nom: valeur })
 * et le modèle Filter, piloté par le catalogue. Les champs virtuels passent par
 * leurs propres toFilter / fromFilter.
 */
const RANGE_WIDGETS = ['date-range', 'amount-range', 'number-range'];
const RANGE_TYPES = ['date', 'datetime', 'monetary', 'number'];

export const hasValue = value => {
  if (value === null || typeof value === 'undefined' || value === '') {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some(hasValue);
  }
  return true;
};

const bound = value => (value === null || typeof value === 'undefined' ? '' : value);

/* Un champ saisi comme une plage [de, à]. */
export const isRangeField = field =>
  RANGE_WIDGETS.includes(field.widget) ||
  (!field.widget && RANGE_TYPES.includes(field.type) && field.defaultOperator === FILTER_OPER_BETWEEN);

/* Un champ à plusieurs valeurs (pastilles, select multiple). */
export const isMultiField = field =>
  field.widget === 'pills' || (field.multiple && (field.type === 'select' || field.type === 'picker'));

/* Un filtre prêt à recevoir des critères : copie de `base` vidée de tout sauf ses
   fixes et défauts, ou un filtre neuf en mode ET. */
export const newFilter = (base = null, mode = FILTER_MODE_AND) => {
  if (base) {
    const filter = base.clone();
    filter.removeAll();
    if (mode) {
      filter.setMode(mode);
    }
    return filter;
  }
  const filter = new Filter();
  filter.init(mode, FILTER_OPER_LIKE);
  return filter;
};

export const valuesToFilter = (values = {}, catalog = [], base = null, { mode = FILTER_MODE_AND } = {}) => {
  const filter = newFilter(base, mode);
  catalog.forEach(field => {
    const value = values[field.name];
    if (field.virtual) {
      if (typeof field.toFilter === 'function') {
        field.toFilter(hasValue(value) ? value : '', filter, field);
      }
      return;
    }
    if (!hasValue(value)) {
      return;
    }
    if (isRangeField(field)) {
      const [from, to] = Array.isArray(value) ? value : [value, ''];
      filter.setFilterRange(field.name, from, to);
      return;
    }
    if (isMultiField(field)) {
      const list = Array.isArray(value) ? value : [value];
      filter.setFilterValues(field.name, list, field.multiOperator === 'in' ? FILTER_OPER_IN : FILTER_OPER_EQUAL);
      return;
    }
    const oper = field.type === 'text' ? field.defaultOperator : FILTER_OPER_EQUAL;
    filter.replaceFilter(field.name, [value], oper);
  });
  return filter;
};

export const filterToValues = (filter, catalog = []) => {
  const values = {};
  if (!filter) {
    return values;
  }
  catalog.forEach(field => {
    if (field.virtual) {
      if (typeof field.fromFilter === 'function') {
        const value = field.fromFilter(filter, field);
        if (hasValue(value)) {
          values[field.name] = value;
        }
      }
      return;
    }
    const elt = filter.findFirst(field.name);
    if (!elt) {
      return;
    }
    const oper = elt.getOperator();
    if (isRangeField(field)) {
      const first = bound(elt.getFilterCrit('default'));
      if (oper === FILTER_OPER_BETWEEN) {
        values[field.name] = [first, bound(elt.getFilterCrit('between'))];
      } else if (oper === FILTER_OPER_LOWER_OR_EQUAL) {
        values[field.name] = ['', first];
      } else if (oper === FILTER_OPER_GREATER_OR_EQUAL || needsValue(oper)) {
        values[field.name] = [first, ''];
      }
      return;
    }
    if (isMultiField(field)) {
      values[field.name] = elt.getValues();
      return;
    }
    if (needsValue(oper)) {
      values[field.name] = bound(elt.getValues()[0]);
    }
  });
  return values;
};

import { FILTER_MODE_OR, FILTER_OPER_EMPTY, FILTER_OPER_BETWEEN } from '../filter';
import { operatorPhrase, needsValue } from './operators';
import { fieldOwning } from './catalog';
import { tr } from './i18n';

/**
 * La phrase « EN CLAIR » : « Donateurs dont le dernier paiement est entre le
 * 01/01/2025 et le 31/12/2025, rattachés à Kalaweit France, sans e-mail. »
 *
 * Chaque critère donne un fragment, lui-même une liste de parties { text, bold } :
 * les valeurs sont en gras. Le catalogue peut remplacer une tournure
 * (`phrase[oper]`, `phrase.label`), formater une valeur (`format`) ou fournir le
 * sujet (`subjectFor`). Les champs virtuels donnent leur propre texte (`toText`).
 */
const pad = n => (n < 10 ? '0' : '') + n;

export const formatDate = value => {
  if (!value) {
    return '';
  }
  if (value instanceof Date) {
    return `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`;
  }
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value);
};

export const formatAmount = (value, unit = '€') => {
  const number = Number(String(value).replace(',', '.'));
  if (Number.isNaN(number)) {
    return String(value);
  }
  const text = number.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return unit ? `${text} ${unit}` : text;
};

export const formatValue = (field, value, t) => {
  if (typeof field.format === 'function') {
    return field.format(value, field);
  }
  switch (field.type) {
    case 'date':
    case 'datetime':
      return formatDate(value);
    case 'monetary':
      return formatAmount(value, field.unit);
    case 'bool':
      return value === true || value === 1 || value === '1' || value === 'true'
        ? tr(t, 'rbf.search.value.yes', 'oui')
        : tr(t, 'rbf.search.value.no', 'non');
    case 'select':
    case 'picker': {
      const option = (field.options || []).find(o => String(o.value) === String(value));
      return option ? String(option.label) : String(value);
    }
    default:
      return String(value);
  }
};

/* Les gabarits passent par t avec leurs jetons comme valeurs : un t à la
   formatMessage les rend tels quels, rbfIntl les ignore. */
const TOKENS = { label: '{label}', value: '{value}', from: '{from}', to: '{to}', operator: '{operator}' };
const template = (t, id, defaultMessage) => tr(t, id, defaultMessage, TOKENS);

/* « dont {label} est entre le {from} et le {to} » → parties, valeurs en gras.
   {value} peut être une liste : « A, B ou C ». */
export const renderTemplate = (text, vars) => {
  const parts = [];
  const re = /\{(label|value|from|to)\}/g;
  let last = 0;
  let match = re.exec(text);
  while (match) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index) });
    }
    const key = match[1];
    if (key === 'label') {
      parts.push({ text: String(vars.label || '') });
    } else if (key === 'value' && Array.isArray(vars.value)) {
      vars.value.forEach((v, i) => {
        if (i > 0) {
          parts.push({ text: i === vars.value.length - 1 ? vars.or || ' ou ' : ', ' });
        }
        parts.push({ text: String(v), bold: true });
      });
    } else {
      parts.push({ text: vars[key] === null || typeof vars[key] === 'undefined' ? '' : String(vars[key]), bold: true });
    }
    last = re.lastIndex;
    match = re.exec(text);
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last) });
  }
  return parts;
};

const partsFor = (field, elt, t) => {
  const oper = elt.getOperator();
  const label = field.phrase && field.phrase.label ? field.phrase.label : String(field.label).toLowerCase();
  const custom = field.phrase && field.phrase[oper];
  const isDate = field.type === 'date' || field.type === 'datetime';
  if (!needsValue(oper)) {
    /* « sans e-mail », « avec e-mail » : le nom nu, pas la forme avec article de
       phrase.label (« l’e-mail ») qui sert aux autres tournures. */
    const text =
      custom ||
      (oper === FILTER_OPER_EMPTY
        ? template(t, 'rbf.search.phrase.empty', 'sans {label}')
        : template(t, 'rbf.search.phrase.nempty', 'avec {label}'));
    return renderTemplate(text, { label: String(field.label).toLowerCase() });
  }
  if (oper === FILTER_OPER_BETWEEN) {
    const from = formatValue(field, elt.getFilterCrit('default'), t);
    const to = formatValue(field, elt.getFilterCrit('between'), t);
    const text =
      custom ||
      (isDate
        ? template(t, 'rbf.search.phrase.between.date', 'dont {label} est entre le {from} et le {to}')
        : template(t, 'rbf.search.phrase.between', 'dont {label} est entre {from} et {to}'));
    return renderTemplate(text, { label, from, to });
  }
  const values = elt.getValues().map(v => formatValue(field, v, t));
  const value = values.length === 1 ? values[0] : values;
  const text = (custom || template(t, 'rbf.search.phrase.default', 'dont {label} {operator} {value}')).replace(
    '{operator}',
    operatorPhrase(oper, field.type, t)
  );
  return renderTemplate(text, { label, value, or: tr(t, 'rbf.search.value.or', ' ou ') });
};

const labelOf = (field, name) => (field && field.phrase && field.phrase.label ? field.phrase.label : field ? String(field.label).toLowerCase() : name);

/* Un groupe de critères identiques (la recherche rapide : même opérateur, mêmes
   valeurs sur plusieurs champs) se dit en une fois : « dont le prénom, le nom ou
   l'e-mail contient dup ». Sinon null, et chaque critère garde son fragment. */
const groupFragment = (group, elts, catalog, t) => {
  if (elts.length < 2) {
    return null;
  }
  const oper = elts[0].getOperator();
  const first = JSON.stringify(elts[0].getValues());
  if (!needsValue(oper) || oper === FILTER_OPER_BETWEEN || elts.some(e => e.getOperator() !== oper || JSON.stringify(e.getValues()) !== first)) {
    return null;
  }
  const labels = elts.map(e => labelOf(fieldOwning(catalog, e.getFilterName()), e.getFilterName()));
  const or = tr(t, 'rbf.search.value.or', ' ou ');
  const label = labels.length > 1 ? `${labels.slice(0, -1).join(', ')}${or}${labels[labels.length - 1]}` : labels[0];
  const field = fieldOwning(catalog, elts[0].getFilterName()) || { type: 'text', options: [] };
  const values = elts[0].getValues().map(v => formatValue(field, v, t));
  const value = values.length === 1 ? values[0] : values;
  const text = template(t, 'rbf.search.phrase.default', 'dont {label} {operator} {value}').replace('{operator}', operatorPhrase(oper, field.type, t));
  return { name: `group:${group}`, label, operator: oper, value: elts[0].getValues(), parts: renderTemplate(text, { label, value, or }) };
};

/* Un fragment par critère actif non fixe (les virtuels regroupent leurs champs, les
   groupes identiques aussi). */
export const filterToFragments = (filter, catalog = [], t, { withDefaults = true } = {}) => {
  const fragments = [];
  const seen = new Set();
  const elts = filter.getFilters({ fixed: false, default: withDefaults });
  const groups = {};
  elts.forEach(elt => {
    if (elt.getGroup()) {
      groups[elt.getGroup()] = (groups[elt.getGroup()] || []).concat(elt);
    }
  });
  elts.forEach(elt => {
    const name = elt.getFilterName();
    const group = elt.getGroup();
    if (group && groups[group]) {
      if (seen.has(`group:${group}`)) {
        return;
      }
      const merged = groupFragment(group, groups[group], catalog, t);
      if (merged) {
        seen.add(`group:${group}`);
        fragments.push(merged);
        return;
      }
    }
    const field = fieldOwning(catalog, name);
    if (!field) {
      fragments.push({
        name,
        label: name,
        operator: elt.getOperator(),
        parts: [{ text: `${name} ${elt.getOperator()} ` }, { text: elt.getValues().join(', '), bold: true }],
      });
      return;
    }
    if (field.virtual) {
      if (seen.has(field.name)) {
        return;
      }
      seen.add(field.name);
      const value = typeof field.fromFilter === 'function' ? field.fromFilter(filter, field) : '';
      const text = typeof field.toText === 'function' ? field.toText(value, field, t) : '';
      if (!text || (Array.isArray(text) && text.length === 0)) {
        return;
      }
      fragments.push({ name: field.name, label: field.label, operator: null, value, parts: Array.isArray(text) ? text : [{ text }] });
      return;
    }
    fragments.push({ name, label: field.label, operator: elt.getOperator(), value: elt.getValues(), parts: partsFor(field, elt, t) });
  });
  return fragments.map(f => ({ ...f, text: f.parts.map(p => p.text).join('') }));
};

/* Les parties de la phrase complète, sujet compris, ou null sans critère. */
export const filterToSentenceParts = (filter, catalog = [], t, { subject, withDefaults = true } = {}) => {
  if (!filter) {
    return null;
  }
  let fragments = filterToFragments(filter, catalog, t, { withDefaults });
  let head = subject;
  catalog.some(field => {
    if (typeof field.subjectFor !== 'function') {
      return false;
    }
    const elt = filter.findFirst(field.name);
    if (!elt) {
      return false;
    }
    const found = field.subjectFor(elt.getValues(), field);
    if (found) {
      head = found;
      fragments = fragments.filter(f => f.name !== field.name);
      return true;
    }
    return false;
  });
  if (fragments.length === 0) {
    return null;
  }
  const parts = [{ text: head || tr(t, 'rbf.search.sentence.subject', 'Résultats'), bold: true, subject: true }];
  const orMode = filter.getMode() === FILTER_MODE_OR;
  fragments.forEach((fragment, i) => {
    let separator = ', ';
    if (i === 0) {
      separator = ' ';
    } else if (orMode && i === fragments.length - 1) {
      separator = tr(t, 'rbf.search.sentence.or', ' ou ');
    }
    parts.push({ text: separator });
    fragment.parts.forEach(part => parts.push(part));
  });
  parts.push({ text: '.' });
  return parts;
};

export const filterToSentence = (filter, catalog, t, options) => {
  const parts = filterToSentenceParts(filter, catalog, t, options);
  return parts ? parts.map(p => p.text).join('') : '';
};

import { defaultOperatorForType } from './operators';
import { warnOnce } from './i18n';

/**
 * Le catalogue de champs : un objet simple par champ cherchable, construit par
 * l'application (le plus souvent depuis son getCols) et partagé par la fiche de
 * recherche, les facettes, les lignes de critères et la phrase en clair. Le
 * contrat est décrit dans doc/recherche/composants.md.
 */
export const FIELD_TYPES = ['text', 'number', 'monetary', 'date', 'datetime', 'bool', 'select', 'picker'];

const TYPE_ALIASES = {
  boolean: 'bool',
  string: 'text',
  test: 'text',
  int: 'number',
  integer: 'number',
  float: 'number',
  decimal: 'number',
  money: 'monetary',
  time: 'datetime',
};

export const normalizeType = type => {
  const lower = String(type || 'text').toLowerCase();
  if (FIELD_TYPES.includes(lower)) {
    return lower;
  }
  if (TYPE_ALIASES[lower]) {
    if (lower !== 'boolean') {
      warnOnce(`type de champ « ${type} » lu comme « ${TYPE_ALIASES[lower]} »`);
    }
    return TYPE_ALIASES[lower];
  }
  warnOnce(`type de champ inconnu « ${type} », traité comme texte`);
  return 'text';
};

export const normalizeField = field => {
  const type = normalizeType(field.type);
  return {
    ...field,
    label: field.label || field.name,
    type,
    defaultOperator: field.defaultOperator || defaultOperatorForType(type),
    multiple: typeof field.multiple === 'boolean' ? field.multiple : type === 'select',
    multiOperator: field.multiOperator || 'eq',
    options: Array.isArray(field.options) ? field.options : [],
    hidden: !!field.hidden,
    virtual: !!field.virtual,
    fields: Array.isArray(field.fields) ? field.fields : [],
  };
};

/* Complète les défauts et dédoublonne par nom : le dernier contenu gagne, à la
   place du premier (l'ordre d'affichage reste stable). */
export const normalizeCatalog = (fields = []) => {
  const byName = new Map();
  fields.forEach(field => {
    if (!field || !field.name) {
      warnOnce('champ de catalogue sans nom, ignoré');
      return;
    }
    if (byName.has(field.name)) {
      warnOnce(`champ « ${field.name} » déclaré deux fois, le dernier est gardé`);
    }
    byName.set(field.name, normalizeField(field));
  });
  return Array.from(byName.values());
};

/**
 * Depuis les colonnes d'une liste (`filterable: true | { type, col, options,
 * display, onSearch }`). `overrides[nom]` complète ou corrige un champ ;
 * `overrides.extra` ajoute des champs, virtuels compris.
 */
export const catalogFromCols = (cols = [], overrides = {}) => {
  const fields = [];
  cols.forEach(col => {
    if (!col || !col.filterable) {
      return;
    }
    const spec = col.filterable === true ? {} : col.filterable;
    const name = spec.col || col.col;
    if (!name) {
      return;
    }
    const extra = overrides[name] || {};
    const label = extra.label || col.label;
    if (!label || label === '') {
      return;
    }
    const field = { name, label, type: spec.type || 'text' };
    if (Array.isArray(spec.options)) {
      field.options = spec.options;
    }
    if (typeof spec.onSearch === 'function') {
      field.type = 'picker';
      field.picker = { onSearch: spec.onSearch, display: spec.display };
    }
    fields.push({ ...field, ...extra });
  });
  (overrides.extra || []).forEach(field => fields.push(field));
  return normalizeCatalog(fields);
};

export const findField = (catalog, name) => catalog.find(field => field.name === name);

/* Le champ qui « possède » un nom du Filter : un virtuel qui le liste, sinon le
   champ lui-même. */
export const fieldOwning = (catalog, name) =>
  catalog.find(field => field.virtual && field.fields.includes(name)) || findField(catalog, name);

export const fieldsForRows = catalog => catalog.filter(field => !field.hidden);

export const fieldsForFacets = catalog =>
  catalog
    .filter(field => field.facet)
    .sort((a, b) => {
      const oa = typeof a.facet.order === 'number' ? a.facet.order : 1000;
      const ob = typeof b.facet.order === 'number' ? b.facet.order : 1000;
      return oa - ob || String(a.label).localeCompare(String(b.label));
    });

export const fieldsForSection = (catalog, section) => catalog.filter(field => field.section === section);

const withoutFunctions = value => {
  if (Array.isArray(value)) {
    return value.map(withoutFunctions).filter(v => typeof v !== 'undefined');
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      const plain = withoutFunctions(value[key]);
      if (typeof plain !== 'undefined') {
        acc[key] = plain;
      }
      return acc;
    }, {});
  }
  return typeof value === 'function' ? undefined : value;
};

/* Pour le futur service d'interprétation : noms, libellés, types, options, sans
   aucune fonction. */
export const catalogToJson = catalog =>
  catalog.map(field =>
    withoutFunctions({
      name: field.name,
      label: field.label,
      type: field.type,
      operators: field.operators,
      defaultOperator: field.defaultOperator,
      multiple: field.multiple,
      options: field.options,
      section: field.section,
      virtual: field.virtual || undefined,
      fields: field.virtual ? field.fields : undefined,
    })
  );

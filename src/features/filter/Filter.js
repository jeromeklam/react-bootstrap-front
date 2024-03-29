import {
  FILTER_MODE_OR,
  FILTER_OPER_LIKE,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
  FILTER_TYPE_GROUP,
  FILTER_TYPE_ELEM,
  FILTER_SEARCH_NONE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_BETWEEN,
} from './';

/**
 * Manage filters
 */
export default class Filter {
  constructor() {
    this.data = {
      operator: FILTER_OPER_LIKE,
      mode: FILTER_MODE_OR,
      origs: [],
      filters: [],
      filter: FILTER_TYPE_GROUP,
      filter_name: '',
      filter_fixed: false,
      filter_default: false,
      filter_enable: true,
      filter_crits: {},
      search: FILTER_SEARCH_NONE,
    };
    this.init();
  }

  init(mode = FILTER_MODE_OR, operator = FILTER_OPER_LIKE) {
    this.data.mode = mode;
    this.data.operator = operator;
    this.data.filters = [];
  }

  setOperator(oper, all = true) {
    this.data.operator = oper;
    if (all) {
      this.data.filters.forEach(elt => {
        elt.setOperator(oper);
      });
    }
  }

  getOperator() {
    if (this.data.operator !== false) {
      return this.data.operator;
    }
    return FILTER_OPER_LIKE;
  }

  isFixed() {
    return this.data.filter_fixed;
  }

  isDefault() {
    return this.data.filter_default;
  }

  isEnable() {
    return this.data.filter_enable;
  }

  setMode(mode) {
    this.data.mode = mode;
  }

  getMode() {
    return this.data.mode;
  }

  setDefault(def = true) {
    this.data.filter_default = def;
  }

  setEnable(ena = true) {
    this.data.filter_enable = ena;
  }

  setFilterName(name, fixed = false, def = false, enable = true) {
    this.data.filter_name = name;
    this.data.filter_fixed = fixed;
    this.data.filter_default = def;
    this.data.filter_enable = enable;
    this.data.filter = FILTER_TYPE_ELEM;
  }

  getFilterName() {
    return this.data.filter_name;
  }

  removeFilterCrit(action) {
    let newCrits = this.data.filter_crits;
    delete newCrits[action];
    this.data.filter_crits = newCrits;
  }

  setFilterCrit(value, oper = false, action = 'default') {
    if (oper !== false) {
      this.data.operator = oper;
    }
    let locAction = action || 'default';
    if (locAction === false || locAction === '') {
      locAction = 'default';
    }
    switch (locAction) {
      case 'between':
        this.data.filter_crits.between = value;
        break;
      default:
        this.data.filter_crits[action] = value;
        break;
    }
  }

  getFilterCrit(action = 'default') {
    switch (action) {
      case 'between':
        if (typeof this.data.filter_crits.between !== 'undefined') {
          return this.data.filter_crits.between;
        }
        break;
      default:
        if (typeof this.data.filter_crits.default !== 'undefined') {
          return this.data.filter_crits.default;
        }
        break;
    }
    return null;
  }

  getFilterCrits() {
    return this.data.filter_crits;
  }

  setSearch(search) {
    this.data.search = search;
  }

  getSearch() {
    return this.data.search;
  }

  checkFilters() {
    let filters = [];
    this.data.filters.forEach(elt => {
      let add = false;
      if (elt && elt.data && (elt.data.operator === FILTER_OPER_EMPTY || elt.data.operator === FILTER_OPER_NOT_EMPTY)) {
        add = true;
      } else {
        const crits3 = elt.getFilterCrits();
        Object.keys(crits3).forEach(key => {
          if (crits3[key] !== '') {
            add = true;
          }
        });
      }
      if (add) {
        filters.push(elt);
      }
    });
    this.data.filters = filters;
  }

  addFilter(name, value, oper = false, fixed = false, def = false, enable = true) {
    let elem = this.data.filters.find(elt => elt.getFilterName() === name);
    if (elem) {
      elem.setFilterCrit(value, oper);
    } else {
      if (oper === false) {
        oper = this.data.operator;
      }
      let elt2 = new Filter();
      elt2.setFilterName(name, fixed, def, enable);
      elt2.setFilterCrit(value, oper);
      this.data.filters.push(elt2);
    }
    this.checkFilters();
  }

  updateFilter(name, value, action = "default") {
    let elem = this.data.filters.find(elt => elt.getFilterName() === name);
    if (elem) {
      elem.setFilterCrit(value, false, action);
    }
  }

  removeFilter(name, action = 'default') {
    let elem = this.data.filters.find(elt => elt.getFilterName() === name);
    if (elem) {
      if (action === 'default') {
        this.data.filters = this.data.filters.filter(elt => elt.getFilterName() !== name)
      } else {
        elem.removeFilterCrit(action);
      }
    }
  }

  updateFilterOperator(name, oper = false) {
    let elem = this.data.filters.find(elt => elt.getFilterName() === name);
    if (elem) {
      elem.setOperator(oper);
    } else {
      let elt2 = new Filter();
      elt2.setFilterName(name);
      if (oper !== false) {
        elt2.setOperator(oper);
      }
      this.data.filters.push(elt2);
    }
  }

  findFirst(name) {
    return this.data.filters.find(elt => elt.getFilterName() === name && elt.isEnable());
  }

  asJsonApiObject() {
    let params = {};
    let crits = {};
    let fixed = {};
    if (this.data.filters.length > 0) {
      params.filter = {};
      this.data.filters.forEach(elt => {
        let crits2 = [];
        if (elt.getOperator() === 'empty' || elt.getOperator() === 'nempty') {
          crits2[elt.getOperator()] = null;
        } else {
          switch (elt.getOperator()) {
            case FILTER_OPER_BETWEEN:
              const b1 = elt.getFilterCrit('default');
              const b2 = elt.getFilterCrit('between');
              crits2[elt.getOperator()] = [b1, b2];
              break;
            default:
              crits2[elt.getOperator()] = '';
              const crits = elt.getFilterCrits();
              const keys = Object.keys(crits);
              let first = true;
              keys.forEach(oneKey => {
                if (!first) {
                  crits2[elt.getOperator()] += ',';
                }
                crits2[elt.getOperator()] += crits[oneKey];
                first = false;
              })
              break;
          }
        }
        if (elt.isEnable()) {
          if (elt.isFixed() || elt.isDefault()) {
            fixed[elt.getFilterName()] = crits2;
          } else {
            crits[elt.getFilterName()] = crits2;
          }
        }
      });
      if (fixed !== {}) {
        if (this.data.mode === FILTER_MODE_OR) {
          params.filter = {
            and: {
              or: crits,
            },
            ...fixed,
          };
        } else {
          params.filter.and = { ...crits, ...fixed };
        }
      } else {
        if (this.data.mode === FILTER_MODE_OR) {
          params.filter.or = crits;
        } else {
          params.filter.and = crits;
        }
      }
    }
    return params;
  }

  clone() {
    let newFilter = new Filter();
    const datas = this.data;
    newFilter.data = { ...datas };
    return newFilter;
  }

  isEmpty() {
    let empty = true;
    if (this.data.filters.length > 0) {
      const found = this.data.filters.find(elem => elem.isFixed() === false && elem.isEnable() === true);
      if (found) {
        empty = false;
      }
    }
    return empty;
  }

  isDefaultOnly() {
    let defaultEnableOnly = false;
    if (this.data.filters.length > 0) {
      if (this.data.filters.find(elem => elem.isDefault() === true)) {
        defaultEnableOnly = true;
        const found = this.data.filters.find(
          elem =>
            elem.isFixed() === false &&
            (elem.isDefault() === false || (elem.isDefault() === true && elem.isEnable() === false))
        );
        if (found) {
          defaultEnableOnly = false;
        }
      }
    }
    return defaultEnableOnly;
  }

  isDefaultExist() {
    let filterDefault = false;
    if (this.data.filters.length > 0) {
      const found = this.data.filters.find(elem => elem.isDefault() === true);
      if (found) {
        filterDefault = true;
      }
    }
    return filterDefault;
  }

  disableDefaults() {
    let filters = this.data.filters || [];
    filters.forEach(elem => {
      if (elem.isDefault()) {
        elem.setEnable(false);
        elem.disableDefaults();
      }
    });
  }

  enableDefaults() {
    const filters = this.data.filters || [];
    filters.forEach(elem => {
      if (elem.isDefault()) {
        elem.setEnable(true);
        elem.enableDefaults();
      }
    });
  }

  addConditions(conditions, all = true) {
    if (Array.isArray(conditions)) {
      conditions.forEach(cond => {
        const fixed = cond.hasOwnProperty('fixed') ? cond.fixed : true;
        const name  = cond.name || cond.field;
        const oper  = cond.oper || FILTER_OPER_EQUAL;
        const value = cond.hasOwnProperty('value') ? cond.value : null;
        if (name && (all || fixed)) {
          this.addFilter(name, value, oper, fixed);
        }
      });
    }
  }

}

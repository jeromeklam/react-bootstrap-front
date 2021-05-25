import {
  FILTER_MODE_OR,
  FILTER_OPER_LIKE,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
  FILTER_TYPE_GROUP,
  FILTER_TYPE_ELEM,
  FILTER_SEARCH_NONE,
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
      filter_crits: [],
      search: FILTER_SEARCH_NONE,
    };
    this.init();
  }

  init(mode = FILTER_MODE_OR, operator = FILTER_OPER_LIKE) {
    const { origs } = this.data || [];
    let newFilters = [];
    origs.forEach(elem => {
      if (elem.isFixed() || (elem.isDefault() && elem.isEnable())) {
        newFilters.push(elem);
      }
    });
    this.data.mode = mode;
    this.data.operator = operator;
    this.data.filters = newFilters;
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

  setFilterCrit(value, oper = false) {
    if (oper !== false) {
      this.data.operator = oper;
    }
    this.data.filter_crits.default = value;
  }

  getFilterCrit() {
    return this.data.filter_crits.default || null;
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
      let elt2 = new Filter();
      elt2.setFilterName(name, fixed, def, enable);
      elt2.setFilterCrit(value, oper);
      this.data.filters.push(elt2);
    }
    if (fixed || def) {
      let elem = this.data.origs.find(elt => elt.getFilterName() === name);
      if (elem) {
        elem.setFilterCrit(value, oper);
      } else {
        let elt2 = new Filter();
        elt2.setFilterName(name, fixed, def, enable);
        elt2.setFilterCrit(value, oper);
        this.data.origs.push(elt2);
      }
    }
    this.checkFilters();
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
        const crits3 = elt.getFilterCrits();
        Object.keys(crits3).forEach(key => {
          if (crits3[key] === null || crits3[key] === '') {
            if (elt.getOperator() === 'empty' || elt.getOperator() === 'nempty') {
              crits2[elt.getOperator()] = crits3[key];
            }
          } else {
            crits2[elt.getOperator()] = crits3[key];
          }
        });
        if (crits2 === []) {
          if (elt.getOperator() === 'empty' || elt.getOperator() === 'nempty') {
            crits2[elt.getOperator()] = null;
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
    if (this.data.origs.length > 0) {
      const found = this.data.origs.find(elem => elem.isDefault() === true);
      if (found) {
        filterDefault = true;
      }
    }
    return filterDefault;
  }

  disableDefaults() {
    const { origs } = this.data || [];
    origs.forEach(elem => {
      if (elem.isDefault()) {
        elem.setEnable(false);
      }
    });
  }

  enableDefaults() {
    const { origs } = this.data || [];
    origs.forEach(elem => {
      if (elem.isDefault()) {
        elem.setEnable(true);
      }
    });
  }
}

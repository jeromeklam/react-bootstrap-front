import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Chip } from '../basic';
import { FILTER_OPER_EMPTY, FILTER_OPER_NOT_EMPTY, FILTER_OPER_BETWEEN, FILTER_OPER_GREATER_OR_EQUAL, FILTER_OPER_LOWER_OR_EQUAL, FILTER_OPER_IN } from '../filter';
import { rbfIntl } from '../intl';
import { fieldOwning, fieldsForFacets, findField } from './catalog';
import { formatValue } from './filterToSentence';
import { isRangeField } from './criteria';
import { tr } from './i18n';
import FacetPopover from './FacetPopover';

/**
 * La rangée de pastilles sous le titre d'une liste : les critères actifs (avec ×),
 * les facettes (avec chevron, qui ouvrent leur menu), « + Critère » et « Tout
 * effacer ». Lit le Filter, ne le modifie jamais : chaque action rend un nouveau
 * Filter par onChange.
 *
 * Un champ à `facet` est représenté par sa pastille de facette (compteur quand il
 * porte des valeurs) ; les autres critères par une pastille active. Les critères
 * du groupe `quickGroup` (la recherche rapide) forment une seule pastille.
 */
export default class SearchChipBar extends Component {
  static propTypes = {
    filter: PropTypes.object.isRequired,
    catalog: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    facets: PropTypes.array,
    onAddCriterion: PropTypes.func,
    onClearAll: PropTypes.func,
    showDefaults: PropTypes.bool,
    quickGroup: PropTypes.string,
    wrap: PropTypes.bool,
    icons: PropTypes.object,
    className: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    facets: null,
    onAddCriterion: null,
    onClearAll: null,
    showDefaults: false,
    quickGroup: 'quick',
    wrap: true,
    icons: {},
    className: '',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = { open: null };
    this.refsByName = {};
    this.onClearAll = this.onClearAll.bind(this);
  }

  anchor(name) {
    if (!this.refsByName[name]) {
      this.refsByName[name] = React.createRef();
    }
    return this.refsByName[name];
  }

  facetFields() {
    const { catalog, facets } = this.props;
    if (Array.isArray(facets)) {
      return facets.map(name => findField(catalog, name)).filter(Boolean);
    }
    return fieldsForFacets(catalog);
  }

  /* Un nouveau Filter, modifié par fn, remis à l'application. */
  change(fn) {
    const next = this.props.filter.clone();
    fn(next);
    this.props.onChange(next);
  }

  onClearAll() {
    this.change(next => next.removeAll());
    if (this.props.onClearAll) {
      this.props.onClearAll();
    }
  }

  remove(field, name) {
    this.change(next => {
      if (field && field.virtual && typeof field.toFilter === 'function') {
        field.toFilter('', next, field);
      } else {
        next.removeFilter(name);
      }
    });
  }

  facetValue(field) {
    const elt = this.props.filter.findFirst(field.name);
    if (!elt) {
      return [];
    }
    if (isRangeField(field) || (field.facet && field.facet.kind === 'range')) {
      const first = elt.getFilterCrit('default');
      switch (elt.getOperator()) {
        case FILTER_OPER_BETWEEN:
          return [first || '', elt.getFilterCrit('between') || ''];
        case FILTER_OPER_LOWER_OR_EQUAL:
          return ['', first || ''];
        default:
          return [first || '', ''];
      }
    }
    return elt.getValues();
  }

  applyFacet(field, value) {
    this.change(next => {
      if (field.facet && field.facet.kind === 'range') {
        const [from, to] = Array.isArray(value) ? value : ['', ''];
        next.setFilterRange(field.name, from, to);
      } else {
        next.setFilterValues(field.name, Array.isArray(value) ? value : [value], field.multiOperator === 'in' ? FILTER_OPER_IN : 'eq');
      }
    });
    this.setState({ open: null });
  }

  /* Le texte d'une pastille active : « Ville : Metz », « Paiement : 01/01/2025 – 31/12/2025 ». */
  chipText(field, elt, t) {
    if (field && field.virtual) {
      const value = typeof field.fromFilter === 'function' ? field.fromFilter(this.props.filter, field) : '';
      const text = typeof field.toText === 'function' ? field.toText(value, field, t) : '';
      return `${field.label} : ${Array.isArray(text) ? text.map(p => p.text).join('') : text || value}`;
    }
    const label = field ? field.label : elt.getFilterName();
    const oper = elt.getOperator();
    const format = v => (field ? formatValue(field, v, t) : String(v));
    if (oper === FILTER_OPER_EMPTY) {
      return `${label} : ${tr(t, 'rbf.search.chip.empty', 'vide')}`;
    }
    if (oper === FILTER_OPER_NOT_EMPTY) {
      return `${label} : ${tr(t, 'rbf.search.chip.filled', 'renseigné')}`;
    }
    if (oper === FILTER_OPER_BETWEEN) {
      return `${label} : ${format(elt.getFilterCrit('default'))} – ${format(elt.getFilterCrit('between'))}`;
    }
    if (oper === FILTER_OPER_GREATER_OR_EQUAL) {
      return `${label} : ≥ ${format(elt.getFilterCrit('default'))}`;
    }
    if (oper === FILTER_OPER_LOWER_OR_EQUAL) {
      return `${label} : ≤ ${format(elt.getFilterCrit('default'))}`;
    }
    return `${label} : ${elt.getValues().map(format).join(', ')}`;
  }

  render() {
    const { filter, catalog, onAddCriterion, showDefaults, quickGroup, wrap, icons, className, t } = this.props;
    /* Sur une ligne (bandeau d'en-tête) : pas de marge basse, défilement horizontal. */
    const chipClass = wrap ? 'mr-2 mb-2' : 'mr-2';
    const facetFields = this.facetFields();
    const facetNames = facetFields.map(f => f.name);
    const chips = [];
    const seen = new Set();
    let quick = null;
    filter.getFilters({ fixed: false, default: showDefaults }).forEach(elt => {
      const name = elt.getFilterName();
      if (quickGroup && elt.getGroup() === quickGroup) {
        quick = quick || elt.getValues()[0];
        return;
      }
      const field = fieldOwning(catalog, name);
      if (field && facetNames.includes(field.name)) {
        return;
      }
      const key = field ? field.name : name;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      chips.push(
        <Chip
          key={`crit-${key}`}
          variant="active"
          className={chipClass}
          label={this.chipText(field, elt, t)}
          removeIcon={icons.close || null}
          onRemove={() => this.remove(field, name)}
          t={t}
        />
      );
    });
    const empty = filter.isEmpty() && quick === null;
    return (
      <div className={classnames('rbf-chip-bar d-flex align-items-center', wrap ? 'flex-wrap' : 'flex-nowrap rbf-chip-bar-line', className)}>
        {quick !== null && (
          <Chip
            key="quick"
            variant="active"
            className={chipClass}
            label={`${tr(t, 'rbf.search.chip.quick', 'Recherche')} : ${quick}`}
            removeIcon={icons.close || null}
            onRemove={() => this.change(next => next.removeGroup(quickGroup))}
            t={t}
          />
        )}
        {chips}
        {facetFields.map(field => {
          const value = this.facetValue(field);
          const count = value.filter(v => v !== null && typeof v !== 'undefined' && v !== '').length;
          const open = this.state.open === field.name;
          return (
            <span key={`facet-${field.name}`} className="rbf-chip-bar-facet">
              <Chip
                ref={this.anchor(field.name)}
                variant="facet"
                className={chipClass}
                label={field.label}
                count={count}
                active={open}
                caretIcon={icons.caret || null}
                onClick={() => this.setState({ open: open ? null : field.name })}
                t={t}
              />
              {open && (
                <FacetPopover
                  field={field}
                  value={value}
                  myRef={this.anchor(field.name)}
                  icons={icons}
                  onApply={next => this.applyFacet(field, next)}
                  onClose={() => this.setState({ open: null })}
                  t={t}
                />
              )}
            </span>
          );
        })}
        {onAddCriterion && (
          <Chip
            key="add"
            variant="add"
            className={chipClass}
            label={
              <span>
                {icons.add}
                {icons.add ? ' ' : ''}
                {tr(t, 'rbf.search.chip.add', 'Critère')}
              </span>
            }
            onClick={onAddCriterion}
            t={t}
          />
        )}
        {!empty && (
          <button type="button" className={classnames('btn btn-link btn-sm rbf-chip-bar-clear text-nowrap', wrap && 'mb-2')} onClick={this.onClearAll}>
            {tr(t, 'rbf.search.clearAll', 'Tout effacer')}
          </button>
        )}
      </div>
    );
  }
}

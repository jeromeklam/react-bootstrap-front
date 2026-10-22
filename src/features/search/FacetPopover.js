import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown, InputDateRange, InputAmountRange } from '../basic';
import { rbfIntl } from '../intl';
import { tr } from './i18n';

/**
 * Le menu d'une facette : une liste à cocher filtrable (ou une plage), un
 * compteur et « Appliquer ». Posé dans le Dropdown de la bibliothèque, ancré sur
 * la pastille (myRef). Les cases sont des custom-checkbox Bootstrap. Rien n'est
 * émis avant « Appliquer » (ou Entrée dans le champ de filtre) ; Échap ou un clic
 * à l'extérieur ferment sans appliquer.
 */
const fold = text =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export default class FacetPopover extends Component {
  static propTypes = {
    field: PropTypes.object.isRequired,
    value: PropTypes.array,
    onApply: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    myRef: PropTypes.object.isRequired,
    align: PropTypes.string,
    maxHeight: PropTypes.number,
    width: PropTypes.string,
    searchable: PropTypes.bool,
    searchFrom: PropTypes.number,
    showCounts: PropTypes.bool,
    icons: PropTypes.object,
    t: PropTypes.func,
  };

  static defaultProps = {
    value: [],
    align: 'bottom-left',
    maxHeight: 360,
    width: '18rem',
    searchable: null,
    searchFrom: 8,
    showCounts: false,
    icons: {},
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = { draft: Array.isArray(props.value) ? [...props.value] : [], query: '', showEnded: false };
    this.onQuery = this.onQuery.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onRange = this.onRange.bind(this);
  }

  kind() {
    const { field } = this.props;
    return field.facet && field.facet.kind === 'range' ? 'range' : 'options';
  }

  /* Les options terminées (ended) non choisies, masquées tant que le lien n'est pas activé. */
  hiddenEnded() {
    const selected = this.state.draft.map(String);
    return (this.props.field.options || []).filter(option => option.ended && !selected.includes(String(option.value)));
  }

  options() {
    const { field } = this.props;
    const { query, showEnded } = this.state;
    let options = field.options || [];
    if (!showEnded) {
      const hidden = this.hiddenEnded();
      options = options.filter(option => !hidden.includes(option));
    }
    if (!query) {
      return options;
    }
    const needle = fold(query);
    return options.filter(option => fold(option.label).includes(needle));
  }

  isSearchable() {
    const { searchable, searchFrom, field } = this.props;
    if (searchable !== null) {
      return searchable;
    }
    return (field.options || []).length >= searchFrom;
  }

  toggle(option) {
    const { field } = this.props;
    const key = String(option.value);
    const selected = this.state.draft.map(String).includes(key);
    let draft;
    if (selected) {
      draft = this.state.draft.filter(v => String(v) !== key);
    } else if (field.multiple === false) {
      draft = [option.value];
    } else {
      draft = [...this.state.draft, option.value];
    }
    this.setState({ draft });
  }

  onQuery(event) {
    this.setState({ query: event.target.value });
  }

  onRange(event) {
    this.setState({ draft: event.target.value });
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.onClose();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onApply();
    }
  }

  onApply() {
    this.props.onApply(this.state.draft);
  }

  count() {
    const { field, t } = this.props;
    const n = this.state.draft.filter(v => v !== null && typeof v !== 'undefined' && v !== '').length;
    if (field.facet && typeof field.facet.countLabel === 'function') {
      return field.facet.countLabel(n, field);
    }
    return tr(t, 'rbf.search.facet.count', '{n} sélectionnée(s)', { n });
  }

  renderOptions() {
    const { field, showCounts, t } = this.props;
    const selected = this.state.draft.map(String);
    const options = this.options();
    return (
      <div>
        {this.isSearchable() && (
          <input
            type="text"
            className="form-control form-control-sm border-rbf mb-2"
            placeholder={tr(t, 'rbf.search.facet.filter', 'Filtrer…')}
            value={this.state.query}
            onChange={this.onQuery}
            autoFocus
          />
        )}
        <div className="rbf-facet-popover-list custom-scrollbar">
          {options.length === 0 && <div className="text-muted small">{tr(t, 'rbf.search.facet.none', 'Aucune valeur')}</div>}
          {options.map(option => {
            const id = `rbf-facet-${field.name}-${String(option.value)}`.replace(/[^a-zA-Z0-9_-]/g, '_');
            return (
              <div key={String(option.value)} className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={id}
                  checked={selected.includes(String(option.value))}
                  onChange={() => this.toggle(option)}
                />
                <label className="custom-control-label" htmlFor={id}>
                  {option.label}
                  {option.ended && <span className="text-muted ml-1">{tr(t, 'rbf.search.ended.suffix', '(terminé)')}</span>}
                  {showCounts && typeof option.count === 'number' && <span className="text-muted ml-1">({option.count})</span>}
                </label>
              </div>
            );
          })}
        </div>
        {this.hiddenEnded().length > 0 && (
          <button type="button" className="btn btn-link btn-sm p-0 mt-1 rbf-facet-popover-ended" onClick={() => this.setState({ showEnded: !this.state.showEnded })}>
            {this.state.showEnded
              ? tr(t, 'rbf.search.ended.hide', 'Masquer les terminés')
              : tr(t, 'rbf.search.ended.show', 'Afficher aussi les {n} terminé(s)', { n: this.hiddenEnded().length })}
          </button>
        )}
      </div>
    );
  }

  renderRange() {
    const { field, icons } = this.props;
    const value = Array.isArray(this.state.draft) ? this.state.draft : ['', ''];
    if (field.type === 'monetary' || field.type === 'number') {
      return <InputAmountRange name={field.name} value={value} unit={field.type === 'number' ? '' : field.unit || '€'} onChange={this.onRange} />;
    }
    return <InputDateRange name={field.name} value={value} calIcon={icons.calendar} delIcon={icons.clear} onChange={this.onRange} />;
  }

  render() {
    const { field, myRef, align, maxHeight, width, onClose, t } = this.props;
    const range = this.kind() === 'range';
    return (
      <Dropdown myRef={myRef} align={align} maxHeight={`${maxHeight}px`} onClose={onClose} className="rbf-facet-popover">
        <div
          className={classnames('rbf-facet-popover-body bg-white border border-secondary-light rounded shadow-sm p-2', range && 'rbf-facet-popover-range')}
          role="dialog"
          aria-label={field.label}
          style={{ width: range ? 'auto' : width, minWidth: width }}
          onKeyDown={this.onKeyDown}
        >
          {range ? this.renderRange() : this.renderOptions()}
          <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
            <small className="text-muted">{range ? '' : this.count()}</small>
            <button type="button" className="btn btn-sm btn-primary" onClick={this.onApply}>
              {tr(t, 'rbf.search.facet.apply', 'Appliquer')}
            </button>
          </div>
        </div>
      </Dropdown>
    );
  }
}

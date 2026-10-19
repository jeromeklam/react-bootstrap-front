import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '../advanced';
import { FILTER_MODE_AND } from '../filter';
import { rbfIntl } from '../intl';
import { filterToCriteria, criteriaToFilter } from './criteria';
import { tr } from './i18n';
import SearchCriteriaBuilder from './SearchCriteriaBuilder';
import SearchSummary from './SearchSummary';

/**
 * Le tiroir « Critères avancés » : le constructeur de critères, l'encart « EN
 * CLAIR » recalculé en direct, « Tout effacer » et « Appliquer ». Les lignes sont
 * dérivées du filtre à l'ouverture (et seulement là) ; « Appliquer » rend un
 * nouveau Filter par onApply, les fixes, défauts et recherche rapide conservés.
 * Extensible par le bouton du tiroir (largeur mémorisée sous storageKey).
 */
export default class SearchDrawer extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired,
    catalog: PropTypes.array.isRequired,
    onApply: PropTypes.func.isRequired,
    onClearAll: PropTypes.func,
    title: PropTypes.string,
    subject: PropTypes.string,
    sentenceSubject: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    expandedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    storageKey: PropTypes.string,
    top: PropTypes.number,
    showSummary: PropTypes.bool,
    modeToggle: PropTypes.bool,
    maxRows: PropTypes.number,
    icons: PropTypes.object,
    size: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    onClearAll: null,
    title: null,
    subject: null,
    sentenceSubject: null,
    width: 560,
    expandedWidth: '85vw',
    storageKey: null,
    top: 0,
    showSummary: true,
    modeToggle: true,
    maxRows: null,
    icons: {},
    size: 'sm',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = this.derive(props);
    this.onRowsChange = this.onRowsChange.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  componentDidUpdate(prevProps) {
    /* À l'ouverture seulement : un re-rendu du parent ne doit pas écraser le brouillon. */
    if (!prevProps.open && this.props.open) {
      this.setState(this.derive(this.props));
    }
  }

  derive(props) {
    return {
      rows: props.open ? filterToCriteria(props.filter, props.catalog) : [],
      mode: props.filter && typeof props.filter.getMode === 'function' ? props.filter.getMode() : FILTER_MODE_AND,
    };
  }

  draft() {
    return criteriaToFilter(this.state.rows, this.state.mode, this.props.catalog, this.props.filter);
  }

  onRowsChange(rows) {
    this.setState({ rows });
  }

  onModeChange(mode) {
    this.setState({ mode });
  }

  onApply() {
    this.props.onApply(this.draft());
  }

  onClear() {
    this.setState({ rows: [] });
    if (this.props.onClearAll) {
      this.props.onClearAll();
    }
  }

  render() {
    const { open, onClose, catalog, title, subject, sentenceSubject, width, expandedWidth, storageKey, top, showSummary, modeToggle, maxRows, icons, size, t } = this.props;
    const footer = (
      <div className="d-flex align-items-center justify-content-end">
        <button type="button" className="btn btn-link btn-sm mr-2 rbf-search-drawer-clear" onClick={this.onClear}>
          {tr(t, 'rbf.search.clearAll', 'Tout effacer')}
        </button>
        <button type="button" className="btn btn-primary rbf-search-drawer-apply" onClick={this.onApply}>
          {tr(t, 'rbf.search.drawer.apply', 'Appliquer')}
        </button>
      </div>
    );
    return (
      <Drawer
        open={open}
        onClose={onClose}
        title={title || tr(t, 'rbf.search.drawer.title', 'Critères avancés')}
        width={width}
        expandedWidth={expandedWidth}
        storageKey={storageKey}
        top={top}
        closeIcon={icons.close}
        expandIcon={icons.expand}
        collapseIcon={icons.collapse}
        footer={footer}
        className="rbf-search-drawer"
        t={t}
      >
        <SearchCriteriaBuilder
          catalog={catalog}
          rows={this.state.rows}
          mode={this.state.mode}
          onRowsChange={this.onRowsChange}
          onModeChange={this.onModeChange}
          modeToggle={modeToggle}
          subject={subject}
          maxRows={maxRows}
          icons={icons}
          size={size}
          t={t}
        />
        {showSummary && open && <SearchSummary className="mt-3" filter={this.draft()} catalog={catalog} subject={sentenceSubject} t={t} />}
      </Drawer>
    );
  }
}

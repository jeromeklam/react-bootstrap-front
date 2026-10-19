import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FILTER_MODE_AND } from '../filter';
import { rbfIntl } from '../intl';
import { filterToCriteria, criteriaToFilter } from './criteria';
import { tr } from './i18n';
import SearchCriteriaBuilder from './SearchCriteriaBuilder';
import SearchSummary from './SearchSummary';

/**
 * Le panneau « Critères avancés » : le constructeur de critères, l'encart « EN
 * CLAIR » recalculé en direct, « Tout effacer » et « Appliquer » en pied collant.
 * Il vit où l'application le pose : le panneau droit de la page, ou le tiroir
 * SearchDrawer.
 *
 * Les lignes sont dérivées du filtre au montage, puis chaque fois que le filtre
 * reçu change d'identité (un nouveau Filter posé par la liste : pastille retirée,
 * recherche rapide, Appliquer) ; un simple re-rendu du parent n'écrase pas le
 * brouillon. « Appliquer » rend un nouveau Filter par onApply, les fixes, défauts
 * et recherche rapide conservés.
 */
export default class SearchCriteriaPanel extends Component {
  static propTypes = {
    filter: PropTypes.object.isRequired,
    catalog: PropTypes.array.isRequired,
    onApply: PropTypes.func.isRequired,
    onClearAll: PropTypes.func,
    title: PropTypes.node,
    subject: PropTypes.string,
    sentenceSubject: PropTypes.string,
    showSummary: PropTypes.bool,
    modeToggle: PropTypes.bool,
    maxRows: PropTypes.number,
    icons: PropTypes.object,
    size: PropTypes.string,
    className: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    onClearAll: null,
    title: null,
    subject: null,
    sentenceSubject: null,
    showSummary: true,
    modeToggle: true,
    maxRows: null,
    icons: {},
    size: 'sm',
    className: '',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = SearchCriteriaPanel.derive(props);
    this.onRowsChange = this.onRowsChange.bind(this);
    this.onModeChange = this.onModeChange.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  static derive(props) {
    return {
      rows: filterToCriteria(props.filter, props.catalog),
      mode: props.filter && typeof props.filter.getMode === 'function' ? props.filter.getMode() : FILTER_MODE_AND,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter !== this.props.filter) {
      this.setState(SearchCriteriaPanel.derive(this.props));
    }
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
    const { catalog, title, subject, sentenceSubject, showSummary, modeToggle, maxRows, icons, size, className, t } = this.props;
    return (
      <div className={classnames('rbf-criteria-panel', className)}>
        {title && <div className="rbf-criteria-panel-title h5 text-secondary mb-3">{title}</div>}
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
        {showSummary && <SearchSummary className="mt-3" filter={this.draft()} catalog={catalog} subject={sentenceSubject} t={t} />}
        <div className="rbf-criteria-panel-footer d-flex align-items-center justify-content-end border-top border-secondary-light bg-white py-2 mt-3">
          <button type="button" className="btn btn-link btn-sm mr-2 rbf-search-drawer-clear" onClick={this.onClear}>
            {tr(t, 'rbf.search.clearAll', 'Tout effacer')}
          </button>
          <button type="button" className="btn btn-primary rbf-search-drawer-apply" onClick={this.onApply}>
            {tr(t, 'rbf.search.drawer.apply', 'Appliquer')}
          </button>
        </div>
      </div>
    );
  }
}

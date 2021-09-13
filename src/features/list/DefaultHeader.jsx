import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Highlight } from '../tour';
import { Dropdown } from '../basic';
import { SortPanel, sortToLocal, validSort } from '../sort';
import { rbfIntl } from '../intl';

const titlestyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  paddingLeft: '5px',
  paddingRight: '10px',
};

const iconstyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  paddingLeft: '5px',
  paddingRight: '10px',
  display: 'inline-flex',
  height: '26px',
  verticalAlign: 'middle',
};

const sortStyle = {
  fontSize: '0.8rem',
  fontWeight: 'normal',
  paddingLeft: '5px',
  paddingRight: '10px',
  display: 'inline-block',
  lineHeight: '1',
};

const counterStyle = {
  fontSize: '0.9rem',
};

const mystyle = {
  top: '0px',
  left: '0px',
  position: 'absolute',
  right: '0px',
  zIndex: '700',
  height: '50px',
  lineHeight: '50px',
  vertical1lign: 'middle',
  paddingRight: '5px',
};

const sortToText = (sort, cols) => {
  let text = 'Aucun tri';
  if (sort) {
    text = '';
    sort.forEach(elem => {
      const found = cols.find(elem2 => elem2.col === elem.col);
      if (found) {
        let way = '+';
        if (elem.way === 'down') {
          way = '-';
        }
        text = `${text} ${found.label}(${way})`;
      }
    });
  }
  return text;
};

export default class DefaultHeader extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    counter: PropTypes.element,
    filterIcon: PropTypes.element,
    globalActions: PropTypes.element,
    headerBackgroundTheme: PropTypes.string,
    headerTextTheme: PropTypes.string,
    title: PropTypes.string.isRequired,
    onToggleFilter: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func,
    onClearFiltersDefault: PropTypes.func,
    onFilters: PropTypes.func,
    quickSearch: PropTypes.element,
    selected: PropTypes.element,
    selectMenu: PropTypes.element,
    sort: PropTypes.element,
    t: PropTypes.func,
  };

  static defaultProps = {
    counter: null,
    filterIcon: null,
    globalActions: [],
    headerBackgroundTheme: 'light',
    headerTextTheme: 'secondary',
    onClearFilters: null,
    onClearFiltersDefault: null,
    onFilters: null,
    quickSearch: '',
    selected: null,
    selectMenu: null,
    sort: {},
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef(),
      mySortRef: React.createRef(),
      myModeRef: React.createRef(),
      show: false,
      sortMenu: false,
      modeMenu: false,
      sort: sortToLocal(props.cols, props.sort),
    };
    this.onToggle = this.onToggle.bind(this);
    this.onToggleSortMenu = this.onToggleSortMenu.bind(this);
    this.onToggleModeMenu = this.onToggleModeMenu.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
  }

  onToggle() {
    this.setState({ show: !this.state.show });
  }

  onToggleSortMenu() {
    this.setState({ sortMenu: !this.state.sortMenu });
  }

  onToggleModeMenu(mode = '') {
    //console.log('JKJK', mode);
    if (mode !== '') {
      this.setState({ modeMenu: false });
      this.props.onSelectView(mode);
    } else {
      this.setState({ modeMenu: !this.state.modeMenu });
    }
  }

  onSortChange(obj) {
    this.setState({ sort: obj.sort });
  }

  render() {
    let filterMenuIcon = this.props.filterFullIcon;
    let filterButtonIcon = {};
    let filterButtonTitle = '';
    let filterButtonAction = {};
    let showFilterButton = false;
    if (this.props.filters) {
      if (this.props.filters.isEmpty()) {
        filterMenuIcon = this.props.filterEmptyIcon;
        if (this.props.filters.isDefaultExist()) {
          showFilterButton = true;
          filterButtonIcon = this.props.filterDefaultIcon;
          filterButtonTitle = this.props.t({
            id: 'rbf.list.header.filter.setDefaultFilter',
            defaultMessage: 'Set default filters',
          });
          filterButtonAction = this.props.onClearFilters;
        }
      } else {
        showFilterButton = true;
        if (this.props.filters.isDefaultOnly()) {
          filterButtonIcon = this.props.filterClearDefaultIcon;
          filterButtonTitle = this.props.t({
            id: 'rbf.list.header.filter.removeDefaultFilter',
            defaultMessage: 'Remove default filters',
          });
          filterButtonAction = this.props.onClearFiltersDefault;
        } else {
          filterButtonIcon = this.props.filterClearIcon;
          filterButtonAction = this.props.onClearFilters;
          if (this.props.filters.isDefaultExist()) {
            filterButtonTitle = this.props.t({
              id: 'rbf.list.header.filter.removeCustomFilter',
              defaultMessage: 'Remove custom filters',
            });
          } else {
            filterButtonTitle = this.props.t({
              id: 'rbf.list.header.filter.removeAllFilter',
              defaultMessage: 'Remove all filters',
            });
          }
        }
      }
    }
    const selectable = this.props.cols && this.props.cols.findIndex(oneCol => oneCol.selectable === true) >= 0;
    return (
      <div
        style={mystyle}
        className={classnames(
          'default-list-header text-secondary overflow-hidden',
          this.props.className,
          'bg-' + this.props.headerBackgroundTheme,
          'text' + this.props.headerTextTheme
        )}
      >
        <div className="row">
          <div className="col-xxs-w28">
            <div className="pl-2" style={{ display: 'inline-block', float: 'left' }}>
              <span style={iconstyle} className={classnames('no-selector', 'text-' + this.props.headerTextTheme)}>
                {this.props.icon && this.props.icon}
              </span>
            </div>
            <div className="pl-2" style={{ display: 'inline-block', float: 'left' }}>
              <span style={titlestyle} className={classnames('no-selector', 'text-' + this.props.headerTextTheme)}>
                {this.props.title}
              </span>
            </div>
            {this.props.counter && (
              <div className="pl-2" style={{ display: 'inline-block', float: 'left' }}>
                <Highlight
                  position="bottom"
                  theme="LIST"
                  title={this.props.t({ id: 'rbf.list.header.counter.help', defaultMessage: 'Pagination' })}
                >
                  <span className="default-list-header-counter no-selector" style={counterStyle}>
                    {this.props.counter}
                  </span>
                </Highlight>
              </div>
            )}
            {this.props.onSelectView && (
              <div className="pl-2" style={{ display: 'inline-block', float: 'left' }}>
                <Highlight
                  style={sortStyle}
                  position="bottom"
                  theme="LIST"
                  title={this.props.t({ id: 'rbf.list.header.mode.help', defaultMessage: 'Mode helper' })}
                >
                  <div className="input-group">
                    <button
                      type="button"
                      className="btn btn-light text-secondary"
                      ref={this.state.myModeRef}
                      onClick={() => this.onToggleModeMenu()}
                    >
                      {
                        {
                          list: this.props.viewListIcon,
                          form: this.props.viewFormIcon,
                          split: this.props.viewSplitIcon,
                        }[this.props.mode]
                      }
                      <svg viewBox="0 0 24 24" role="presentation" style={{ width: '1.35rem', height: '1.35rem;' }}>
                        <path d="M7,10L12,15L17,10H7Z" style={{ fill: 'currentcolor' }} />
                      </svg>
                    </button>
                    {this.state.modeMenu && (
                      <Dropdown
                        className="border rounded border-secondary bg-light text-secondary"
                        myRef={this.state.myModeRef}
                        onClose={() => {
                          this.setState({ modeMenu: false });
                        }}
                      >
                        <div className="p-2">
                          <button
                            className={classnames('dropdown-item', 'text-secondary')}
                            onClick={() => this.onToggleModeMenu('list')}
                          >
                            {this.props.viewListIcon}{' '}
                            <span>{this.props.t({ id: 'rbf.list.header.view.list', defaultMessage: 'liste' })}</span>
                          </button>
                          <button
                            className={classnames('dropdown-item', 'text-secondary')}
                            onClick={() => this.onToggleModeMenu('split')}
                          >
                            {this.props.viewSplitIcon}{' '}
                            <span>{this.props.t({ id: 'rbf.list.header.view.split', defaultMessage: 'partagé' })}</span>
                          </button>
                          <button
                            className={classnames('dropdown-item', 'text-secondary')}
                            onClick={() => this.onToggleModeMenu('form')}
                          >
                            {this.props.viewFormIcon}{' '}
                            <span>
                              {this.props.t({ id: 'rbf.list.header.view.form', defaultMessage: 'formulaire' })}
                            </span>
                          </button>
                        </div>
                      </Dropdown>
                    )}
                  </div>
                </Highlight>
              </div>
            )}
            <div className="pl-2" style={{ display: 'inline-block', float: 'left' }}>
              <Highlight
                style={sortStyle}
                position="bottom"
                theme="LIST"
                title={this.props.t({ id: 'rbf.list.header.sort.help', defaultMessage: 'Sort helper' })}
              >
                <form className="input-list-sort">
                  <div className="input-group" ref={this.state.mySortRef}>
                    <input
                      className="form-control"
                      disabled
                      placeholder={` ${sortToText(this.props.sort, this.props.cols)}`}
                    />
                    <div className="input-group-append">
                      <button type="button" className="btn btn-outline-secondary bg-light" onClick={this.onToggleSortMenu}>
                        {this.props.sortNoneIcon}
                      </button>
                    </div>
                  </div>
                  {this.state.sortMenu && (
                    <Dropdown
                      className="border rounded border-secondary bg-white text-secondary"
                      myRef={this.state.mySortRef}
                      onClose={() => {
                        this.setState({ sortMenu: false });
                        this.props.onSetFiltersAndSort(this.props.filters, validSort(this.state.sort));
                      }}
                    >
                      <div className="p-2" style={{ minWidth: '300px', maxHeight: '500px' }}>
                        <SortPanel
                          sort={this.state.sort}
                          sortNoneIcon={this.props.sortNoneIcon}
                          sortUpIcon={this.props.sortUpIcon}
                          sortDownIcon={this.props.sortDownIcon}
                          onSortChange={this.onSortChange}
                          pressDelay={200}
                        />
                      </div>
                    </Dropdown>
                  )}
                </form>
              </Highlight>
            </div>
            <div className="pl-2" style={{ display: 'inline-block', float: 'left' }}>
              <Highlight
                style={sortStyle}
                position="bottom"
                theme="LIST"
                title={this.props.t({ id: 'rbf.list.header.search.help', defaultMessage: 'Search helper' })}
              >
                {this.props.quickSearch}
              </Highlight>
            </div>
          </div>
          <div className="col-xxs-w8 text-right">
            <ul className="nav justify-content-end rbf-list-default-header-nav">
              {selectable && this.props.selectMenu && this.props.selectMenu.length > 0 && (
                <li className="nav-item">
                  <div className="dropdown">
                    <Highlight
                      position="bottom"
                      theme="LIST"
                      title={this.props.t({ id: 'rbf.list.header.select.help', defaultMessage: 'Search helper' })}
                    >
                      <button
                        className="btn btn-light text-secondary"
                        ref={this.state.myRef}
                        type="button"
                        onClick={this.onToggle}
                      >
                        {this.props.selectMenuIcon}
                      </button>
                    </Highlight>
                    {this.state.show && (
                      <Dropdown myRef={this.state.myRef} onClose={this.onToggle} align="bottom-right">
                        <div
                          className="bg-light border border-secondary text-secondary"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {this.props.selectMenu.map(option => {
                            if (option.name !== 'divider') {
                              return (
                                <button
                                  type="button"
                                  className="text-secondary dropdown-item"
                                  key={`option-select-${option.name}`}
                                  onClick={() => {
                                    this.onToggle();
                                    option.onClick();
                                  }}
                                >
                                  {option.label}
                                </button>
                              );
                            }
                            return <div className="dropdown-divider" />;
                          })}
                        </div>
                      </Dropdown>
                    )}
                  </div>
                </li>
              )}
              {this.props.filters && (
                <li className="nav-item">
                  <Highlight
                    position="bottom"
                    theme="LIST"
                    title={this.props.t({ id: 'rbf.list.header.filter.help', defaultMessage: 'Filter helper' })}
                  >
                    <button
                      type="button"
                      className="btn btn-light text-secondary"
                      onClick={this.props.onFilters ? this.props.onFilters : this.props.onToggleFilter}
                    >
                      {filterMenuIcon}
                    </button>
                  </Highlight>
                </li>
              )}
              {showFilterButton && (
                <li className="nav-item">
                  <Highlight position="bottom" theme="LIST" title={filterButtonTitle}>
                    <button
                      type="button"
                      className="btn btn-light text-secondary"
                      title={filterButtonTitle}
                      onClick={filterButtonAction}
                    >
                      {filterButtonIcon}
                    </button>
                  </Highlight>
                </li>
              )}
              {this.props.globalActions &&
                this.props.globalActions.map(action => (
                  <li className="nav-item" key={action.name}>
                    <button
                      type="button"
                      disabled={action.disabled || false}
                      title={action.label || ''}
                      className={classnames('btn', action.theme && `btn-${action.theme}`)}
                      onClick={() => {
                        action.onClick();
                      }}
                    >
                      {action.icon}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

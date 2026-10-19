import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Highlight } from '../tour';
import { Dropdown } from '../basic';
import { rbfIntl } from '../intl';

const mystyle = {
  position: 'fixed',
  top: '60px',
  left: '0px',
  right: '0px',
  height: '50px',
  lineHeight: '50px',
  zIndex: '700',
  overflow: 'hidden',
};

const counterStyle = {
  fontSize: '0.9rem',
};

export default class MobileHeader extends Component {
  static propTypes = {
    globalActions: PropTypes.element,
    icon: PropTypes.element,
    title: PropTypes.string.isRequired,
    onReload: PropTypes.func.isRequired,
    t: PropTypes.func,
    toolbar: PropTypes.node,
    toolbarHeight: PropTypes.number,
    toolbarOpen: PropTypes.bool,
    onToolbarToggle: PropTypes.func,
    toolbarIcon: PropTypes.element,
    toolbarCount: PropTypes.number,
  };
  static defaultProps = {
    globalActions: [],
    icon: null,
    t: rbfIntl,
    toolbar: null,
    toolbarHeight: 44,
    toolbarOpen: false,
    onToolbarToggle: null,
    toolbarIcon: null,
    toolbarCount: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef(),
      show: false,
    };
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    this.setState({ show: !this.state.show });
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
    /* Rangée d'outils, comme sur bureau : masquée par défaut, bouton avec badge. */
    const toolbarOpen = !!(this.props.toolbar && this.props.toolbarOpen);
    const headerHeight = 50 + (toolbarOpen ? this.props.toolbarHeight : 0);
    let toolbarCount = this.props.toolbarCount;
    if (toolbarCount === null && this.props.filters && typeof this.props.filters.getFilters === 'function') {
      toolbarCount = this.props.filters.getFilters({ fixed: false }).length;
    }
    const toolbarTitle = toolbarOpen
      ? this.props.t({ id: 'rbf.list.header.toolbar.hide', defaultMessage: 'Masquer les critères' })
      : this.props.t({ id: 'rbf.list.header.toolbar.show', defaultMessage: 'Afficher les critères' });
    return (
      <div
        style={{ ...mystyle, height: `${headerHeight}px` }}
        className="ui-mobile-list row bg-light text-secondary border-bottom border-secondary-light"
      >
        <div className="col-xxs-w12 ui-mobile-list-icon">
          {this.props.icon ? (
            <div className="ui-mobile-list-icon-svg">{this.props.icon}</div>
          ) : (
            <h4 className="pl-2 pt-1">{this.props.title}</h4>
          )}
          {this.props.counter && (
            <Highlight
              position="bottom"
              theme="NAV"
              style={{ float: 'right' }}
              title={this.props.t({ id: 'rbf.list.header.counter.help', defaultMessage: 'Pagination' })}
            >
              <span className="default-list-header-counter" style={counterStyle}>
                {this.props.counter}
              </span>
            </Highlight>
          )}
        </div>
        <div className="col-xxs-w24 text-right">
          <ul className="nav justify-content-end">
            {this.props.selectMenu && this.props.selectMenu.length > 0 && (
              <li className="nav-item">
                <div className="dropdown">
                  <Highlight
                    position="bottom"
                    theme="NAV"
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
            {this.props.toolbar && (
              <li className="nav-item">
                <button
                  type="button"
                  className={classnames('btn btn-light text-secondary rbf-list-header-toolbar-toggle', toolbarOpen && 'active')}
                  title={toolbarTitle}
                  aria-expanded={toolbarOpen}
                  onClick={this.props.onToolbarToggle || undefined}
                >
                  {this.props.toolbarIcon}
                  {!toolbarOpen && toolbarCount > 0 && <span className="badge badge-primary ml-1">{toolbarCount}</span>}
                </button>
              </li>
            )}
            {this.props.filters && (
              <li className="nav-item">
                <Highlight
                  position="bottom"
                  theme="NAV"
                  title={this.props.t({ id: 'rbf.list.header.filter.help', defaultMessage: 'Filter helper' })}
                >
                  <button type="button" className="btn btn-light text-secondary" onClick={this.props.onToggleFilter}>
                    {filterMenuIcon}
                  </button>
                </Highlight>
              </li>
            )}
            {showFilterButton && (
              <li className="nav-item">
                <Highlight position="bottom" theme="NAV" title={filterButtonTitle}>
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
                    title={action.label || ''}
                    className={classnames('btn', action.theme && `btn-${action.theme}`)}
                    onClick={() => {
                      action.onClick();
                    }}
                  >
                    {action.icon}
                    {action.text && <span className="ml-1">{action.text}</span>}
                  </button>
                </li>
              ))}
          </ul>
        </div>
        {toolbarOpen && (
          <div className="col-xxs-w36 rbf-list-header-toolbar px-2" style={{ height: `${this.props.toolbarHeight}px`, lineHeight: '1.5' }}>
            {this.props.toolbar}
          </div>
        )}
      </div>
    );
  }
}

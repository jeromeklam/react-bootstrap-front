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
  };
  static defaultProps = {
    globalActions: [],
    icon: null,
    t: rbfIntl,
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
    return (
      <div
        style={mystyle}
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
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}

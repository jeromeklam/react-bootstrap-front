import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Highlight, HighlightButton } from '../tour';
import { Dropdown } from '../basic';
import { rbfIntl } from '../intl';

const titlestyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  paddingLeft: '5px',
  paddingRight: '10px',
};

const titlestyle2 = {
  fontSize: '0.8rem',
  fontWeight: 'normal',
  paddingLeft: '5px',
  paddingRight: '10px',
  display: 'inline-block',
  lineHeight: '1',
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

const quickStyles = {
  marginTop: '5px',
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
    title: PropTypes.string.isRequired,
    onToggleFilter: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func,
    onClearFiltersDefault: PropTypes.func,
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
    onClearFilters: null,
    onClearFiltersDefault: null,
    quickSearch: '',
    selected: [],
    selectMenu: null,
    sort: {},
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
            defaultMessage: 'Set default filers',
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
      <div style={mystyle} className={classnames('default-list-header bg-secondary text-light', this.props.className)}>
        <div className="row">
          <div className="col-xs-w2 text-center">
            <HighlightButton className="text-light" theme="LIST">
              <div title={this.props.t({ id: 'rbf.button.help.help', defaultMessage: 'Help' })}>
                <button className="btn btn-secondary">?</button>
              </div>
            </HighlightButton>
          </div>
          <div className="col-xs-w14">
            <span style={titlestyle} className="text-light">
              {`${this.props.title}`}
            </span>
            <Highlight
              style={titlestyle2}
              className="text-light"
              position="bottom"
              theme="LIST"
              title={this.props.t({ id: 'rbf.list.header.sort.help', defaultMessage: 'Sort helper' })}
            >
              <span>{` ${sortToText(this.props.sort, this.props.cols)}`}</span>
            </Highlight>
          </div>
          <div className="col-xs-w10" style={quickStyles}>
            <Highlight
              position="bottom"
              theme="LIST"
              title={this.props.t({ id: 'rbf.list.header.search.help', defaultMessage: 'Search helper' })}
            >
              {this.props.quickSearch}
            </Highlight>
          </div>
          <div className="col-xs-w10 text-right">
            <ul className="nav justify-content-end">
              {this.props.counter && (
                <li className="nav-item pr-2">
                  <span className="default-list-header-counter">{this.props.counter}</span>
                </li>
              )}
              {this.props.selectMenu && (
                <li className="nav-item">
                  <div className="dropdown">
                    <Highlight position="bottom" theme="LIST" title="Informations sur la sélection en cours">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        ref={this.state.myRef}
                        type="button"
                        onClick={this.onToggle}
                      >
                        {this.props.selected.length}
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
                    <button type="button" className="btn btn-secondary text-light" onClick={this.props.onToggleFilter}>
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
                      className="btn btn-secondary text-light"
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

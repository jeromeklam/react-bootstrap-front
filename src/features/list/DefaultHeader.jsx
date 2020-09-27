import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Highlight, HighlightToggler } from '../tour';
import { Dropdown } from '../basic';

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
    sort.forEach((elem) => {
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
    title: PropTypes.string.isRequired,
    quickSearch: PropTypes.element,
    onToggleFilter: PropTypes.func.isRequired,
    onClearFilters: PropTypes.func.isRequired,
    onClearFiltersDefault: PropTypes.func,
    globalActions: PropTypes.element,
    filterIcon: PropTypes.element,
    sort: PropTypes.element,
    cols: PropTypes.element.isRequired,
    selected: PropTypes.element,
    selectMenu: PropTypes.element,
  };

  static defaultProps = {
    globalActions: [],
    quickSearch: '',
    sort: {},
    selected: [],
    selectMenu: null,
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
    let filterButtonTitle = "";
    let filterButtonAction = {};
    let showFilterButton = false;
    if (this.props.filters) {
      if (this.props.filters.isEmpty()) {
        filterMenuIcon = this.props.filterEmptyIcon;
        if (this.props.filters.isDefaultExist()) {
          showFilterButton = true;
          filterButtonIcon = this.props.filterDefaultIcon;
          filterButtonTitle = "Activer les filtres par défaut"
          filterButtonAction = this.props.onClearFilters;
        }
      } else {
        showFilterButton = true;
        if (this.props.filters.isDefaultOnly()) {
          filterButtonIcon = this.props.filterClearDefaultIcon;
          filterButtonTitle = "Supprimer les filtres par défaut"
          filterButtonAction = this.props.onClearFiltersDefault;
        } else {
          filterButtonIcon = this.props.filterClearIcon;
          filterButtonAction = this.props.onClearFilters;
          if (this.props.filters.isDefaultExist()) {
            filterButtonTitle = "Supprimer les filtres ajoutés aux filtres par défaut"
          } else {
            filterButtonTitle = "Supprimer les filtres"
          }
        }
      }
    }
    return (
      <div style={mystyle} className={classnames('default-list-header bg-secondary text-light', this.props.className)}>
        <div className="row">
          <div className="col-2 text-center">
            <HighlightToggler className="text-light" theme="LIST" />
          </div>
          <div className="col-14">
            <span style={titlestyle} className="text-light">
              {`${this.props.title}`}
            </span>
            <span style={titlestyle2} className="text-light">
              {` ${sortToText(this.props.sort, this.props.cols)}`}
            </span>
            <Highlight position="bottom" theme="LIST" title="Tri en cours" />
          </div>
          <div className="col-10" style={quickStyles}>
            {this.props.quickSearch}
            <Highlight position="bottom" theme="LIST" title="Recherche rapide" />
          </div>
          <div className="col-10 text-right">
            <ul className="nav justify-content-end">
              {this.props.selectMenu && (
                <li className="nav-item">
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" ref={this.state.myRef} type="button" onClick={this.onToggle}>
                      {this.props.selected.length}
                    </button>
                    <Highlight position="bottom" theme="LIST" title="Informations sur la sélection en cours" />
                    {this.state.show &&
                      <Dropdown myRef={this.state.myRef} onClose={this.onToggle} align="bottom-right">
                        <div className="bg-light border border-secondary text-secondary" aria-labelledby="dropdownMenuButton">
                          {this.props.selectMenu.map((option) => {
                            if (option.name !== 'divider') {
                              return (
                                <button type="button" className="text-secondary dropdown-item" key={`option-select-${option.name}`} onClick={() => { this.onToggle(); option.onClick(); }}>
                                  {option.label}
                                </button>
                              );
                            }
                            return <div className="dropdown-divider" />;
                          })}
                        </div>
                      </Dropdown>
                    }
                  </div>
                </li>
              )}
              {(this.props.filters) && (
                <li className="nav-item">
                  <button type="button" className="btn btn-secondary text-light" onClick={this.props.onToggleFilter}>
                    {filterMenuIcon}
                  </button>
                  <Highlight position="bottom" theme="LIST" title="Gérer les filtres" />
                </li>
              )}
              {(showFilterButton) && (
                <li className="nav-item">
                  <button 
                    type="button" 
                    className="btn btn-secondary text-light"
                    title={filterButtonTitle}
                    onClick={filterButtonAction}
                  >
                    {filterButtonIcon}
                  </button>
                <Highlight position="bottom" theme="LIST" title="Supprimer les filtres" />
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

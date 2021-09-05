import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Filter, FilterBuilder, FILTER_SEARCH_SIMPLE } from '../filter';
import { SortableList } from '../sort';

const sortLocal = (cols, sort) => {
  let local = [];
  sort.forEach(elt => {
    let elt3 = false;
    cols.forEach(elt2 => {
      if (elt.col === elt2.col) {
        elt3 = elt2;
        return true;
      }
    });
    let newElt = {
      col: elt.col,
      way: elt.way,
      label: elt3.label,
      full: elt3,
    };
    local.push(newElt);
  });
  cols.forEach(elt => {
    if (elt.sortable) {
      const found = local.find(elt2 => {
        return elt2.col === elt.col;
      });
      if (!found) {
        let newElt = {
          col: elt.col,
          way: 'none',
          label: elt.label,
          full: elt,
        };
        local.push(newElt);
      }
    }
  });
  return local;
};

const mystyle = {
  position: 'absolute',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
};

const innerstyle = {
  position: 'absolute',
  left: '0px',
  right: '0px',
  top: '50px',
  bottom: '0px',
  overflowX: 'hidden',
  overflowY: 'auto',
};

const btStyle = {
  position: 'absolute',
  right: '2px',
  top: '2px',
};

export default class DefaultPanel extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    filters: PropTypes.element.isRequired,
    validPanelIcon: PropTypes.element.isRequired,
    cancelPanelIcon: PropTypes.element.isRequired,
    onToggleFilter: PropTypes.func.isRequired,
    sortNoneIcon: PropTypes.element,
    sortUpIcon: PropTypes.element,
    sortDownIcon: PropTypes.element,
    simpleMode: PropTypes.bool,
  };

  static defaultProps = {
    sortNoneIcon: '',
    sortUpIcon: '',
    sortDownIcon: '',
    simpleMode: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.filters && !state.local) {
      if (props.filters !== state.filters) {
        let filters = new Filter();
        if (props.filters) {
          filters = props.filters.clone();
        }
        return { filter: filters, local: false };
      }
    }
    return { local: false };
  }

  constructor(props) {
    super(props);
    let filters = new Filter();
    if (props.filters) {
      filters = props.filters.clone();
    }
    this.state = {
      current: props.sort,
      panel: 'filter',
      sort: sortLocal(props.cols, props.sort),
      filter: filters,
      currentFilter: filters,
      local: false,
    };
    this.changePanel = this.changePanel.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onOperator = this.onOperator.bind(this);
    this.onFilterMode = this.onFilterMode.bind(this);
    this.onFilterOperator = this.onFilterOperator.bind(this);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onValid = this.onValid.bind(this);
  }

  onFilterChange(event, oper = false) {
    let { filter } = this.state;
    filter.addFilter(event.target.name, event.target.value, oper);
    filter.setSearch(FILTER_SEARCH_SIMPLE);
    this.setState({ filter, local: true });
  }

  onFilterMode(event) {
    let { filter } = this.state;
    filter.setMode(event.target.value);
    filter.setSearch(FILTER_SEARCH_SIMPLE);
    this.setState({ filter, local: true });
  }

  onOperator(event) {
    let { filter } = this.state;
    filter.setOperator(event.target.value);
    filter.setSearch(FILTER_SEARCH_SIMPLE);
    this.setState({ filter, local: true });
  }

  onFilterOperator(event) {
    let { filter } = this.state;
    const col = event.target.name;
    const oper = event.target.value;
    filter.updateFilterOperator(col.replace('oper-', ''), oper);
    this.setState({ filter, local: true });
  }

  onSortEnd({ oldIndex, newIndex }) {
    let old = this.state.sort[oldIndex];
    let way = old.way;
    if (way === 'none') {
      way = 'up';
    }
    old.way = way;
    let newSort = this.state.sort;
    if (newIndex > oldIndex) {
      newSort.splice(newIndex + 1, 0, old);
      newSort.splice(oldIndex, 1);
    } else {
      newSort.splice(newIndex, 0, old);
      newSort.splice(oldIndex + 1, 1);
    }
    this.setState({ sort: newSort });
  }

  onSortChange(col) {
    let newSort = this.state.sort;
    newSort.forEach(elt => {
      if (elt.col === col.col) {
        if (elt.way === 'none') {
          elt.way = 'up';
        } else {
          if (elt.way === 'up') {
            elt.way = 'down';
          } else {
            elt.way = 'none';
          }
        }
        return true;
      }
    });
    this.setState({ sort: newSort });
  }

  onValid(event) {
    if (event) {
      event.preventDefault();
    }
    let sort = [];
    this.state.sort.forEach(elt => {
      if (elt.way !== 'none') {
        const nElt = {
          col: elt.col,
          way: elt.way,
        };
        sort.push(nElt);
      }
    });
    this.props.onToggleFilter(this.state.filter, sort);
  }

  changePanel(panel) {
    this.setState({ panel });
  }

  render() {
    return (
      <div className="default-list-panel-inner" style={mystyle}>
        <div className={classnames('default-list-panel-navbar clearfix')}>
          <div className="common-responsive-list-panels-close btn-group" style={btStyle}>
            {!this.props.simpleMode && (
              <button
                className="btn btn-light btn-outline-secondary-light text-secondary"
                onClick={this.props.onToggleFilter}
              >
                {this.props.cancelPanelIcon}
              </button>
            )}
            <button className="btn btn-primary text-light" onClick={this.onValid}>
              {this.props.validPanelIcon}
            </button>
          </div>
          {!this.props.simpleMode && (
            <ul className="nav nav-tabs float-left">
              <li className="nav-item">
                <a
                  className={classnames(
                    'nav-link',
                    this.state.panel === 'filter' ? 'bg-secondary text-light' : 'text-secondary'
                  )}
                  onClick={() => {
                    this.changePanel('filter');
                  }}
                >
                  Filtres
                </a>
              </li>
              <li className="nav-item">
                <a
                  className={classnames(
                    'nav-link',
                    this.state.panel === 'sort' ? 'bg-secondary text-light' : 'text-secondary'
                  )}
                  onClick={() => {
                    this.changePanel('sort');
                  }}
                >
                  Tri
                </a>
              </li>
            </ul>
          )}
        </div>
        <div className="custom-scrollbar" style={innerstyle}>
          <div className="default-list-panel-content">
            {(this.props.simpleMode || this.state.panel === 'filter') && (
              <div className="default-list-panel-tab p-2">
                <FilterBuilder
                  {...this.props}
                  filters={this.state.filter}
                  onChange={this.onFilterChange}
                  onMode={this.onFilterMode}
                  onOperator={this.onOperator}
                  onFilterOperator={this.onFilterOperator}
                />
              </div>
            )}
            {!this.props.simpleMode && this.state.panel === 'sort' && (
              <div className="default-list-panel-tab p-2">
                <SortableList
                  items={this.state.sort}
                  onSortEnd={this.onSortEnd}
                  onSortChange={this.onSortChange}
                  sortNoneIcon={this.props.sortNoneIcon}
                  sortUpIcon={this.props.sortUpIcon}
                  sortDownIcon={this.props.sortDownIcon}
                  pressDelay={200}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader } from './';
import { DefaultPanel } from '../filter';
import {
  DefaultTitle as DefaultListTitle,
  DefaultLine as DefaultListLine,
  DefaultFooter as DefaultListFooter,
  LoadEmpty as LoadListEmpty,
} from '../list';
import { DefaultTitle as DefaultTreeviewTitle, DefaultTreeview } from '../treeview';

const duration = 500;

const defaultStyle = {
  position: 'absolute',
  right: '-400px',
  width: '400px',
  top: '0px',
  bottom: '0px',
  zIndex: '877',
  transition: `right ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
};

const transitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-400px' },
  exited: { right: '-400px' },
};

const treestyle = {
  top: '50px',
  height: 'calc(100% - 50px)',
  position: 'absolute',
  overflowY: 'auto',
  overflowX: 'hidden',
  left: '0px',
  width: '300px',
};

const datastyle = {
  top: '50px',
  height: 'calc(100% - 50px)',
  position: 'absolute',
  overflowY: 'auto',
  overflowX: 'hidden',
  left: '300px',
  right: '0px',
};

const treeTitle = {
  marginTop: '50px',
};

const dataTitle = {
  marginTop: '50px',
  paddingLeft: '5px',
  paddingRight: '5px',
};

const footerstyle = {
  marginLeft: '-5px',
  marginRight: '-5px',
};

export default class DefaultTreeviewList extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    items: PropTypes.element.isRequired,
    treeview: PropTypes.element.isRequired,
    onSetFiltersAndSort: PropTypes.func.isRequired,
    loadMorePending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
    };
    this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel(filters = false, sort = false) {
    if (filters !== false && sort !== false) {
      this.props.onSetFiltersAndSort(filters, sort);
    }
    this.setState({ panelOpen: !this.state.panelOpen });
  }

  render() {
    const dispCols = this.props.cols.filter(col => !col.hidden);
    return (
      <div className="default-treeviewlist">
        <DefaultHeader {...this.props} onToggleFilter={this.togglePanel} />
        <div style={treestyle} className="border-right border-secondary">
          <DefaultTreeviewTitle {...this.props} />
          <div style={treeTitle}>
            <DefaultTreeview {...this.props} />
          </div>
        </div>
        <div style={datastyle}>
          <DefaultListTitle {...this.props} cols={dispCols} />
          <div style={dataTitle}>
            {this.props.items.length > 0 ? (
              <div>
                {this.props.items.map(item => (
                  <DefaultListLine key={item.id} id={item.id} item={item} {...this.props} cols={dispCols} />
                ))}
              </div>
            ) : (
              <div>{!this.props.loadMorePending && <LoadListEmpty />}</div>
            )}
            <div style={footerstyle}>
              <DefaultListFooter {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

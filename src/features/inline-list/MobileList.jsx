import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MobileLineAction, MobileLineText } from './';
import { MobileLine } from '../list';

class MobileList extends Component {
  static propTypes = {
    MobileList: PropTypes.bool,
    oddEven: PropTypes.bool,
    loading: PropTypes.bool,
    loader: PropTypes.element,
  };

  static defaultProps = {
    MobileList: false,
    oddEven: true,
    loading: false,
    loader: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentFlipped: 0,
    };
    this.setCurrentFlipped = this.setCurrentFlipped.bind(this);
  }

  setCurrentFlipped(id) {
    this.setState({ currentFlipped: id });
  }

  render() {
    let dispCols = this.props.cols;
    dispCols.forEach(col => {
      if (col.card && !col.card.position) {
        col.card.position = 99;
      }
    });
    let mobileCols = dispCols.filter(col => col.card);
    mobileCols.sort((a, b) => {
      if ((a.card.position && b.card.position && a.card.position > b.card.position) || !a.card.position) {
        return 1;
      } else {
        return -1;
      }
    });
    let counter = 1;
    return (
      <div className="text-left">
        {Array.isArray(this.props.items) &&
          this.props.items.map(item => (
            <MobileLine
              {...this.props}
              key={item.id}
              cols={mobileCols}
              counter={this.props.oddEven ? counter++ : 0}
              id={item.id}
              item={item}
              title={item[this.props.mainCol]}
              selectable={false}
              forSelectOne={true}
              currentFlipped={this.state.currentFlipped}
              setCurrentFlipped={this.setCurrentFlipped}
            />
          ))}
        {(!Array.isArray(this.props.items) || this.props.items.length === 0) && !this.props.loading && (
          <MobileLineText
            className="text-secondary"
            label={this.props.t({ id: 'rbf.inlinelist.empty', defaultMessage: 'Liste vide' })}
          />
        )}
        {this.props.loading && this.props.loader}
        {!this.props.loading &&
          Array.isArray(this.props.items) &&
          this.props.onMore &&
          this.props.total > this.props.items.length &&
          this.props.items.length > 0 && (
            <MobileLineAction
              className="btn btn-secondary-light text-secondary font-weight-bold"
              label={this.props.t({ id: 'rbf.inline-list.list.more', defaultMessage: 'Plus de résultats' })}
              onClick={ev => {
                if (ev) {
                  ev.stopPropagation();
                }
                this.props.onMore();
              }}
            />
          )}
      </div>
    );
  }
}

export default MobileList;

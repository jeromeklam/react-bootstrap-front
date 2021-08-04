import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableList, sortToLocal } from './';

export default class SortPanel extends Component {
  static propTypes = {};

  static getDerivesStateFromProps(props, state) {
    if (props.sort !== this.state.props) {
      return {sort: props.sort};
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      sort: props.sort,
    };
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
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
    this.props.onSortChange({ sort: newSort });
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
    this.props.onSortChange({ sort: newSort });
  }

  render() {
    return (
      <SortableList
        items={this.state.sort}
        onSortEnd={this.onSortEnd}
        onSortChange={this.onSortChange}
        sortNoneIcon={this.props.sortNoneIcon}
        sortUpIcon={this.props.sortUpIcon}
        sortDownIcon={this.props.sortDownIcon}
        pressDelay={100}
      />
    );
  }
}

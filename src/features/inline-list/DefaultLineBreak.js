import React, { Component } from 'react';
import classnames from 'classnames';

export default class DefaultLineBreak extends Component {
  render() {
    let rowOddEven = '';
    if (this.props.counter) {
      rowOddEven = this.props.counter % 2 === 0 ? 'row-even' : 'row-odd';
    }
    return (
      <div
        className={classnames("inline-default-list-wrapper row row-line no-gutters", rowOddEven)}
      >
        <div class="col col-xs-w36">
          {this.props.label}
        </div>
      </div>
    );
  }
}
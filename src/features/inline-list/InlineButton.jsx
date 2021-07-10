import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { HoverObserver } from '../advanced';
import { ColLink } from './';

export default class InlineButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    className: 'text-secondary',
    onClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
  }

  mouseLeave() {
    this.setState({ flipped: false });
  }

  mouseEnter() {
    this.setState({ flipped: true });
  }

  render() {
    return (
      <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
        <div
          className={classnames(
            'row row-line inline-list-inline-button',
            this.props.oddEven % 2 !== 1 ? 'row-odd' : 'row-even',
            this.state.flipped && 'row-hover',
          )}
        >
          <ColLink label={this.props.label} className={this.props.className} onClick={this.props.onClick} />
        </div>
      </HoverObserver>
    );
  }
}

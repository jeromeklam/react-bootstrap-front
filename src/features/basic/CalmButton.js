import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CalmButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      executing: false,
    };
    this.timer = null;
    this.onRealClick = this.onRealClick.bind(this);
  }

  onRealClick(event) {
    this.timer = setTimeout(() => {
      this.setState({ executing: false });
    }, 1000);
    this.setState({ executing: true });
    this.props.onClick(event);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    return (
      <button {...this.props} onClick={this.onRealClick} disabled={this.state.executing || this.props.disabled}>
        {this.props.children || ''}
      </button>
    );
  }
}

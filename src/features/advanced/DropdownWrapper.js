import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Dropdown } from '../basic';

export default class DropdownWrapper extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    trigger: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { open: false, ref: React.createRef() };
    this.onClose = this.onClose.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({ open: true });
  }

  onClose(e) {
    this.setState({ open: false });
  }

  render() {
    return (
      <>
        <div ref={this.state.ref} className="advanced-dropdown-wrapper" onClick={this.onClick}>
          {this.props.trigger}
        </div>
        {this.state.open && (
          <Dropdown myRef={this.state.ref} onClose={this.onClose}>
            {this.props.children}
          </Dropdown>
        )}
      </>
    );
  }
}

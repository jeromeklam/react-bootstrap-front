import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Dropdown } from '../basic';

export default class DropdownWrapper extends Component {
  static propTypes = {
    align: PropTypes.string,
    children: PropTypes.element.isRequired,
    myRef: PropTypes.object,
    tooltip: PropTypes.string,
    trigger: PropTypes.element.isRequired,
  };
  static defaultProps = {
    align: "bottom-left",
    myRef: null,
    tooltip: "",
  }

  constructor(props) {
    super(props);
    this.state = { open: false, ref: props.myRef || React.createRef() };
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
        <div ref={this.state.ref} className="advanced-dropdown-wrapper" onClick={this.onClose} title={this.props.tooltip}>
          {this.props.trigger}
        </div>
        {this.state.open && (
          <Dropdown align={this.props.align} myRef={this.state.myRef} onClose={this.onClose}>
            <div onClick={this.onClose}>
              {this.props.children}
            </div>
          </Dropdown>
        )}
      </>
    );
  }
}

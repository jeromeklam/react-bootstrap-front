import React, { Component } from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import { Dropdown } from '../basic';

export default class DropdownWrapper extends Component {
  static propTypes = {
    align: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    myRef: PropTypes.object,
    tooltip: PropTypes.string,
    trigger: PropTypes.element.isRequired,
  };
  static defaultProps = {
    align: 'bottom-left',
    className: '',
    myRef: null,
    tooltip: '',
  };

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
    const clonedTrigger = React.cloneElement(
      this.props.trigger,
      {ref: this.state.ref, onClick: this.onClick, title: this.props.tooltip}
    )
    return (
      <>
        {clonedTrigger}
        {this.state.open && (
          <Dropdown align={this.props.align} myRef={this.state.ref} onClose={this.onClose}>
            <div onClick={this.onClose}>{this.props.children}</div>
          </Dropdown>
        )}
      </>
    );
  }
}

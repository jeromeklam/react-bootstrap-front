import React, { Component } from 'react';
import classnames from 'classnames';
import { PropTypes } from 'prop-types';
import { Dropdown } from '../basic';

export default class DropdownWrapper extends Component {
  static propTypes = {
    align: PropTypes.string,
    autoClose: PropTypes.bool,
    className: PropTypes.string,
    myRef: PropTypes.object,
    open: PropTypes.bool,
    tooltip: PropTypes.string,
    trigger: PropTypes.element.isRequired,
  };
  static defaultProps = {
    align: 'bottom-left',
    autoClose: true,
    className: '',
    myRef: null,
    open: false,
    tooltip: '',
  };

  static getDerivedStateFromProps(state, props) {
    if (state.origOpen !== props.open && state.open !== props.open) {
      return { open: props.open, origOpen: props.open };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = { origOpen: this.props.open, open: this.props.open || false, ref: props.myRef || React.createRef() };
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
      { ref: this.state.ref, onClick: this.onClick, title: this.props.tooltip }
    )
    const { onClose } = this;
    return (
      <>
        {clonedTrigger}
        {this.state.open && (
          <Dropdown align={this.props.align} myRef={this.state.ref} onClose={onClose}>
            <div onClick={this.props.autoClose && this.onClose}>
              {typeof this.props.children === 'function' ? this.props.children({ onClose }) : this.props.children}
            </div>
          </Dropdown>
        )}
      </>
    );
  }
}

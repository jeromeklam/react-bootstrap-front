import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownWrapper, ResponsiveConfirm } from '../advanced';
import { DropdownMenu, DropdownMenuOption } from '../basic';

export default class ActionButton extends Component {
  static propTypes = {
    action: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array,PropTypes.func]),
  };
  static defaultProps = {
    className: 'btn btn-inline',
    options: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      confirm: false,
      myRef: React.createRef(),
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onConfirmClose = this.onConfirmClose.bind(this);
    this.onValidConfirm = this.onValidConfirm.bind(this);
  }

  onConfirm() {
    this.setState({ confirm: true });
  }

  onConfirmClose() {
    this.setState({ confirm: false });
  }

  onValidConfirm() {
    this.setState({ confirm: false });
    if (this.props.action.param === 'object') {
      this.props.action.onClick(this.props.item);
    } else {
      this.props.action.onClick(this.props.item.id);
    }
  }

  render() {
    const { action, item, className } = this.props;
    if (action.options) {
      const trigger = (
        <button
          type="button"
          disabled={action.disabled || false}
          title={action.label || ''}
          className={classnames(className, 'btn')}
        >
          {action.icon}
        </button>
      );
      let myOptions = action.options;
      if (!Array.isArray(myOptions) && typeof action.options === 'function') {
        myOptions = action.options(this.props.item);
      }
      return (
        <DropdownWrapper trigger={trigger} align="bottom-right" myRef={this.state.myRef}>
          <DropdownMenu>
            {myOptions.map(elem => {
              return (
                <DropdownMenuOption
                  key={`elem-${action.label}`}
                  label={elem.label}
                  onClick={ev => {
                    if (ev) {
                      ev.preventDefault();
                    }
                    if (action.param === 'object') {
                      elem.onClick(item);
                    } else {
                      elem.onClick(item.id);
                    }
                  }}
                />
              );
            })}
          </DropdownMenu>
        </DropdownWrapper>
      );
    }
    return (
      <>
        <button
          type="button"
          disabled={action.disabled || false}
          title={action.label || ''}
          className={classnames(className, 'btn')}
          ref={this.state.myRef}
          onClick={evt => {
            evt.stopPropagation();
            if (action.role === 'DELETE') {
              this.onConfirm();
            } else if (action.param === 'object') {
              action.onClick(item, this.state.myRef);
            } else {
              action.onClick(item.id, this.state.myRef);
            }
          }}
        >
          {action.icon}
        </button>
        <ResponsiveConfirm show={this.state.confirm} onClose={this.onConfirmClose} onConfirm={this.onValidConfirm} />
      </>
    );
  }
}

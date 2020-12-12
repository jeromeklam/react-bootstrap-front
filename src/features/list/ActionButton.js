import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownWrapper, ResponsiveConfirm } from '../advanced';
import { DropdownMenu, DropdownMenuOption } from '../basic';

export default class ActionButton extends Component {
  static propTypes = {
    action: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    classname: PropTypes.string,
  };
  static defaultProps = {
    classname: 'btn btn-inline',
  };

  constructor(props) {
    super(props);
    this.state = {
      confirm: false,
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
    const { action, item, classname } = this.props;
    if (action.options) {
      const trigger = (
        <button
          type="button"
          disabled={action.disabled || false}
          title={action.label || ''}
          className={classnames(classname, action.theme && `btn-${action.theme}`)}
        >
          {action.icon}
        </button>
      );
      return (
        <DropdownWrapper trigger={trigger} align="bottom-right">
          <DropdownMenu>
            {action.options.map(elem => {
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
          className={classnames(classname, action.theme && `btn-${action.theme}`)}
          onClick={evt => {
            evt.stopPropagation();
            if (action.role === 'DELETE') {
              this.onConfirm();
            } else if (action.param === 'object') {
              action.onClick(item);
            } else {
              action.onClick(item.id);
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

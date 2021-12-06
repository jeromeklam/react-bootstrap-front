import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropdownWrapper, ResponsiveConfirm } from '../advanced';
import { DropdownMenu, DropdownMenuOption, Dropdown } from '../basic';

export default class ActionButton extends Component {
  static propTypes = {
    action: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    className: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  };
  static defaultProps = {
    className: 'btn btn-inline',
    options: null,
  };

  constructor(props) {
    super(props);
    let myOptions = props.action.options;
    let triggerFct = null;
    if (!Array.isArray(myOptions) && typeof myOptions === 'function') {
      // On appelle la fonction, en retour on a soit un tableau soit une promesse pour un appel asynchrone
      myOptions = props.action.options(props.item);
      if (!Array.isArray(myOptions)) {
        triggerFct = props.action.options;
        myOptions = null;
      }
    }
    this.state = {
      confirm: false,
      confirmLabel: '',
      myRef: React.createRef(),
      options: myOptions,
      triggerFct: triggerFct,
      open: false,
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onConfirmClose = this.onConfirmClose.bind(this);
    this.onValidConfirm = this.onValidConfirm.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  updateOptions(result) {
    this.setState({ options: result });
  }

  onConfirm(message = '') {
    this.setState({ confirm: true, confirmLabel: message });
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
    const { action, item, className } = this.props;
    let icon = action.icon;
    if (action.fIcon) {
      if (typeof action.fIcon === 'function') {
        icon = action.fIcon(item);
      }
    }
    if (action.fDisplay) {
      if (typeof action.fDisplay === 'function') {
        icon = action.fDisplay(item);
      }
    }
    let disabled = action.disabled || false;
    if (this.state.options && Array.isArray(this.state.options) && this.state.options.length === 0) {
      disabled = true;
    }
    if (this.state.triggerFct) {
      return (
        <>
          <div ref={this.state.myRef}>
            <button
              type="button"
              disabled={disabled}
              title={action.label || ''}
              className={classnames(className, 'btn')}
              onClick={ev => {
                if (ev) {
                  ev.preventDefault();
                  ev.stopPropagation();
                }
                this.state.triggerFct(item).then(result => {
                  this.updateOptions(result);
                });
              }}
            >
              {icon}
            </button>
          </div>
          {this.state.options && (
            <Dropdown align="bottom-right" className="btn-secondary" myRef={this.state.myRef} onClose={this.onClose}>
              <DropdownMenu>
                {Array.isArray(this.state.options) &&
                  this.state.options.length > 0 &&
                  this.state.options.map(elem => {
                    if (elem) {
                      return (
                        <DropdownMenuOption
                          key={`elem-${action.label}`}
                          label={elem.label}
                          onClick={ev => {
                            if (ev) {
                              ev.preventDefault();
                              ev.stopPropagation();
                            }
                            if (action.param === 'object') {
                              elem.onClick(item);
                            } else {
                              elem.onClick(item.id);
                            }
                          }}
                        />
                      );
                    }
                    return null;
                  })}
              </DropdownMenu>
            </Dropdown>
          )}
        </>
      );
    } else {
      if (this.state.options && Array.isArray(this.state.options)) {
        if (this.state.options.length >= 1) {
          const trigger = (
            <button
              type="button"
              disabled={disabled}
              title={action.label || ''}
              className={classnames(className, 'btn')}
            >
              {icon}
            </button>
          );
          return (
            <DropdownWrapper trigger={trigger} className="btn-secondary" align="bottom-right" myRef={this.state.myRef}>
              <DropdownMenu>
                {this.state.options.map(elem => {
                  return (
                    <DropdownMenuOption
                      key={`elem-${action.label}`}
                      label={elem.label}
                      onClick={ev => {
                        if (ev) {
                          ev.preventDefault();
                          ev.stopPropagation();
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
        } else {
          const elem = this.state.options[0];
          if (elem) {
            return (
              <button
                type="button"
                disabled={action.disabled || false}
                title={action.label || ''}
                className={classnames(className, 'btn')}
                ref={this.state.myRef}
                onClick={ev => {
                  if (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                  }
                  if (action.param === 'object') {
                    elem.onClick(item);
                  } else {
                    elem.onClick(item.id);
                  }
                }}
              >
                {icon}
              </button>
            );
          }
          return null;
        }
      }
    }
    return (
      <>
        <button
          type="button"
          disabled={action.disabled || false}
          title={action.label || ''}
          className={classnames(className, 'btn')}
          ref={this.state.myRef}
          onClick={ev => {
            if (ev) {
              ev.stopPropagation();
            }
            if (action.role === 'DELETE' || action.confirm) {
              this.onConfirm(action.confirm || '');
            } else if (action.param === 'object') {
              action.onClick(item, this.state.myRef);
            } else {
              action.onClick(item.id, this.state.myRef);
            }
          }}
        >
          {icon}
        </button>
        {this.state.confirm && (
          <ResponsiveConfirm show={this.state.confirm} onClose={this.onConfirmClose} onConfirm={this.onValidConfirm}>
            {this.state.confirmLabel && this.state.confirmLabel !== '' ? (
              <span>{this.state.confirmLabel}</span>
            ) : (
              <span>Confirmez-vous la suppression ?</span>
            )}
          </ResponsiveConfirm>
        )}
      </>
    );
  }
}

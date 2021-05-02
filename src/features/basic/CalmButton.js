import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, DropdownMenuOption, Dropdown } from '../basic';

export default class CalmButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    options: PropTypes.array,
    optionsAlign: PropTypes.string,
  };
  static defaultProps = {
    disabled: false,
    options: [],
    optionsAlign: "bottom-right",
  };

  constructor(props) {
    super(props);
    this.state = {
      executing: false,
      optionsMenu: false,
      myRef: React.createRef(),
    };
    this.timer = null;
    this.onRealClick = this.onRealClick.bind(this);
    this.onOptionsMenuOpen = this.onOptionsMenuOpen.bind(this);
    this.onOptionsMenuClose = this.onOptionsMenuClose.bind(this);
  }

  onRealClick(event) {
    if (this.props.options && this.props.options.length > 0) {
      this.onOptionsMenuOpen();
    } else {
      this.timer = setTimeout(() => {
        this.setState({ executing: false });
      }, 1000);
      this.setState({ executing: true });
      this.props.onClick(event);
    }
  }

  onOptionsMenuOpen() {
    this.setState({ optionsMenu: true });
  }

  onOptionsMenuClose() {
    this.setState({ optionsMenu: false });
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    return (
      <>
        <button
          {...this.props}
          onClick={this.onRealClick}
          disabled={this.state.executing || this.props.disabled}
          ref={this.state.myRef}
        >
          {this.props.children || ''}
        </button>
        {this.props.options &&
          Array.isArray(this.props.options) &&
          this.props.options.length > 0 &&
          this.state.optionsMenu && (
            <Dropdown align={this.props.optionsAlign} myRef={this.state.myRef} maxHeight="250px" onClose={this.onOptionsMenuClose}>
              <DropdownMenu>
                {this.props.options.map(option => {
                  return (
                    <DropdownMenuOption
                      key={`text-${option.id}`}
                      label={option.label}
                      onClick={ev => {
                        if (ev) {
                          ev.preventDefault();
                        }
                        option.onClick();
                        this.onOptionsMenuClose();
                      }}
                    />
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          )}
      </>
    );
  }
}

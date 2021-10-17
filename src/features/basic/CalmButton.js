import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, DropdownMenuOption, Dropdown } from '../basic';
import { SmLoading9x9 } from '../spinner';

export default class CalmButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    loader: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    options: PropTypes.array,
    optionsAlign: PropTypes.string,
    optionsOpenMulti: PropTypes.bool,
    title: PropTypes.string,
  };
  static defaultProps = {
    className: '',
    disabled: false,
    loader: true,
    options: [],
    optionsAlign: 'bottom-right',
    optionsOpenMulti: true, // Ouvre le menu des options quand on a au moins 2 options
    title: '',
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

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onRealClick(event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.props.options && this.props.options.length > this.props.optionsOpenMulti) {
      this.onOptionsMenuOpen();
    } else {
      this.timer = setTimeout(() => {
        this.setState({ executing: false });
      }, 2000);
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

  render() {
    return (
      <>
        <button
          className={this.props.className}
          title={this.props.title}
          onClick={this.onRealClick}
          disabled={this.state.executing || this.props.disabled}
          ref={this.state.myRef}
        >
          <>
            {this.state.executing && this.props.loader && (
              <div className="calm-button-loader pr-1 text-light">
                <SmLoading9x9 width={20} height={20} />
              </div>
            )}
            {this.props.children || ''}
          </>
        </button>
        {this.props.options &&
          Array.isArray(this.props.options) &&
          this.props.options.length > this.props.optionsOpenMulti &&
          this.state.optionsMenu && (
            <Dropdown
              align={this.props.optionsAlign}
              myRef={this.state.myRef}
              maxHeight="250px"
              onClose={this.onOptionsMenuClose}
            >
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

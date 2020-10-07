import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DefaultSidebar.css';
import { DefaultSidebarItem, DefaultSidebarMenu } from './';

const myStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  overflowY: 'auto',
  overflowX: 'hidden',
};

export default class DefaultSidebar extends Component {
  static propTypes = {
    options: PropTypes.element.isRequired,
    authenticated: PropTypes.bool.isRequired,
    location: PropTypes.element.isRequired,
    onNavigate: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    onOpenSide: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      menu: 0,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(id) {
    const { menu } = this.state;
    if (menu > 0 && menu === id) {
      this.setState({ menu: 0 });
    } else {
      this.setState({ menu: id });
      if (!this.props.open && id !== 0) {
        this.props.onOpenSide();
      }
    }
  }

  render() {
    if (!this.props.open && this.state.menu !== 0) {
      this.toggleMenu(0);
    }
    return (
      <div className="sidebar-wrapper custom-scrollbar" style={myStyles}>
        <ul className="sidebar-navigation">
          {this.props.options.map((option) => {
            if (
              option.role === 'HOME' ||
              option.role === 'ABOUT' ||
              (option.role === 'NAV' && (this.props.authenticated || (this.props.authenticated && option.public)))
            ) {
              return (
                <DefaultSidebarItem key={`option-${option.label}-${option.position}`} {...this.props} option={option} open={this.props.open}/>
              );
            } else if (
              option.role === 'MENU' &&
              (this.props.authenticated || (this.props.authenticated && option.public))
            ) {
              return (
                <div key={`option-${option.label}-${option.position}`}>
                  <DefaultSidebarMenu
                    key={`option-${option.label}-${option.position}`}
                    toggleMenu={this.toggleMenu}
                    {...this.props}
                    option={option}
                    {...this.state}
                    open={this.props.open}
                  />
                  {this.props.open && this.state.menu === option.position &&
                    option.options.map(option2 => (
                      <DefaultSidebarItem
                        className="menu-option"
                        key={`option-${option2.label}-${option2.position}`}
                        {...this.props}
                        option={option2}
                      />
                   ))}
                </div>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }
}

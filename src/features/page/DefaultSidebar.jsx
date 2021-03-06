import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from '../tour';
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
    onToggleSide: PropTypes.func,
  };
  static defaultProps = {
    onToggleSide: null,
    onOpenSide: null,
  }

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
        {this.props.authenticated && this.props.onToggleSide && (
          <div className='ml-1'>
          <button className="btn btn-humburger" onClick={this.props.onToggleSide} id="menu-toggle">
            <Highlight theme="NAV" title={this.props.t({ id: 'rbf.page.header.menuIcon', defaultMessage: '' })}>
              {this.props.menuIcon}
            </Highlight>
          </button>
          </div>
        )}
        <ul className="sidebar-navigation">
          {this.props.options.map(option => {
            let label = '' + (option.url || option.position || '');
            label = label.replace(/\//gi, '-');
            if (
              option.role === 'HOME' ||
              option.role === 'ABOUT' ||
              (option.role === 'NAV' && (this.props.authenticated || (this.props.authenticated && option.public)))
            ) {
              return (
                <DefaultSidebarItem
                  key={`option-${label}-${option.position}`}
                  {...this.props}
                  option={option}
                  open={this.props.open}
                />
              );
            } else if (
              option.role === 'MENU' &&
              (this.props.authenticated || (this.props.authenticated && option.public))
            ) {
              return (
                <div key={`option-${label}-${option.position}`}>
                  <DefaultSidebarMenu
                    toggleMenu={this.toggleMenu}
                    {...this.props}
                    option={option}
                    {...this.state}
                    open={this.props.open}
                  />
                  {this.props.open &&
                    this.state.menu === option.position &&
                    option.options.map(option2 => {
                      let label2 = '' + (option2.url || option2.position || '');
                      label2 = label2.replace(/\//gi, '-');
                      return (
                        <DefaultSidebarItem
                          className="menu-option"
                          key={`option-${label2}-${option2.position}`}
                          {...this.props}
                          option={option2}
                        />
                      );
                    })}
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

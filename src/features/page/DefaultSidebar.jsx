import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Highlight } from '../tour';
import { HoverObserver } from '../advanced';
import { DefaultSidebarOption } from './';

const myStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  overflow: 'visible',
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
  };

  constructor(props) {
    super(props);
    this.state = {
      menu: 0,
      moreStyle: {},
      forced: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.menuIsOpen = this.menuIsOpen.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.noForced = this.noForced.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  toggleMenu(id) {
    let { menu } = this.state;
    if (menu > 0 && menu === id) {
      if (menu > 100) {
        menu = Math.trunc(menu / 10);
      } else {
        menu = 0;
      }
    } else {
      menu = id;
    }
    if (!this.props.open && menu > 0) {
      this.setState({ moreStyle: { width: '250px' }, forced: true, menu: menu });
    } else {
      this.setState({ menu: menu });
    }
  }

  noForced() {
    this.setState({ moreStyle: {}, forced: false });
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(event.target)) {   
      if (this.props.myRef && this.props.myRef.current &&this.props.myRef.current.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.noForced();
    }
  }

  menuIsOpen(position) {
    const { menu } = this.state;
    if (menu === position) {
      return true;
    } else {
      if (menu > 100) {
        let parent = Math.trunc(menu / 10);
        if (parent === position) {
          return true;
        }
      }
    }
    return false;
  }

  mouseLeave() {
    this.setState({ moreStyle: {}, forced: false });
  }

  mouseEnter() {
    if (!this.props.open) {
      this.setState({ moreStyle: { width: '250px' }, forced: true });
    } else {
      this.setState({ moreStyle: {}, forced: false });
    }
  }

  render() {
    if (!this.props.open && this.state.menu !== 0 && !this.state.forced) {
      this.toggleMenu(0);
    }
    return (
      <div className="sidebar-wrapper" style={myStyles}>
        {this.props.authenticated && this.props.onToggleSide && (
          <div className="ml-1 sidebar-wrapper-menu-hum">
            <button className="btn btn-humburger" onClick={this.props.onToggleSide} id="menu-toggle">
              <Highlight theme="NAV" title={this.props.t({ id: 'rbf.page.header.menuIcon', defaultMessage: '' })}>
                {this.props.menuIcon}
              </Highlight>
            </button>
          </div>
        )}
        <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
          <div className="sidebar-navigation-wrapper custom-scrollbar" style={{ ...this.state.moreStyle }}>
            <ul
              className={classnames(
                'sidebar-navigation',
                this.state.forced || this.props.open ? 'sidebar-navigation-open' : 'sidebar-navigation-closed'
              )}
            >
              {this.props.options.map(option => {
                return (
                  <DefaultSidebarOption
                    {...this.props}
                    option={option}
                    menu={this.state.menu}
                    toggleMenu={this.toggleMenu}
                    menuIsOpen={this.menuIsOpen}
                    noForced={this.noForced}
                    level={1}
                    open={this.props.open || this.state.forced}
                  />
                );
              })}
            </ul>
          </div>
        </HoverObserver>
      </div>
    );
  }
}

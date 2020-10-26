import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader, DefaultSidebar, DefaultFooter } from './';
import { WidthObserver } from '../advanced';

const duration = 500;

const DesktopHeaderHeight = 60;
const DesktopFooterHeight = 60;
const DesktopSideWidthMaxi = 250;
const DesktopSideWidthMini = 64;

const sideMenuDefaultStyles = {
  transition: `width ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  left: '0px',
  top: `${DesktopHeaderHeight}px`,
  bottom: `${DesktopFooterHeight}px`,
  height: 'auto',
  width: `${DesktopSideWidthMaxi}px`,
  zIndex: '850',
};

const sideMenuStyles = {
  entering: { width: `${DesktopSideWidthMaxi}px` },
  entered: { width: `${DesktopSideWidthMaxi}px` },
  exiting: { width: `${DesktopSideWidthMini}px` },
  exited: { width: `${DesktopSideWidthMini}px` },
};

const userMenuDefaultStyles = {
  transition: `top ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '-400px',
  height: '400px',
  zIndex: '900',
};

const userMenuStyles = {
  entering: { top: '0px' },
  entered: { top: '0px' },
  exiting: { top: '-400px' },
  exited: { top: '-400px' },
};

const headerMenuStyles = {
  entering: { top: '400px' },
  entered: { top: '400px' },
  exiting: { top: '0px' },
  exited: { top: '0px' },
};

const headerMenuDefaultStyles = {
  zIndex: '900',
  position: 'fixed',
  top: '0px',
  right: '0px',
  left: '0px',
  height: `${DesktopHeaderHeight}px`,
  lineHeight: `${DesktopHeaderHeight}px`,
  transition: `top ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
};

const contentDefaultStyles = {
  transition: `left ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  left: `${DesktopSideWidthMaxi}px`,
  right: '0px',
  top: `${DesktopHeaderHeight}px`,
  bottom: `${DesktopFooterHeight}px`,
  height: 'auto',
  /*overflowX: 'hidden',*/
  /*overflowY: 'none',*/
  zIndex: '810',
};

const contentStyles = {
  entering: { left: `${DesktopSideWidthMaxi}px` },
  entered: { left: `${DesktopSideWidthMaxi}px` },
  exiting: { left: `${DesktopSideWidthMini}px` },
  exited: { left: `${DesktopSideWidthMini}px` },
};

const footerStyles = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  bottom: '0px',
  height: `${DesktopFooterHeight}px`,
  lineHeight: `${DesktopFooterHeight}px`,
  zIndex: '870',
};

export default class ResponsivePage extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    userForm: PropTypes.element.isRequired,
    settings: PropTypes.element.isRequired,
    onChangeSettings: PropTypes.func.isRequired,
    footer: PropTypes.bool,
  };
  static defaultProps = {
    footer: true,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.authenticated) {
      return { menuDataOpen: false, menuUserOpen: false };
    }
    if (props.settings !== state.settings) {
      let menuMaxi = true;
      if (props.settings && (props.settings.menuposition === true || props.settings.menuposition === false)) {
        menuMaxi = props.settings.menuposition;
      }
      return { menuSideMini: !menuMaxi };
    }
    return null;
  }

  constructor(props) {
    super(props);
    let menuMaxi = true;
    if (props.settings && (props.settings.menuposition === true || props.settings.menuposition === false)) {
      menuMaxi = props.settings.menuposition;
    }
    this.state = {
      menuDataOpen: false,
      menuUserOpen: false,
      menuSideMini: !menuMaxi,
    };
    this.onToggleData = this.onToggleData.bind(this);
    this.onToggleSide = this.onToggleSide.bind(this);
    this.onToggleUser = this.onToggleUser.bind(this);
    this.onOpenSide = this.onOpenSide.bind(this);
  }

  onToggleData() {
    this.setState({ menuDataOpen: !this.state.menuDataOpen });
  }

  onToggleUser() {
    this.setState({ menuUserOpen: !this.state.menuUserOpen });
  }

  onToggleSide() {
    this.props.onChangeSettings('menuposition', this.state.menuSideMini);
  }

  onOpenSide() {
    this.props.onChangeSettings('menuposition', false);
  }

  render() {
    const userForm = React.cloneElement(this.props.userForm, { onClose: this.onToggleUser });
    return (
      <div id="page-root" className="full-page">
        <div className="display-desktop">
          <WidthObserver>
            <CSSTransition in={this.state.menuUserOpen} timeout={duration}>
              {state => (
                <div>
                  <div className="bg-primary-light" style={{ ...userMenuDefaultStyles, ...userMenuStyles[state] }}>
                    {userForm}
                  </div>
                  <div style={{ ...headerMenuDefaultStyles, ...headerMenuStyles[state] }}>
                    <DefaultHeader
                      {...this.props}
                      {...this.state}
                      desktopHeaderHeight={DesktopHeaderHeight}
                      onToggleUser={this.onToggleUser}
                      onToggleSide={this.onToggleSide}
                    />
                  </div>
                </div>
              )}
            </CSSTransition>
            <CSSTransition in={this.state.menuSideMini} timeout={duration}>
              {state => (
                <div>
                  <div
                    className="bg-light"
                    style={{
                      ...sideMenuDefaultStyles,
                      ...sideMenuStyles[state],
                      bottom: this.props.footer ? `${DesktopFooterHeight}px` : '0px',
                    }}
                  >
                    <DefaultSidebar {...this.props} open={this.state.menuSideMini} onOpenSide={this.onOpenSide} />
                  </div>
                  <div
                    style={{
                      ...contentDefaultStyles,
                      ...contentStyles[state],
                      bottom: this.props.footer ? `${DesktopFooterHeight}px` : '0px',
                    }}
                  >
                    {this.props.children}
                  </div>
                </div>
              )}
            </CSSTransition>
            {this.props.footer && (
              <div style={footerStyles}>
                <DefaultFooter {...this.props} />
              </div>
            )}
          </WidthObserver>
        </div>
      </div>
    );
  }
}

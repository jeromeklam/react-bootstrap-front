import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader, DefaultSidebar, DefaultFooter } from './';
import { WidthObserver } from '../advanced';

const duration = 500;

const DesktopHeaderHeight = 60;
const DesktopFooterHeight = 60;
const DesktopRightWidthMini = 60;
const DesktopSideWidthMaxi = 250;
const DesktopRightWidthMaxi = 400;
const DesktopSideWidthMini = 52;

const sideMenuDefaultStyles = {
  transition: `width ${duration}ms`,
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
  transition: `top ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '-350px',
  height: '350px',
  zIndex: '900',
};

const userMenuStyles = {
  entering: { top: '0px' },
  entered: { top: '0px' },
  exiting: { top: '-350px' },
  exited: { top: '-350px' },
};

const headerMenuStyles = {
  entering: { top: '350px' },
  entered: { top: '350px' },
  exiting: { top: '0px' },
  exited: { top: '0px' },
};

const rightPanel = {
  entering: { right: `0px` },
  entered: { right: `0px` },
  exiting: { right: `-${DesktopRightWidthMaxi - DesktopRightWidthMini}px` },
  exited: { right: `-${DesktopRightWidthMaxi - DesktopRightWidthMini}px` },
};

const headerMenuDefaultStyles = {
  zIndex: '900',
  position: 'fixed',
  top: '0px',
  right: '0px',
  left: '0px',
  height: `${DesktopHeaderHeight}px`,
  lineHeight: `${DesktopHeaderHeight}px`,
  transition: `top ${duration}ms`,
  animationIterationCount: '1',
  overflow: 'hidden',
};

let contentDefaultStyles = {
  transition: `all ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  left: `${DesktopSideWidthMaxi}px`,
  right: `${DesktopRightWidthMini}px`,
  top: `${DesktopHeaderHeight}px`,
  bottom: `${DesktopFooterHeight}px`,
  height: 'auto',
  zIndex: '810',
};

const rightPanelStyles = {
  transition: `right ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  right: `-${DesktopRightWidthMaxi - DesktopRightWidthMini}px`,
  top: `${DesktopHeaderHeight}px`,
  bottom: `0px`,
  height: 'auto',
  width: `${DesktopRightWidthMaxi}px`,
  zIndex: '810',
};

let contentStyles = {
  entering: { left: `${DesktopSideWidthMaxi}px` },
  entered: { left: `${DesktopSideWidthMaxi}px` },
  exiting: { left: `${DesktopSideWidthMini}px` },
  exited: { left: `${DesktopSideWidthMini}px` },
};

const contentStylesPanel = {
  entering: { right: `${DesktopRightWidthMaxi}px` },
  entered: { right: `${DesktopRightWidthMaxi}px` },
  exiting: { right: `${DesktopRightWidthMini}px` },
  exited: { right: `${DesktopRightWidthMini}px` },
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
    rightPanel: PropTypes.element,
    rightPanelOpened: PropTypes.bool,
  };
  static defaultProps = {
    footer: true,
    rightPanel: null,
    rightPanelOpened: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.authenticated) {
      let menuMaxi = true;
      if (props.settings && (props.settings.menuposition === true || props.settings.menuposition === false)) {
        menuMaxi = props.settings.menuposition;
      }
      return { menuDataOpen: false, menuUserOpen: false, menuSideMini: !menuMaxi };
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
    this.props.onChangeSettings('menuposition', true);
  }

  render() {
    const userForm = React.cloneElement(this.props.userForm, { onClose: this.onToggleUser });
    if (!this.props.rightPanel) {
      contentDefaultStyles.right = '0px';
    } else {
      contentDefaultStyles.right = `${DesktopRightWidthMini}px`;
    }
    if (this.props.authenticated) {
      contentDefaultStyles.left = `${DesktopSideWidthMaxi}px`;
      contentDefaultStyles.right = `${DesktopRightWidthMini}px`;
      contentDefaultStyles.top = `${DesktopHeaderHeight}px`;
      contentStyles = {
        entering: { left: `${DesktopSideWidthMaxi}px` },
        entered: { left: `${DesktopSideWidthMaxi}px` },
        exiting: { left: `${DesktopSideWidthMini}px` },
        exited: { left: `${DesktopSideWidthMini}px` },
      };
    } else {
      contentDefaultStyles.left = `0px`;
      contentDefaultStyles.right = `0px`;
      contentDefaultStyles.top = `0px`;
      contentStyles = {
        entering: { left: `0px` },
        entered: { left: `0px` },
        exiting: { left: `0px` },
        exited: { left: `0px` },
      };
    }
    return (
      <div id="page-root" className="full-page">
        <div className="display-desktop">
          <WidthObserver>
            {this.props.authenticated && (
              <CSSTransition in={this.state.menuUserOpen} timeout={duration}>
                {state => (
                  <div>
                    <div
                      className="bg-white overflow-hidden"
                      style={{ ...userMenuDefaultStyles, ...userMenuStyles[state] }}
                    >
                      {userForm}
                    </div>
                    <div style={{ ...headerMenuDefaultStyles, ...headerMenuStyles[state] }}>
                      <DefaultHeader
                        {...this.props}
                        {...this.state}
                        desktopHeaderHeight={DesktopHeaderHeight}
                        onToggleUser={this.onToggleUser}
                      />
                    </div>
                  </div>
                )}
              </CSSTransition>
            )}
            <CSSTransition in={!this.state.menuSideMini} timeout={duration}>
              {state => (
                <div>
                  {this.props.authenticated && (
                    <div
                      className="bg-light"
                      style={{
                        ...sideMenuDefaultStyles,
                        ...sideMenuStyles[state],
                        bottom: this.props.footer ? `${DesktopFooterHeight}px` : '0px',
                      }}
                    >
                      <DefaultSidebar
                        {...this.props}
                        open={!this.state.menuSideMini}
                        onOpenSide={this.onOpenSide}
                        onToggleSide={this.onToggleSide}
                      />
                    </div>
                  )}
                  <CSSTransition in={this.props.rightPanelOpened} timeout={duration}>
                    {state2 => (
                      <div
                        className="rbf-page-content"
                        style={{
                          ...contentDefaultStyles,
                          ...contentStyles[state],
                          ...contentStylesPanel[state2],
                          bottom: this.props.footer ? `${DesktopFooterHeight}px` : '0px',
                        }}
                      >
                        {this.props.backgroundImg && (
                          <img className="fond-page-content" src={this.props.backgroundImg} alt="Background" />
                        )}
                        {this.props.children}
                      </div>
                    )}
                  </CSSTransition>
                  <CSSTransition in={this.props.rightPanelOpened} timeout={duration}>
                    {state2 => (
                      <div className={classnames("ui-page-right-panel", this.props.authenticated && 'bg-light')} style={{ ...rightPanelStyles, ...rightPanel[state2] }}>
                        {this.props.rightPanel}
                      </div>
                    )}
                  </CSSTransition>
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

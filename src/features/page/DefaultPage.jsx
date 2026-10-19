import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader, DefaultSidebar, DefaultFooter } from './';
import { WidthObserver } from '../advanced';
import { readStoredNumber, writeStoredNumber } from '../helpers/storedFlag';
import { maxRightPanelWidth, clampRightPanelWidth } from './rightPanelWidth';

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

/* Le panneau droit a une largeur réglable : ses positions dépendent d'elle. Replié,
   il ne laisse voir que sa barre d'icônes (DesktopRightWidthMini). */
const rightPanelFor = width => ({
  entering: { right: `0px` },
  entered: { right: `0px` },
  exiting: { right: `-${width - DesktopRightWidthMini}px` },
  exited: { right: `-${width - DesktopRightWidthMini}px` },
});

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

const contentStylesPanelFor = width => ({
  entering: { right: `${width}px` },
  entered: { right: `${width}px` },
  exiting: { right: `${DesktopRightWidthMini}px` },
  exited: { right: `${DesktopRightWidthMini}px` },
});

const RIGHT_PANEL_STORAGE = 'rbf.page.rightPanel.';

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
    rightPanelWidth: PropTypes.number,
    rightPanelDefaultWidth: PropTypes.number,
    rightPanelMinWidth: PropTypes.number,
    contentMinWidth: PropTypes.number,
    rightPanelStorageKey: PropTypes.string,
    onRightPanelResize: PropTypes.func,
    t: PropTypes.func,
  };
  static defaultProps = {
    footer: true,
    rightPanel: null,
    rightPanelOpened: false,
    rightPanelWidth: null,
    rightPanelDefaultWidth: DesktopRightWidthMaxi,
    rightPanelMinWidth: 320,
    contentMinWidth: 480,
    rightPanelStorageKey: null,
    onRightPanelResize: null,
    t: null,
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
      rightPanelWidth: readStoredNumber(
        props.rightPanelStorageKey ? RIGHT_PANEL_STORAGE + props.rightPanelStorageKey + '.width' : null,
        props.rightPanelDefaultWidth
      ),
      resizing: false,
    };
    this.resizeStart = null;
    this.onToggleData = this.onToggleData.bind(this);
    this.onToggleSide = this.onToggleSide.bind(this);
    this.onToggleUser = this.onToggleUser.bind(this);
    this.onOpenSide = this.onOpenSide.bind(this);
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResizeMove = this.onResizeMove.bind(this);
    this.onResizeEnd = this.onResizeEnd.bind(this);
    this.onResizeKey = this.onResizeKey.bind(this);
  }

  componentWillUnmount() {
    this.stopResizeListeners();
  }

  /* Largeur du panneau droit : contrôlée par l'application si fournie, sinon mémorisée ici. */
  rightPanelWidth() {
    return this.props.rightPanelWidth !== null ? this.props.rightPanelWidth : this.state.rightPanelWidth;
  }

  rightPanelMaxWidth() {
    const windowWidth = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 1280;
    const sidebar = this.props.authenticated ? (this.state.menuSideMini ? DesktopSideWidthMini : DesktopSideWidthMaxi) : 0;
    return maxRightPanelWidth(windowWidth, sidebar, this.props.contentMinWidth, this.props.rightPanelMinWidth);
  }

  setRightPanelWidth(width, final = true) {
    const clamped = clampRightPanelWidth(width, this.props.rightPanelMinWidth, this.rightPanelMaxWidth());
    if (this.props.rightPanelWidth === null) {
      this.setState({ rightPanelWidth: clamped });
      if (final) {
        writeStoredNumber(
          this.props.rightPanelStorageKey ? RIGHT_PANEL_STORAGE + this.props.rightPanelStorageKey + '.width' : null,
          clamped
        );
      }
    }
    if (this.props.onRightPanelResize && final) {
      this.props.onRightPanelResize(clamped);
    }
  }

  stopResizeListeners() {
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
    document.removeEventListener('touchmove', this.onResizeMove);
    document.removeEventListener('touchend', this.onResizeEnd);
  }

  /* La poignée : on tire vers la gauche pour élargir le panneau. */
  onResizeStart(event) {
    const point = event.touches ? event.touches[0] : event;
    this.resizeStart = { x: point.clientX, width: this.rightPanelWidth() };
    this.setState({ resizing: true });
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
    document.addEventListener('touchmove', this.onResizeMove, { passive: false });
    document.addEventListener('touchend', this.onResizeEnd);
    if (event.preventDefault) {
      event.preventDefault();
    }
  }

  onResizeMove(event) {
    if (!this.resizeStart) {
      return;
    }
    const point = event.touches ? event.touches[0] : event;
    if (event.cancelable && event.preventDefault) {
      event.preventDefault();
    }
    this.setRightPanelWidth(this.resizeStart.width + (this.resizeStart.x - point.clientX), false);
  }

  onResizeEnd() {
    if (!this.resizeStart) {
      return;
    }
    this.resizeStart = null;
    this.stopResizeListeners();
    this.setState({ resizing: false });
    this.setRightPanelWidth(this.rightPanelWidth(), true);
  }

  onResizeKey(event) {
    const step = event.shiftKey ? 64 : 16;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.setRightPanelWidth(this.rightPanelWidth() + step);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.setRightPanelWidth(this.rightPanelWidth() - step);
    }
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
    const panelWidth = this.rightPanelWidth();
    const rightPanel = rightPanelFor(panelWidth);
    const contentStylesPanel = contentStylesPanelFor(panelWidth);
    const noTransition = this.state.resizing ? { transition: 'none' } : {};
    const resizeTitle = this.props.t
      ? this.props.t({ id: 'rbf.page.rightPanel.resize', defaultMessage: 'Régler la largeur du panneau' })
      : 'Régler la largeur du panneau';
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
                          ...noTransition,
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
                      <div
                        className={classnames('ui-page-right-panel', this.props.authenticated && 'bg-light')}
                        style={{ ...rightPanelStyles, width: `${panelWidth}px`, ...rightPanel[state2], ...noTransition }}
                      >
                        {this.props.rightPanelOpened && (
                          <div
                            className={classnames('rbf-page-right-resizer', this.state.resizing && 'active')}
                            role="separator"
                            aria-orientation="vertical"
                            aria-valuenow={panelWidth}
                            aria-valuemin={this.props.rightPanelMinWidth}
                            aria-valuemax={this.rightPanelMaxWidth()}
                            tabIndex={0}
                            title={resizeTitle}
                            onMouseDown={this.onResizeStart}
                            onTouchStart={this.onResizeStart}
                            onKeyDown={this.onResizeKey}
                          />
                        )}
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { MobilePublicHeader, MobilePrivateHeader, MobileFooterMenu, MobileMenu } from './';
import { Container } from '../grid';

const duration = 500;
const MobileHeaderHeight = 60;
const MobileFooterHeight = 80;

const headerMobileStyles = {
  zIndex: '900',
  position: 'fixed',
  top: '0px',
  right: '0px',
  left: '0px',
  height: `${MobileHeaderHeight}px`,
  lineHeight: `${MobileHeaderHeight}px`,
  transition: `top ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
};

const footerMobileStyles = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  bottom: '0px',
  height: `${MobileFooterHeight}px`,
  zIndex: '870',
};

const contentMobileStyles = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: `${MobileHeaderHeight}px`,
  bottom: `${MobileFooterHeight}px`,
  height: 'auto',
  overflowX: 'hidden',
  overflowY: 'auto',
  zIndex: '810',
};

const userMenuDefaultStyles = {
  transition: `top ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: 'calc(-100% - 60px)',
  height: 'calc(100% - 60px)',
  zIndex: '900',
  overflowY: 'auto',
};

const userMenuStyles = {
  entering: { top: '0px' },
  entered: { top: '0px' },
  exiting: { top: 'calc(-100% - 60px)' },
  exited: { top: 'calc(-100% - 60px)' },
};

const headerMenuStyles = {
  entering: { top: 'calc(100% - 60px)' },
  entered: { top: 'calc(100% - 60px)' },
  exiting: { top: '0px' },
  exited: { top: '0px' },
};

export default class MobilePage extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    userForm: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      menuDataOpen: false,
      menuUserOpen: false,
      menuOpened: false,
    };
    this.onToggleData = this.onToggleData.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onToggleUser = this.onToggleUser.bind(this);
    this.onCloseMenu = this.onCloseMenu.bind(this);
  }

  onToggleData() {
    this.setState({ menuDataOpen: !this.state.menuDataOpen });
  }

  onToggleUser() {
    this.setState({ menuUserOpen: !this.state.menuUserOpen });
  }

  onToggleMenu() {
    this.setState({ menuOpened: !this.state.menuOpened });
  }

  onCloseMenu() {
    this.setState({ menuOpened: false });
  }

  render() {
    const userForm = React.cloneElement(this.props.userForm, { onClose: this.onToggleUser });
    return (
      <div id="page-root" className="full-page">
        <Container size="xs" className="display-mobile">
          <CSSTransition in={this.state.menuUserOpen} timeout={duration}>
            {state => (
              <div>
                <div className="bg-white" style={{ ...userMenuDefaultStyles, ...userMenuStyles[state] }}>
                  {userForm}
                </div>
                <div style={{ ...headerMobileStyles, ...headerMenuStyles[state] }}>
                  {this.props.authenticated ? (
                    <MobilePrivateHeader {...this.props} {...this.state} onToggleUser={this.onToggleUser} />
                  ) : (
                    <MobilePublicHeader {...this.props} />
                  )}
                </div>
              </div>
            )}
          </CSSTransition>
          <CSSTransition in={!this.state.menuSideMini} timeout={duration}>
            {state => (
              <>
                <div className="page-root-mobile-content" style={{ ...contentMobileStyles }}>
                  {this.state.menuOpened ? (
                    <MobileMenu {...this.props} onCloseMenu={this.onCloseMenu} />
                  ) : (
                    this.props.children
                  )}
                </div>
                <div style={footerMobileStyles}>
                  <MobileFooterMenu {...this.props} onToggleMenu={this.onToggleMenu} onCloseMenu={this.onCloseMenu} />
                </div>
              </>
            )}
          </CSSTransition>
        </Container>
      </div>
    );
  }
}

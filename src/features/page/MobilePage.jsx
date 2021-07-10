import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MobilePublicHeader, MobileFooterMenu, MobileMenu } from './';
import { Container } from '../grid';

const MobileHeaderHeight = 60;
const MobileFooterHeight = 60;

const headerMobileStyles = {
  zIndex: '900',
  position: 'fixed',
  top: '0px',
  right: '0px',
  left: '0px',
  height: `${MobileHeaderHeight}px`,
  lineHeight: `${MobileHeaderHeight}px`,
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
    if (!this.props.authenticated) {
      contentMobileStyles.top = `${MobileFooterHeight}px`;
    } else {
      contentMobileStyles.top = '0px';
    }
    return (
      <div id="page-root" className="full-page">
        <Container size="xs" className="display-mobile">
          {!this.props.authenticated && (
            <div style={headerMobileStyles}>
              <MobilePublicHeader {...this.props} />
            </div>
          )}
          <div style={{ ...contentMobileStyles }}>
            {this.state.menuOpened ? (
              <MobileMenu {...this.props} onCloseMenu={this.onCloseMenu} />
            ) : (
              this.props.children
            )}
          </div>
          <div style={footerMobileStyles}>
            <MobileFooterMenu {...this.props} onToggleMenu={this.onToggleMenu} onCloseMenu={this.onCloseMenu} />
          </div>
        </Container>
      </div>
    );
  }
}

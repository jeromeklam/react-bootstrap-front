import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MobileFooterMenu } from './';

import { Container } from '../grid';

const MobileFooterHeight = 60;

const footerMobileStyles = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  bottom: '0px',
  height: `${MobileFooterHeight}px`,
  lineHeight: `${MobileFooterHeight}px`,
  zIndex: '870',
};

const contentMobileStyles = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: `${MobileFooterHeight}px`,
  height: 'auto',
  overflowX: 'hidden',
  overflowY: 'auto',
  zIndex: '810',
};

export default class ResponsivePage extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    userForm: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      menuDataOpen: false,
      menuUserOpen: false,
      menuSideOpen: false,
    };
    this.onToggleData = this.onToggleData.bind(this);
    this.onToggleSide = this.onToggleSide.bind(this);
    this.onToggleUser = this.onToggleUser.bind(this);
  }

  onToggleData() {
    this.setState({ menuDataOpen: !this.state.menuDataOpen });
  }

  onToggleUser() {
    this.setState({ menuUserOpen: !this.state.menuUserOpen });
  }

  onToggleSide() {
    this.setState({ menuSideOpen: !this.state.menuSideOpen });
  }

  render() {
    return (
      <div id="page-root" className="full-page">
        <Container size="xs" className="display-mobile">
          <div style={{ ...contentMobileStyles }}>{this.props.children}</div>
          <div style={footerMobileStyles}>
            <MobileFooterMenu {...this.props} />
          </div>
        </Container>
      </div>
    );
  }
}

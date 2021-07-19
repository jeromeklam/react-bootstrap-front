import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { MobileHeader } from './';

const navLinkStyles = {
  padding: '0rem 0.5rem',
};

export const MobilePublicHeader = props => (
  <MobileHeader>
    <div className="row">
      <div className="col-xs-w20">
        <span className="header-title pl-2">{props.title}</span>
      </div>
      <div className="col-xs-w16 text-right">
      </div>
    </div>
  </MobileHeader>
);

MobilePublicHeader.propTypes = {
  title: PropTypes.func.isRequired,
  options: PropTypes.element.isRequired,
  onToggleSide: PropTypes.func,
  authenticated: PropTypes.bool.isRequired,
  location: PropTypes.element.isRequired,
  onNavigate: PropTypes.func.isRequired,
  menuIcon: PropTypes.element,
};

MobilePublicHeader.defaultProps = {
  onToggleSide: null,
  menuIcon: null,
};

import React from 'react';
import PropTypes from 'prop-types';

const MobileHeaderHeight = 50;

const headerStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  height: `${MobileHeaderHeight}px`,
  zIndex: '9999',
};

export const MobilePageHeader = props => (
  <header className="page-mobile-page-header w-100 bg-secondary text-light" style={headerStyles}>
    {props.children && props.children}
  </header>
);

MobilePageHeader.propTypes = {
  children: PropTypes.element,
};

MobilePageHeader.defaultProps = {
  children: null,
};

import React from 'react';
import PropTypes from 'prop-types';

const MobileHeaderHeight = 60;

const headerStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  height: `${MobileHeaderHeight}px`,
};

export const MobileHeader = props => (
  <header className="mobile-header w-100 bg-secondary text-light" style={headerStyles}>
    {props.children && props.children}
  </header>
);

MobileHeader.propTypes = {
  children: PropTypes.element,
};

MobileHeader.defaultProps = {
  children: null,
};

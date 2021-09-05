import React from 'react';
import PropTypes from 'prop-types';

const DefaultHeaderHeight = 50;

const headerStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  height: `${DefaultHeaderHeight}px`,
  lineHeight: `${DefaultHeaderHeight}px`,
  zIndex: '9999',
};

export const DefaultPageHeader = props => (
  <header className="page-default-page-header w-100 text-secondary bg-light" style={headerStyles}>
    {props.children && props.children}
  </header>
);

DefaultPageHeader.propTypes = {
  children: PropTypes.element,
};

DefaultPageHeader.defaultProps = {
  children: null,
};

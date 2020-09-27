import React from 'react';
import PropTypes from 'prop-types';

const mystyle = {
  height: '50px',
  lineHeight: '50px',
  fontWeight: 'bold',
  paddingLeft: '5px',
  paddingRight: '5px',
  paddingTop: '0px',
  paddingBottom: '0px',
  left: '0px',
  position: 'absolute',
  right: '0px',
  top: '0px',
  zIndex: '700',
};

export const DefaultTitle = props => (
  <div style={mystyle} className="bg-secondary-light text-secondary">
    <span>{props.root}</span>
  </div>
);

DefaultTitle.propTypes = {
  root: PropTypes.string.isRequired,
};

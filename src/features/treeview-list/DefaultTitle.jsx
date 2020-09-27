import React from 'react';

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
  top: '50px',
  zIndex: '700',
};

export const DefaultTitle = () => (
  <div style={mystyle} className="default-list-title row bg-secondary-light text-secondary">
  </div>
);

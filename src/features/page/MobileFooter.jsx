import React from 'react';

const mystyle = {
  position: 'absolute',
  bottom: '0',
  width: '100%',
  height: '40px',
  lineHeight: '40px',
  zIndex: '800',
};

export const MobileFooter = () => (
  <div style={mystyle} className="bg-light">
    <div className="container">
      <div className="row">
        <div className="col-xxs-w20" />
        <div className="col-xxs-w16 text-right" />
      </div>
    </div>
  </div>
);

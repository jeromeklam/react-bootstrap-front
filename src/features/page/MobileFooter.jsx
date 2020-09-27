import React from 'react';

const mystyle = {
  position: 'absolute',
  bottom: '0',
  width: '100%',
  height: '60px',
  lineHeight: '60px',
  zIndex: '800',
};

export const MobileFooter = () => (
  <div style={mystyle} className="bg-light">
    <div className="container">
      <div className="row">
        <div className="col-20" />
        <div className="col-16 text-right" />
      </div>
    </div>
  </div>
);

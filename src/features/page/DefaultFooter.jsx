import React from 'react';
import PropTypes from 'prop-types';

const mystyle = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  width: '100%',
  height: 'auto',
  lineHeight: 'auto',
};

export const DefaultFooter = props => (
  <div style={mystyle} className="bg-light">
    <div className="container">
      <div className="row">
        <div className="col-xs-w20">
          {props.options.map((option) => {
            if (option.role === 'ABOUT') {
              return (
                <a
                  onClick={() => {
                    props.onNavigate(option.url);
                  }}
                >
                  <span className="text-muted">{option.label}</span>
                </a>
              );
            }
            return null;
          })}
        </div>
        <div className="col-xs-w16 text-right">
          {props.options.map((option) => {
            if (option.role === 'SOCIAL') {
              return (
                <span>{option.icon}</span>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  </div>
);

DefaultFooter.propTypes = {
  options: PropTypes.element.isRequired,
};

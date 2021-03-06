import React from 'react';
// import PropTypes from 'prop-types';

export default function HighlightClose() {
  return (
    <div className="close-icon-container">
      <span className="close-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
          <line
            x1="15"
            y1="15"
            x2="25"
            y2="25"
            stroke="#000"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-miterlimit="10"
          />
          <line
            x1="25"
            y1="15"
            x2="15"
            y2="25"
            stroke="#000"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-miterlimit="10"
          />
        </svg>
      </span>
    </div>
  );
}

HighlightClose.propTypes = {};
HighlightClose.defaultProps = {};

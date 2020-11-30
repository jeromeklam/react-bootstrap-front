import React, { useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default function SvgToday(props) {
  return (
    <div
      className={classnames('advanced-svg-today', props.className)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
        <path
          className="today-btn__svg"
          d="M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z"
        />
      </svg>
    </div>
  );
}

SvgToday.propTypes = {
  className: PropTypes.string,
};
SvgToday.defaultProps = {
  className: '',
};

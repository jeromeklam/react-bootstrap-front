import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function HighlightArrow(props) {
  return (
    <div className={classnames(props.className)}>
      <svg viewBox="0 0 18.4 14.4">
        <path
          d={props.inverted ? 'M17 7.2H1M10.8 1L17 7.2l-6.2 6.2' : 'M1.4 7.2h16M7.6 1L1.4 7.2l6.2 6.2'}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}

HighlightArrow.propTypes = {
  className: PropTypes.string,
  inverted: PropTypes.bool,
};
HighlightArrow.defaultProps = {
  className: '',
  inverted: false,
};

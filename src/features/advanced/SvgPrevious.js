import React from 'react';
import classnames from 'classnames';
// import PropTypes from 'prop-types';

export default function SvgPrevious(props) {
  return (
    <div className={classnames('advanced-svg-previous', props.className)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </div>
  );
}

SvgPrevious.propTypes = {};
SvgPrevious.defaultProps = {};

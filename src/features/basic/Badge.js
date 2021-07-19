import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Badge(props) {
  return (
    <button
      className={classnames('btn-badge', props.className, !props.onClick && 'btn-badge-div')}
      onClick={props.onClick || null}
    >
      {props.icon}
      <span className={classnames('badge', props.text && `text-${props.text}`, props.color && `badge-${props.color}`)}>
        {props.count}
      </span>
    </button>
  );
}

Badge.propTypes = {
  className: PropTypes.string,
};

Badge.defaultProps = {
  className: 'btn btn-secondary',
};

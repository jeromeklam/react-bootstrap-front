import React, { useEffect } from 'react';
import classnames from 'classnames';

export default function Badge(props) {
  return (
    <button className="btn btn-light" onClick={props.onClick || null}>
      {props.icon}
      <span
        className={classnames(
          'badge',
          props.text && `text-${props.text}`,
          props.color && `badge-${props.color}`
        )}
      >
        {props.count}
      </span>
    </button>
  );
}

Badge.propTypes = {};
Badge.defaultProps = {};

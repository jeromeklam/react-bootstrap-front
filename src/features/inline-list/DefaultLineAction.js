import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function DefaultLineAction(props) {
  return (
    <div className="inline-list-default-line-action">
      <button className={classnames('', props.className)} onClick={props.onClick}>
        {props.label}
      </button>
    </div>
  );
}

DefaultLineAction.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
DefaultLineAction.defaultProps = {
  className: '',
};

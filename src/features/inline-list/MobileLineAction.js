import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function MobileLineAction(props) {
  return (
    <div className="inline-list-mobile-line-action w-100 pt-2">
      <button className={classnames('w-100', props.className)} onClick={props.onClick}>
        {props.label}
      </button>
    </div>
  );
};

MobileLineAction.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
MobileLineAction.defaultProps = {
  classname: '',
}
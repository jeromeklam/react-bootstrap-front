import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function MobileLineText(props) {
  return (
    <div className={classnames("inline-list-mobile-line-text p-2 text-center", props.className)}>
      <span>{props.label}</span>
    </div>
  );
};

MobileLineText.propTypes = {
  className: PropTypes.string,
};
MobileLineText.defaultProps = {
  classname: '',
}
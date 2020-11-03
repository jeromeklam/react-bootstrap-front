import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default function InputGroupText(props) {
  const { className, children, otherProps } = props;
  return (
    <span {...otherProps} className={classnames('input-group-text', className && className)}>
      {children}
    </span>
  );
};

InputGroupText.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};
InputGroupText.defaultProps = {
  children: null,
  className: '',
};

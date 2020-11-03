import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default function InputGroupPrepend(props) {
  const { className, children, otherProps } = props;
  return (
    <div {...otherProps} className={classnames('input-group-prepend', className && className)}>
      {children}
    </div>
  );
};

InputGroupPrepend.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};
InputGroupPrepend.defaultProps = {
  children: null,
  className: '',
};

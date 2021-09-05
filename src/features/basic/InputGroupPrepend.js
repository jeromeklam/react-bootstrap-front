import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { isChildEmpty } from '../helpers';

export default function InputGroupPrepend(props) {
  const { className, children, otherProps } = props;
  if (isChildEmpty(children)) {
    return null;
  }
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

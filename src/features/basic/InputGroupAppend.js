import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { isChildEmpty } from '../helpers';

export default function InputGroupAppend(props) {
  const { className, children, otherProps } = props;
  if (isChildEmpty(children)) {
    return null;
  }
  return (
    <div {...otherProps} className={classnames('input-group-append', className && className)}>
      {children}
    </div>
  );
}

InputGroupAppend.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};
InputGroupAppend.defaultProps = {
  children: null,
  className: '',
};

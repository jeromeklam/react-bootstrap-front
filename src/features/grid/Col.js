import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { colSizeAsClassName } from './';

export default function Col(props) {
  /* Les props restantes (id, role, aria-*, data-*) atteignent le div. */
  const { size, textAlign, className, children, ...otherProps } = props;
  return (
    <div
      {...otherProps}
      className={classnames('col', colSizeAsClassName(size), textAlign && `text-${textAlign}`, className && className)}
    >
      {children}
    </div>
  );
}

Col.propTypes = {
  children: PropTypes.element,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  textAlign: PropTypes.string,
};
Col.defaultProps = {
  children: null,
  size: 'auto',
  textAlign: null,
};

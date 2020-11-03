import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { colSizeAsClassName } from './';

export default function Col(props) {
  const { size, otherProps } = props;
  return (
    <div
      {...otherProps}
      className={classnames(
        'col',
        colSizeAsClassName(size),
        props.textAlign && `text-${props.textAlign}`,
        props.className && props.className
      )}
    >
      {props.children}
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

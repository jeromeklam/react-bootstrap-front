import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const sizeExtension = size => {
  const mySize = parseInt(size, 10);
  if (size && isNaN(mySize)) {
    switch (size.toLowerCase()) {
      case 'block':
      case 'show':
        return 'flex';
      case 'hidden':
      case 'none':
        return 'none';
      default:
        return 'auto';
    }
  } else {
    if (mySize > 0) {
      return 'w' + mySize;
    }
    return 'none';
  }
};

const colSizeAsClassName = size => {
  if (typeof size === 'object') {
    let mySizes = '';
    Object.keys(size).forEach(width => {
      const mySize = size[width];
      mySizes += ' col-' + width + '-' + sizeExtension(mySize);
    });
    if (mySizes.trim() === '') {
      return 'col-xs-none';
    }
    return mySizes.trim();
  } else {
    return 'col-xs-' + sizeExtension(size);
  }
};

export default function Col(props) {
  const { size, otherProps } = props;
  return (
    <div {...otherProps} className={classnames('col', colSizeAsClassName(size), props.className)}>
      {props.children}
    </div>
  );
}

Col.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  children: PropTypes.element,
};
Col.defaultProps = {
  children: null,
  size: 'auto',
};

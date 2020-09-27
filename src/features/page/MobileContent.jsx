import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const mystyle = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
};

export const MobileContent = props => (
  <div className={classnames(props.className)} style={mystyle}>
    {props.children}
  </div>
);

MobileContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};

MobileContent.defaultProps = {
  children: null,
  className: '',
};

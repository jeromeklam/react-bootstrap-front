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

export const DefaultContent = props => (
  <div style={mystyle}>
    <div className="custom-scrollbar" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div className={classnames(props.className)}>
        {props.children}
      </div>
    </div>
  </div>
);

DefaultContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};

DefaultContent.defaultProps = {
  children: null,
  className: '',
};

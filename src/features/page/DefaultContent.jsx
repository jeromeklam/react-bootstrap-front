import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const myLocalStyle = {
  position: 'absolute',
  top: '50px',
  left: '0px',
  right: '0px',
  bottom: '0px',
};
const headerStyle = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  height: '50px',
}

export const DefaultContent = props => {
  let inlineStyle = {...myLocalStyle};
  if (!props.header) {
    inlineStyle.top = '0px';
  }
  return (
    <>
      {props.header && <div className="rbf-responsive-content-header" style={headerStyle} />}
      <div style={inlineStyle}>
        <div className="custom-scrollbar" style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          <div className={classnames(props.className)}>
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}

DefaultContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
  header: PropTypes.bool,
};

DefaultContent.defaultProps = {
  children: null,
  className: '',
  header: true,
};

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uuidv1 from 'uuid/v1';

function Highlight(props) {
  const id = props.id || uuidv1()
  let datas = {
    'data-theme': props.theme,
    'data-position': props.position,
  };
  const { children, className, title, style, otherProps } = props;  
  if (title === '') {
    return children;
  } 
  return (
    <div
      id={id}
      className={classnames('tour-highlight', className)}
      style={style}
      {...otherProps}
      {...datas}
    >
      {children}
      <div className="tour-highlight-content" style={{ display: 'none' }}>
        <span>{title}</span>
      </div>
    </div>
  );
}

Highlight.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  theme: PropTypes.string,
  title: PropTypes.string,
};

Highlight.defaultProps = {
  children: null,
  className: null,
  position: 'bottom',
  theme: 'ALL',
  title: '',
};

export default Highlight;

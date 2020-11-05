import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uuidv1 from 'uuid/v1';
import reducer from './redux/reducer';
import initialState from './redux/initialState';
import { addHighlight, removeHighlight } from './redux/actions';

function Highlight(props) {
  const [state, setState] = useState({ id: null, ref: null });
  const [store, dispatch] = useReducer(reducer, initialState);
  let newState = state;
  if (!state.id) {
    newState = { id: uuidv1(), ref: React.createRef() };
    setState(newState);
  }
  let datas = {
    'data-tour-theme': props.theme,
    'data-tour-position': props.position,
  };
  const index = store.highlights.find(elem => elem.id === newState.id);
  if (!index) {
    dispatch(addHighlight({ id: newState.id, ref: newState.ref, theme: props.theme, position: props.position }));
  }
  useEffect(() => {
    return () => {dispatch(removeHighlight(newState.id))};
  }, [newState.id]);
  const { children, className, title, style, otherProps } = props;
  return (
    <div
      ref={newState.ref}
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

import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1'
import reducer from './redux/reducer';
import initialState from './redux/initialState';
import { addHighlight } from './redux/actions';

function Highlight(props) {
  const [state, setState] = useState({id: null, ref: null});
  const [store, dispatch] = useReducer(reducer, initialState);
  let newState = state;
  if (!state.id) {
    newState = {id: uuidv1(), ref:React.createRef()};
    setState(newState);
  }
  let datas = {
    'data-tour-theme': props.theme,
  };
  const index = store.highlights.find(elem => elem.id === newState.id);
  if (!index) {
    dispatch(addHighlight({ id: newState.id, ref: newState.ref, theme: props.theme }));
  }
  return (
    <div ref={newState.ref} style={{ position: 'absolute' }} className="tour-highlight" {...datas}>
      <div style={{display: 'none'}}>
        {props.children ? props.children : <span>{props.title}</span>}
      </div>
    </div>
  );
}

Highlight.propTypes = {
  children: PropTypes.element,
  theme: PropTypes.string,
  title: PropTypes.string,
};

Highlight.defaultProps = {
  children: null,
  theme: 'ALL',
  title: '',
};

export default Highlight;
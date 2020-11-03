import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import reducer from './redux/reducer';
import initialState from './redux/initialState';
import { startHighlight, stopHighlight } from './redux/actions';
import { Dropdown } from '../basic';

function HighlightButton(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div
      className={classnames('help-toggler', props.className)}
      onClick={(e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (!state.started) {
          dispatch(startHighlight(props.theme));
        } else {
          dispatch(stopHighlight());
        }
      }}
      title="Aide"
    >
      <span>
        <b>?</b>
      </span>
      {state.started && (
        <Dropdown myRef={state.highlights[4].ref} onClose={() => dispatch(stopHighlight())}>
          <div className="card">
            <div className="card-body">TEST</div>
            {console.log(state.highlights)}
          </div>
        </Dropdown>
      )}
    </div>
  );
}

HighlightButton.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string.isRequired,
};

HighlightButton.defaultProps = {
  className: '',
};

export default HighlightButton;

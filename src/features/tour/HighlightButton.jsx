import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import reducer from './redux/reducer';
import initialState from './redux/initialState';
import { startHighlight, stopHighlight, prevHighlight, nextHighlight } from './redux/actions';
import { getRefCoords } from '../helper';
import { Portal, SvgMask } from '../advanced';
import { Container, Row, Col } from '../grid';

function HighlightButton(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  let tour = null;
  if (state.started && state.highlights[state.current]) {
    const ref = state.highlights[state.current].ref;
    const coords = getRefCoords(ref);
    const content = ref.current.querySelector(".tour-highlight-content");
    console.log(content);
    const helpContent = <div contentEditable='true' dangerouslySetInnerHTML={{ __html: content.innerHTML }}></div>
    tour = (
      <Portal>
        <Container>
          <div className="highlight-back" />
          <SvgMask
            onClick={() => dispatch(stopHighlight())}
            windowWidth={coords.w}
            windowHeight={coords.h}
            targetWidth={coords.width}
            targetHeight={coords.height}
            targetTop={coords.top}
            targetLeft={coords.left}
            padding={10}
          />
          <div className="card hightlight-card">
            <div className="card-body">{helpContent}</div>
            <div className="card-footer">
              <Row>
                <Col size={10} align="left">
                  <button onClick={() => dispatch(prevHighlight())}>{'<<'}</button>
                </Col>
                <Col size={10} align="center">
                </Col>
                <Col size={10} align="right">
                  <button onClick={() => dispatch(nextHighlight())}>{'>>'}</button>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </Portal>
    );
  }
  return (
    <>
      <div
        className={classnames('help-toggler', props.className)}
        onClick={e => {
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
        <span className="highlight-toggler">
          <b>?</b>
        </span>
      </div>
      {state.started && tour}
    </>
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

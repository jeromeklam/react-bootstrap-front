import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HighlightArrow, HighlightClose } from './';
import reducer from './redux/reducer';
import initialState from './redux/initialState';
import {
  flushHighlight,
  addHighlight,
  startHighlight,
  stopHighlight,
  prevHighlight,
  nextHighlight,
  startHighlightTimer,
} from './redux/actions';
import { getRefCoords } from '../helper';
import { Portal, SvgMask, SvgTimer, SvgPlay, Follower } from '../advanced';
import { Container, Row, Col } from '../grid';

function HighlightButton(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  let tour = null;
  if (state.started && state.highlights[state.current]) {
    const { ref, position } = state.highlights[state.current];
    if (ref && !ref.current) {
      console.log(state.highlights, state.current);
    }
    const coords = getRefCoords(ref);
    const content = ref.current.querySelector('.tour-highlight-content');
    let htmlContent = content.innerHTML;
    htmlContent = htmlContent.replace(/\[RC\]/gi, '<br />');
    const helpContent = <div contentEditable="true" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    tour = (
      <Portal>
        <Container>
          <div className="highlight-back" />
          <SvgMask
            onClose={() => dispatch(stopHighlight())}
            windowWidth={coords.w}
            windowHeight={coords.h}
            targetWidth={coords.width}
            targetHeight={coords.height}
            targetTop={coords.top}
            targetLeft={coords.left}
            padding={10}
            rounded={true}
            disableInteraction={true}
            disableInteractionClassName=""
          />
          <Follower myRef={ref} align={position} onClose={() => dispatch(stopHighlight())}>
            <div className="card hightlight-card">
              <div className="card-body">
                <div className="highlight-close" onClick={() => dispatch(stopHighlight())}>
                  <HighlightClose />
                </div>
                {helpContent}
              </div>
              <div className="card-footer bg-light text-primary">
                <Row>
                  <Col className="highlight-arrow-wrapper float-left" size={10} textAlign="left">
                    <div onClick={() => dispatch(prevHighlight())}>
                      <HighlightArrow className="highlight-arrow" />
                    </div>
                  </Col>
                  <Col size={16} textAlign="center">
                    <div className="highlight-timer-wrapper text-primary">
                      {state.timer ? (
                        <SvgTimer
                          size={24}
                          duration={props.delay}
                          onComplete={() => {
                            dispatch(nextHighlight(true));
                            return [true, 100];
                          }}
                        />
                      ) : (
                        <SvgPlay size={24} onClick={() => dispatch(startHighlightTimer())} />
                      )}
                    </div>
                  </Col>
                  <Col size={10} textAlign="right">
                    <div className="highlight-arrow-wrapper float-right" onClick={() => dispatch(nextHighlight())}>
                      <HighlightArrow className="highlight-arrow" inverted />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Follower>
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
          dispatch(flushHighlight());
          if (!state.started) {
            const nodes = document.querySelectorAll('.tour-highlight');
            nodes.forEach(node => {
              const highlight = {
                id: node.id,
                ref: { current: node },
                theme: node.dataset.theme,
                position: node.dataset.position,
              };
              dispatch(addHighlight(highlight));
            });
            dispatch(startHighlight(props.theme));
          } else {
            dispatch(stopHighlight());
          }
        }}
        title="Aide"
      >
        {props.children ? (
          props.children
        ) : (
          <button type="button" className="btn btn-sm highlight-toggler">
            <b>?</b>
          </button>
        )}
      </div>
      {state.started && tour}
    </>
  );
}

HighlightButton.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  delay: PropTypes.number,
  theme: PropTypes.string.isRequired,
};

HighlightButton.defaultProps = {
  children: PropTypes.idRequired,
  className: '',
  delay: 3,
};

export default HighlightButton;

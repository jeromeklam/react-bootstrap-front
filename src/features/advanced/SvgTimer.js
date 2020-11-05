import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default function SvgTimer(props) {
  return (
    <div className={classnames('advanced-svg-timer', props.className)}>
      <CountdownCircleTimer
        size={props.size}
        isPlaying={props.isPlaying}
        duration={props.duration}
        strokeWidth={props.strokeWidth}
        colors={[['#004777', 0.33], ['#F7B801', 0.33], ['#A30000', 0.33]]}
        onComplete={props.onComplete}
      >
        {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
    </div>
  );
}

SvgTimer.propTypes = {
  duration: PropTypes.number,
  isPlaying: PropTypes.bool,
  onComplete: PropTypes.func,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
};

SvgTimer.defaultProps = {
  duration: 10,
  isPlaying: true,
  onComplete: () => {},
  size: 30,
  strokeWidth: 2,
};

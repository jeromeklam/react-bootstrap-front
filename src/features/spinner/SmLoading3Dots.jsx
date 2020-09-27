import React from 'react';
import PropTypes from 'prop-types';

export const SmLoading3Dots = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 120 30"
    xmlns="http://www.w3.org/2000/svg"
    fill={props.color}
    aria-label={props.label}
  >
    <circle cx="15" cy="15" r="10">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="10;5;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fillOpacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="15" r="5" attributeName="fillOpacity" from="1" to="0.3">
      <animate
        attributeName="r"
        from="9"
        to="9"
        begin="0s"
        dur="0.8s"
        values="5;10;5"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fillOpacity"
        from="0.5"
        to="0.5"
        begin="0s"
        dur="0.8s"
        values=".5;1;.5"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="105" cy="15" r="10">
      <animate
        attributeName="r"
        from="15"
        to="15"
        begin="0s"
        dur="0.8s"
        values="10;5;10"
        calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fillOpacity"
        from="1"
        to="1"
        begin="0s"
        dur="0.8s"
        values="1;.5;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

SmLoading3Dots.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  label: PropTypes.string,
};

SmLoading3Dots.defaultProps = {
  height: 20,
  width: 80,
  color: 'green',
  label: 'audio-loading',
};

import React from 'react';
import PropTypes from 'prop-types';

export const SmLoading9x9 = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 105 105" className={props.className} aria-label={props.label}>
    <circle cx="12.5" cy="12.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="0s"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="12.5" cy="52.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="100ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="52.5" cy="12.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="300ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="52.5" cy="52.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="600ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="92.5" cy="12.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="800ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="92.5" cy="52.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="400ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="12.5" cy="92.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="700ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="52.5" cy="92.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="500ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="92.5" cy="92.5" r="12.5">
      <animate
        attributeName="fill-opacity"
        begin="200ms"
        dur="1s"
        values="1;.2;1"
        calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

SmLoading9x9.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  label: PropTypes.string,
  className: PropTypes.string,
};

SmLoading9x9.defaultProps = {
  height: 32,
  width: 32,
  className: '',
  label: 'audio-loading',
};

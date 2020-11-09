import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const safe = sum => (sum < 0 ? 0 : sum)

export default function SvgMask(props) {
  const width = safe(props.targetWidth + props.padding * 2);
  const height = safe(props.targetHeight + props.padding * 2);
  const top = safe(props.targetTop - props.padding);
  const left = safe(props.targetLeft - props.padding);

  return (
    <div className={classnames("advanced-svg-mask", props.className)} onClick={props.onClick}>
      <svg width={props.windowWidth} height={props.windowHeight} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="mask-main">
            <rect x={0} y={0} width={props.windowWidth} height={props.windowHeight} fill="white" />
            <rect x={left} y={top} width={width} height={height} fill="black" />
            {/* top left rounded corner */}
            <rect x={left - 1} y={top - 1} width={props.rounded} height={props.rounded} fill="white" />
            <circle cx={left + props.rounded} cy={top + props.rounded} r={props.rounded} fill="black" />
            {/* top right rounded corner */}
            <rect x={left + width - props.rounded + 1} y={top - 1} width={props.rounded} height={props.rounded} fill="white" />
            <circle cx={left + width - props.rounded} cy={top + props.rounded} r={props.rounded} fill="black" />
            {/* bottom left rounded corner */}
            <rect x={left - 1} y={top + height - props.rounded + 1} width={props.rounded} height={props.rounded} fill="white" />
            <circle cx={left + props.rounded} cy={top + height - props.rounded} r={props.rounded} fill="black" />
            {/* bottom right rounded corner */}
            <rect
              x={left + width - props.rounded + 1}
              y={top + height - props.rounded + 1}
              width={props.rounded}
              height={props.rounded}
              fill="white"
            />
            <circle cx={left + width - props.rounded} cy={top + height - props.rounded} r={props.rounded} fill="black " />
          </mask>
          <clipPath id="clip-path">
            {/* top */}
            <rect x={0} y={0} width={props.windowWidth} height={top} />
            {/* left */}
            <rect x={0} y={top} width={left} height={height} />
            {/* right */}
            <rect
              x={props.targetLeft + props.targetWidth + props.padding}
              y={top}
              width={safe(props.windowWidth - props.targetWidth - left)}
              height={height}
            />
            {/* bottom */}
            <rect
              x={0}
              y={props.targetTop + props.targetHeight + props.padding}
              width={props.windowWidth}
              height={safe(props.windowHeight - props.targetHeight - top)}
            />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={props.windowWidth} height={props.windowHeight} fill="currentColor" mask="url(#mask-main)" />
        <rect
          x={0}
          y={0}
          width={props.windowWidth}
          height={props.windowHeight}
          fill="currentColor"
          clipPath="url(#clip-path)"
          pointerEvents="auto"
        />
        <rect
          x={left}
          y={top}
          width={width}
          height={height}
          pointerEvents="auto"
          fill="transparent"
          display={props.disableInteraction ? 'block' : 'none'}
          className={props.disableInteractionClassName}
        />
      </svg>
    </div>
  );
}

SvgMask.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  targetWidth: PropTypes.number.isRequired,
  targetHeight: PropTypes.number.isRequired,
  targetTop: PropTypes.number.isRequired,
  targetLeft: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  rounded: PropTypes.number.isRequired,
  disableInteraction: PropTypes.bool.isRequired,
  disableInteractionClassName: PropTypes.string.isRequired,
};

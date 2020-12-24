import React from 'react';
import classnames from 'classnames';
import ObserveSize from 'react-observe-size';
import PropTypes from 'prop-types';

const detectWidth = (width, prefix) => {
  let clWidth = '';
  if (width < 768) {
    clWidth = 'xs';
  } else {
    if (width < 1024) {
      clWidth = 'sm';
    } else {
      if (width < 1200) {
        clWidth = 'md';
      } else {
        if (width < 1600) {
          clWidth = 'lg';
        } else {
          clWidth = 'xl';
        }
      }
    }
  }
  return clWidth;
};

export default function WidthObserver(props) {
  let posModal = {};
  if (props.zoom) {
    let pos = props.zoom * 50;
    let position = '' + pos + 'px';
    posModal = {
      marginTop: position,
      marginLeft: position,
    }
  }
  return (
    <ObserveSize>
      {({ width }) => {
        const mediaSize = detectWidth(width, props.prefix);
        return (
          <div className={classnames(`${props.prefix}-responsive`, `${props.prefix}-${mediaSize}`, props.className)} style={posModal}>
            {typeof props.children === 'function' ? props.children({ mediaSize }) : props.children}
          </div>
        );
      }}
    </ObserveSize>
  );
}

WidthObserver.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  prefix: PropTypes.string,
  zoom: PropTypes.number,
};
WidthObserver.defaultProps = {
  children: null,
  className: '',
  prefix: 'container',
  zoom: 0,
};

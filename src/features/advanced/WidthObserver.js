import React from 'react';
import classnames from 'classnames';
import ObserveSize from 'react-observe-size';
import PropTypes from 'prop-types';
import { getSizeFromWidth } from '../helpers';

const detectWidth = width => {
  return getSizeFromWidth(width);
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

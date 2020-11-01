import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ObserveSize from 'react-observe-size';

const detectWidth = width => {
  let clWidth = '';
  if (width < 768) {
    clWidth = 'container-xs';
  } else {
    if (width < 1024) {
      clWidth = 'container-sm';
    } else {
      if (width < 1200) {
        clWidth = 'container-md';
      } else {
        if (width < 1600) {
          clWidth = 'container-lg';
        } else {
          clWidth = 'container-xl';
        }
      }
    }
  }
  return clWidth;
};

export default function Container(props) {
  return (
    <ObserveSize>
      {({ width }) => {
        return (
          <div {...props} className={classnames('container-responsive', props.className, detectWidth(width))}>
            {props.children}
          </div>
        );
      }}
    </ObserveSize>
  );
}

Container.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
};
Container.defaultProps = {
  children: null,
  className: '',
};

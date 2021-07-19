import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ObserveSize from 'react-observe-size';
import { getSizeFromWidth } from '../helpers';

const detectWidth = width => {
  return 'container-' + getSizeFromWidth(width);
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

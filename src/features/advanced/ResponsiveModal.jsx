import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveModalInner } from './';

export const ResponsiveModal = props => (
  <div>
    {props.show &&
      <ResponsiveModalInner {...props} />
    }
  </div>
);

ResponsiveModal.propTypes = {
  show: PropTypes.bool,
};

ResponsiveModal.defaultProps = {
  show: false,
};

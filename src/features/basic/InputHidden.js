import React from 'react';
import PropTypes from 'prop-types';

export const InputHidden = props => (
  <div>
    <input type="hidden" id={props.id} name={props.name} value={props.value} />
  </div>
);

InputHidden.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

InputHidden.defaultProps = {
  id: '',
};

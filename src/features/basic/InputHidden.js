import React from 'react';
import PropTypes from 'prop-types';
import { getFieldId } from '../helper';

export const InputHidden = props => {
  const { id, name, value, otherProps } = props;
  const myId = getFieldId(name, id);
  return (
    <div>
      <input {...otherProps} type="hidden" id={myId} name={name} value={value} />
    </div>
  );
};

InputHidden.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

InputHidden.defaultProps = {
  id: '',
};

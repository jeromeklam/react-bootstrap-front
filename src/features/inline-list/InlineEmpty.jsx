import React from 'react';
import PropTypes from 'prop-types';
import { ColLink } from './';

export const InlineEmpty = (props) => (
  <div className="row row-line">
    <ColLink label={props.label} className="text-secondary" />
  </div>
);

InlineEmpty.propTypes = {
  label: PropTypes.string,
};
InlineEmpty.defaultProps = {
  label: 'Empty',
};

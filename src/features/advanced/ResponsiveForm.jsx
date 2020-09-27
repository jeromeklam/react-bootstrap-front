import React from 'react';
import PropTypes from 'prop-types';
import { Responsive } from '../layout';
import { MobileForm, DefaultForm } from './';

export const ResponsiveForm = props => (
  <div className={props.className}>
    <Responsive displayIn={['Mobile']}>
      <MobileForm {...props} />
    </Responsive>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <DefaultForm {...props} />
    </Responsive>
  </div>
);

ResponsiveForm.propTypes = {
  className: PropTypes.string,
};

ResponsiveForm.defaultProps = {
  className: '',
};

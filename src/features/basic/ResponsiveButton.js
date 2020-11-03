import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Responsive } from '../layout';
import { CalmButton } from './';

export const ResponsiveButton = props => (
  <CalmButton
    type="button"
    className={classnames('btn', `btn-${props.button.theme}`)}
    onClick={props.button.function}
  >
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <span color="white">{props.button.name}</span>
    </Responsive>
    <Responsive displayIn={['Mobile']}>
      {props.button.icon}
    </Responsive>
  </CalmButton>
);

ResponsiveButton.propTypes = {
  button: PropTypes.element.isRequired,
};

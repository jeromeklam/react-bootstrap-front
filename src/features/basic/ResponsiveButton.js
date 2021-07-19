import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Responsive } from '../layout';
import { CalmButton } from './';

export const ResponsiveButton = props => (
  <>
    <Responsive displayIn={['Laptop', 'Tablet']}>
      <CalmButton
        type="button"
        className={classnames('btn', `btn-${props.button.theme}`, `btn-outline-${props.button.theme}-light`)}
        disabled={props.button.disabled || false}
        onClick={props.button.function}
        options={props.button.options}
        optionsAlign={props.button.optionsAlign}
        optionsOpenMulti={props.button.optionsOpenMulti}
        loader={true}
      >
        {props.button.name ? <span color="white">{props.button.name}</span> : props.button.icon}
      </CalmButton>
    </Responsive>
    <Responsive displayIn={['Mobile']}>
      <CalmButton
        type="button"
        className={classnames('btn btn-mobile', `btn-${props.button.theme}`, `btn-outline-${props.button.theme}-light`)}
        disabled={props.button.disabled || false}
        onClick={props.button.function}
        options={props.button.options}
        optionsAlign={props.button.optionsAlign}
        optionsOpenMulti={props.button.optionsOpenMulti}
        loader={false}
      >
        {props.button.icon ? props.button.icon : <span color="white">{props.button.name}</span>}
      </CalmButton>
    </Responsive>
  </>
);

ResponsiveButton.propTypes = {
  button: PropTypes.element.isRequired,
};

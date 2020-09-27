import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveModal } from './';

export const ResponsiveConfirm = (props) => {
  const buttons = [
    {
      name: 'Oui',
      function: (ev) => {
        props.onClose(ev);
        props.onConfirm(ev);
      },
      theme: props.theme,
    },
    { name: 'Non', function: props.onClose, theme: 'secondary' },
  ];
  return (
    <ResponsiveModal
      title={props.title}
      size={props.size}
      show={props.show}
      onClose={props.onClose}
      buttons={buttons}
      closeClassName={`text-${props.theme}`}
      modalClassName={`bg-secondary-light text-${props.theme}`}
      height="auto"
    >
      {props.children}
    </ResponsiveModal>
  );
};

ResponsiveConfirm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.element,
  theme: PropTypes.string,
};

ResponsiveConfirm.defaultProps = {
  show: false,
  title: 'Confirmation',
  size: 'md',
  children: <p>Confirmez-vous la suppression ?</p>,
  theme: 'warning',
};

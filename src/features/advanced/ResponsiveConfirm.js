import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveModal } from './';

export const ResponsiveConfirm = props => {
  const buttons = [
    {
      name: 'Oui',
      function: ev => {
        props.onClose(ev);
        props.onConfirm(ev);
      },
      theme: props.theme,
      icon: props.yesIcon,
    },
    { name: 'Non', function: props.onClose, theme: 'secondary', icon: props.noIcon },
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
      <p className="ui-responsive-modal-p">{props.children}</p>
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
  yesIcon: PropTypes.element,
  noIcon: PropTypes.element,
};

ResponsiveConfirm.defaultProps = {
  show: false,
  title: 'Confirmation',
  size: 'md',
  children: <span>Confirmez-vous la suppression ?</span>,
  theme: 'warning',
  yesIcon: null,
  noIcon: null,
};

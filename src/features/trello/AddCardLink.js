import React from 'react';
import PropTypes from 'prop-types';

export default function AddCardLink(props) {
  return (
    <button 
      className="btn btn-primary" 
      title={props.t({ id: 'rbf.trello.card.addLink.help', defaultMessage: 'button.addLink card' })}
      onClick={props.onClick}
    >
      {props.t({ id: 'rbf.trello.card.addLink', defaultMessage: 'Click to add card' })}
    </button>
  );
}

AddCardLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

AddCardLink.defaultProps = {};

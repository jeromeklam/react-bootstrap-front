import React from 'react';
import PropTypes from 'prop-types';

export default function SearchCardLink(props) {
  return (
    <button 
      className="btn btn-primary" 
      title={props.t({ id: 'rbf.trello.card.searchLink.help', defaultMessage: 'button.searchLink card' })}
      onClick={props.onClick}
    >
      {props.t({ id: 'rbf.trello.card.searchLink', defaultMessage: 'Click to search a card' })}
    </button>
  );
}

SearchCardLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

SearchCardLink.defaultProps = {};

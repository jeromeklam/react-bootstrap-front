import React from 'react';
import PropTypes from 'prop-types';

export default function SearchCardLink(props) {
  return (
    <button className="btn btn-primary" onClick={props.onClick}>
      {props.t('Click to search a card')}
    </button>
  );
}

SearchCardLink.propTypes = {
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

SearchCardLink.defaultProps = {};

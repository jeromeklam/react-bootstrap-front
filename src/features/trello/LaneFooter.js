import React from 'react';
import PropTypes from 'prop-types';

export default function LaneFooter(props) {
  return (
    <div className="trello-lane-footer" onClick={props.onClick}>
      {props.collapsed ? (
        <div className="trello-expand-collapse-base trello-expand-btn" />
      ) : (
        <div className="trello-expand-collapse-base trello-collapse-btn" />
      )}
    </div>
  );
}

LaneFooter.propTypes = {
  collapsed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

LaneFooter.defaultProps = {
  collapsed: false,
}
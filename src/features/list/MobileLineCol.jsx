import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export const MobileLineCol = (props) => {
  let content = props.content;
  if (props.type && props.values) {
    switch (props.type) {
      case 'switch':
        const pos = props.values.find(element => element.value === props.content);
        if (pos) {
          content = pos.label;
        }
        break;
      default:
        break;
    }
  }
  return (
    <div
      className={classnames(`col-${props.mob_size}`, props.first && 'col-first', props.last && 'col-last')}
    >
      <span>{content}</span>
    </div>
  );
};

MobileLineCol.defaultProps = {
  mob_size: 36,
};

MobileLineCol.propTypes = {
  content: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  mob_size: PropTypes.number,
};

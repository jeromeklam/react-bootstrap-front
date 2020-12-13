import React from 'react';
import PropTypes from 'prop-types';
import { getCardTitle } from './';

export default function DefaultRightHeader(props) {
  return (
    <div className="rbf-list-default-right-header">
      <h4 className="pl-2 pt-2">{getCardTitle(props.cols, props.currentItem)}</h4>
    </div>
  );
};

DefaultRightHeader.propTypes = {
  className: PropTypes.string,
  currentItem: PropTypes.object,
  title: PropTypes.string.isRequired,
  item: PropTypes.element.isRequired,
  cols: PropTypes.element.isRequired,
  id: PropTypes.string.isRequired,
};

DefaultRightHeader.defaultProps = {
  className: '',
  currentItem: null,
};

import React from 'react';
import PropTypes from 'prop-types';
import { getColContent } from './';
import { Row, Col } from '../grid';

export const MobileLineCol = props => {
  let content = props.content;
  if (content === null) {
    content = '';
  }
  content = getColContent(props);
  if (content === null || content === '') {
    content = ' ';
  }
  if (typeof props.fDisplay === 'function') {
    content = props.fDisplay(props.item, content);
  }
  if (props.card && props.card.noLabel) {
    return (
      <Row className="">
        <Col size={36} className="mobile-col-content">
          <span className="text-dark">{content}</span>
        </Col>
      </Row>
    );
  }
  return (
    <Row className="">
      <Col size={12} className="mobile-col-title pt-1">
        <span className="text-secondary">{props.shortLabel ? props.shortLabel : props.label}</span>
      </Col>
      <Col size={24} className="mobile-col-content text-dark pt-1">
        {content}
      </Col>
    </Row>
  );
};

MobileLineCol.propTypes = {
  content: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  mob_size: PropTypes.number,
  money: PropTypes.string,
};

MobileLineCol.defaultProps = {
  mob_size: 36,
  money: 'EUR',
};

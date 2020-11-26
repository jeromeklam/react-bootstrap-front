import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from '../grid';

const mystyle = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  width: '100%',
  height: 'auto',
  lineHeight: 'auto',
};

export const DefaultFooter = props => (
  <div style={mystyle} className="bg-light">
    <Container>
      <Row>
        <Col size={20} />
        <Col size={15} textAlign="right">
          {props.options.map((option, i) => {
            if (option.role === 'SOCIAL') {
              return <span key={`footer-social-${i}`}>{option.icon}</span>;
            }
            return null;
          })}
        </Col>
        <Col size={1} />
      </Row>
    </Container>
  </div>
);

DefaultFooter.propTypes = {
  options: PropTypes.element.isRequired,
};

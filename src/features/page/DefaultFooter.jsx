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
        <Col size={2} />
        <Col size={18}>
          {props.options.map(option => {
            if (option.role === 'ABOUT') {
              return (
                <a
                  href={option.url}
                  onClick={e => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    props.onNavigate(option.url);
                  }}
                >
                  <span className="text-muted">{option.label}</span>
                </a>
              );
            }
            return null;
          })}
        </Col>
        <Col size={14} textAlign="right">
          {props.options.map(option => {
            if (option.role === 'SOCIAL') {
              return <span>{option.icon}</span>;
            }
            return null;
          })}
        </Col>
        <Col size={2} />
      </Row>
    </Container>
  </div>
);

DefaultFooter.propTypes = {
  options: PropTypes.element.isRequired,
};

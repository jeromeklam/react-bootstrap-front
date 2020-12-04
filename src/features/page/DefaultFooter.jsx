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

const followStyle = {
  fontWeight: 'bold',
  marginTop: '4px',
};

export const DefaultFooter = props => (
  <div style={mystyle} className="bg-light">
    <Container>
      <Row>
        <Col size={27} />
        <Col size={3} textAlign="right">
          <div className="text-dark" style={followStyle}>
            {props.t({ id: 'rbf.page.footer.followUs', defaultMessage: 'Follow us' })}
          </div>
        </Col>
        <Col size={4}>
          {props.options.map((option, i) => {
            if (option.role === 'SOCIAL') {
              return <span key={`footer-social-${i}`}>{option.icon}</span>;
            }
            return null;
          })}
        </Col>
        <Col size={2}>
          {props.options.map((option, i) => {
            if (option.role === 'JVS') {
              return <span key={`footer-jvs-${i}`}>{option.icon}</span>;
            }
            return null;
          })}
        </Col>
      </Row>
    </Container>
  </div>
);

DefaultFooter.propTypes = {
  options: PropTypes.element.isRequired,
  t: PropTypes.func,
};

DefaultFooter.defaultProps = {
  t: () => {},
};

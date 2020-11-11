import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from '../grid';

export default function CookieConsent(props) {
  return (
    <div className="advanced-cookie-consent">
      <Container size="xs" className="advanced-cookie-consent-inner">
        <Row>
          <Col size={36}>
            <h4>{props.title}</h4>
          </Col>
        </Row>
        <Row>
          <Col size={36}>
            <p style={{ fontSize: '0.8rem' }}>{props.text}</p>
          </Col>
        </Row>
        <Row>
          <Col size={36} className="text-right">
            <button type="button" className="btn btn-warning" onClick={props.onDecline}>
              {props.decline}
            </button>
            <button type="button" className="btn btn-primary" onClick={props.onAccept}>
              {props.accept}
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

CookieConsent.propTypes = {
  accept: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  decline: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
CookieConsent.defaultProps = {};

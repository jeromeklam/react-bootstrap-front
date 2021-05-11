import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from '../grid';

export default function CookieConsent(props) {
  console.log(props);
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
            {props.onDecline &&
              <button type="button" className="btn btn-warning" onClick={props.onDecline}>
                {props.decline}
              </button>
            }
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
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  decline: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
CookieConsent.defaultProps = {
  decline: "",
  onDecline: null,
};

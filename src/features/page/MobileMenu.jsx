import React from 'react';
import classnames from 'classnames';
import { Row, Col } from '../grid';
// import PropTypes from 'prop-types';

export default function MobileMenu(props) {
  return (
    <div className="page-mobile-menu">
      <Row className="no-gutters">
        {props.options.map(option => {
          let label = option.label;
          if (
            option.role === 'HOME' ||
            option.role === 'ABOUT' ||
            (option.role === 'NAV' && (props.authenticated || (props.authenticated && option.public)))
          ) {
            return (
              <Col className="text-left" size={{ xs: 18, sm: 12 }} key={`option-${label}-${option.position}`}>
                <button
                  className="page-mobile-menu-option btn bg-white border border-rounded border-outline-secondary text-secondary"
                  onClick={ev => {
                    if (ev) {
                      ev.preventDefault();
                    }
                    props.onCloseMenu();
                    props.onNavigate(option.url);
                  }}
                >
                  {option.icon}
                  <br />
                  <span>{label}</span>
                </button>
              </Col>
            );
          } else {
            if (option.role === 'MENU' && (props.authenticated || (props.authenticated && option.public))) {
              return option.options.map(option2 => {
                let label2 = option2.label;
                return (
                  <Col className="text-left" size={{ xs: 18, sm: 12 }} key={`option-${label2}-${option2.position}`}>
                    <button
                      className="page-mobile-menu-option btn bg-white border border-rounded border-outline-secondary text-secondary"
                      onClick={ev => {
                        if (ev) {
                          ev.preventDefault();
                        }
                        props.onCloseMenu();
                        props.onNavigate(option2.url);
                      }}
                    >
                      {option2.icon}
                      <br />
                      <span>{label2}</span>
                    </button>
                  </Col>
                );
              });
            }
          }
          return null;
        })}
      </Row>
    </div>
  );
}

MobileMenu.propTypes = {};
MobileMenu.defaultProps = {};

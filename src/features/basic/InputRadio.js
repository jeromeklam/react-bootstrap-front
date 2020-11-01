import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const wrappestyle = {
  position: 'relative',
};

const circlestyle = {
  border: '1px solid #ced4da',
  borderRadius: '50%',
  cursor: 'pointer',
  height: '20px',
  position: 'absolute',
  transition: 'border-color 300ms',
  width: '20px',
  zIndex: '7',
  top: '4px',
};

const entrylabelstyle = {
  cursor: 'pointer',
  marginTop: '3px',
  paddingLeft: '25px',
  userSelect: 'none',
  zIndex: '9',
  position: 'relative',
};

const highlightstyle = {
  borderRadius: '50%',
  height: '14px',
  left: '2px',
  pointerEvents: 'none',
  position: 'absolute',
  top: '2px',
  transition: 'transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2)',
  width: '14px',
};

export const InputRadio = props => (
  <div className={classnames('form-group')}>
    <div className="form-check form-check-inline">
      {props.options.map(elt => (
        <div key={elt.value} className="form-radio-input-wrapper mr-3" style={wrappestyle}>
          <input type="hidden" className="form-radio-input primary" id={elt.value} />
          <div
            style={entrylabelstyle}
            onClick={() => {
              const event = {
                target: {
                  name: props.name,
                  value: elt.value,
                },
              };
              props.onChange(event);
            }}
          >
            {elt.label}
          </div>
          <div
            style={circlestyle}
            className="bg-light"
            onClick={() => {
              const event = {
                target: {
                  name: props.name,
                  value: elt.value,
                },
              };
              props.onChange(event);
            }}
          >
            {props.value === elt.value && <div className="bg-primary" style={highlightstyle} />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

InputRadio.propTypes = {
  labelTop: PropTypes.bool,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.element.isRequired,
};

InputRadio.defaultProps = {
  labelTop: true,
  value: '',
};

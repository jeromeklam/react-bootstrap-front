import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const wrappestyle = {
  position: 'relative',
};

const circlestyle = {
  border: '1px solid',
  borderRadius: '50%',
  backgroundColor: 'white',
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
  <div className={classnames('ui-input-radio form-group', !props.labelTop && 'row')}>
    {props.label !== '' && (
      <label htmlFor={props.id} className={classnames(!props.labelTop && `col-xs-w${props.labelSize} col-form-label`)}>
        {props.label}
      </label>
    )}
    <div className={classnames(!props.labelTop && `col-xs-w${props.inputSize}`)}>
      <div className="form-check form-check-inline text-secondary">
        {props.options.map(elt => {
          return (
            <div key={elt.value} className="form-radio-input-wrapper mr-3" style={wrappestyle}>
              <input type="hidden" className="form-radio-input primary" value={elt.value} />
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
                className={classnames(`border-${props.borderColor}`)}
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
                {((props.value !== null && props.value === elt.value) ||
                  (props.value === null && props.defaultValue !== '' && props.defaultValue === elt.value) ||
                  (props.value === null && props.defaultValue === '' && props.options[0].value === elt.value)) && (
                  <div className="bg-secondary" style={highlightstyle} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

InputRadio.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelTop: PropTypes.bool,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.element.isRequired,
  borderColor: PropTypes.string,
  defaultValue: PropTypes.string,
};

InputRadio.defaultProps = {
  id: '',
  label: '',
  labelTop: true,
  labelSize: 6,
  inputSize: 30,
  disabled: false,
  value: '',
  borderColor: 'secondary',
  defaultValue: '',
};

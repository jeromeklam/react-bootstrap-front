import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Groupe segmenté : un seul choix parmi quelques-uns (Tous | Régulier | Ponctuel).
 *
 * Le motif btn-group + active déjà utilisé par les listes, sans SCSS : le bouton
 * choisi est btn-{theme}, les autres btn-outline-{theme}. Émet
 * { target: { name, value } } comme les autres champs.
 */
export const InputSegmented = props => {
  const { name, value, options, onChange, theme, size, disabled, allowEmpty, label, labelTop, help, id } = props;
  const current = value === null || typeof value === 'undefined' ? '' : String(value);
  const select = option => {
    const selected = String(option.value) === current;
    onChange({ target: { name, value: selected && allowEmpty ? '' : option.value } });
  };
  return (
    <div className={classnames('rbf-input-segmented form-group', !labelTop && 'row')}>
      {label && label !== '' && (
        <label htmlFor={id || name} className={classnames(!labelTop && `col-xxs-w${props.labelSize} col-form-label`)}>
          {label}
        </label>
      )}
      <div className={classnames(!labelTop && `col-xxs-w${props.inputSize}`)}>
        <div id={id || name} className={classnames('btn-group', size && `btn-group-${size}`)} role="group" aria-label={label || name}>
          {options.map(option => {
            const selected = String(option.value) === current;
            return (
              <button
                key={String(option.value)}
                type="button"
                className={classnames('btn', selected ? `btn-${theme} active` : `btn-outline-${theme}`)}
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => select(option)}
              >
                {option.icon && <span className="mr-1">{option.icon}</span>}
                {option.label}
              </button>
            );
          })}
        </div>
        {help && help !== '' && <small className="form-text text-muted">{help}</small>}
      </div>
    </div>
  );
};

InputSegmented.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  theme: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  allowEmpty: PropTypes.bool,
  label: PropTypes.string,
  labelTop: PropTypes.bool,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  id: PropTypes.string,
};

InputSegmented.defaultProps = {
  value: '',
  theme: 'secondary',
  size: 'sm',
  disabled: false,
  allowEmpty: false,
  label: '',
  labelTop: true,
  labelSize: 6,
  inputSize: 30,
  help: null,
  id: null,
};

export default InputSegmented;

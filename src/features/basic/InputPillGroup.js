import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Chip from './Chip';

/**
 * Pastilles à bascule : plusieurs choix parmi une liste (catégories, moyens de
 * paiement, programmes). Valeur : le tableau des valeurs choisies ; un tableau
 * vide veut dire « toutes », ce que l'indication `hint` peut rappeler.
 * Émet { target: { name, value: [...] } }.
 */
export const InputPillGroup = props => {
  const { name, value, options, onChange, multiple, hint, checkIcon, theme, size, disabled, label, labelTop, id } = props;
  const current = (Array.isArray(value) ? value : []).map(String);
  const toggle = option => {
    const key = String(option.value);
    let next;
    if (current.includes(key)) {
      next = (Array.isArray(value) ? value : []).filter(v => String(v) !== key);
    } else if (multiple) {
      next = [...(Array.isArray(value) ? value : []), option.value];
    } else {
      next = [option.value];
    }
    onChange({ target: { name, value: next } });
  };
  return (
    <div className={classnames('rbf-input-pill-group form-group', !labelTop && 'row')}>
      {label && label !== '' && (
        <label htmlFor={id || name} className={classnames(!labelTop && `col-xxs-w${props.labelSize} col-form-label`)}>
          {label}
        </label>
      )}
      <div className={classnames(!labelTop && `col-xxs-w${props.inputSize}`)}>
        <div id={id || name} className="rbf-pill-group" role="group" aria-label={label || name}>
          {options.map(option => (
            <Chip
              key={String(option.value)}
              variant="toggle"
              theme={theme}
              size={size}
              active={current.includes(String(option.value))}
              label={option.label}
              count={option.count}
              checkIcon={checkIcon}
              disabled={disabled}
              onClick={() => toggle(option)}
              className="mr-1 mb-1"
            />
          ))}
        </div>
        {hint && hint !== '' && <small className="form-text text-muted">{hint}</small>}
      </div>
    </div>
  );
};

InputPillGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  hint: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  checkIcon: PropTypes.element,
  theme: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  labelTop: PropTypes.bool,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  id: PropTypes.string,
};

InputPillGroup.defaultProps = {
  value: [],
  multiple: true,
  hint: null,
  checkIcon: null,
  theme: 'secondary',
  size: 'sm',
  disabled: false,
  label: '',
  labelTop: true,
  labelSize: 6,
  inputSize: 30,
  id: null,
};

export default InputPillGroup;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Plage « de … à … » : deux champs du même type et une seule valeur [from, to],
 * la forme même du between du modèle Filter. Émet
 * { target: { name, value: [from, to] } } ; une borne absente est ''.
 *
 * Interne : InputDateRange et InputAmountRange fixent le composant de champ, ses
 * props (icônes, unité) et les préfixes. Les deux champs se placent côte à côte et
 * passent l'un sous l'autre quand la place manque (InputRange.scss).
 */
export const InputRange = props => {
  const { component: Field, fieldProps, name, value, onChange, fromLabel, toLabel, label, labelTop, help, error, id } = props;
  const current = Array.isArray(value) ? value : [];
  const bound = index => (current[index] === null || typeof current[index] === 'undefined' ? '' : String(current[index]));
  const emit = (index, fieldValue) => {
    const next = [bound(0), bound(1)];
    next[index] = fieldValue === null || typeof fieldValue === 'undefined' ? '' : fieldValue;
    onChange({ target: { name, value: next } });
  };
  const field = (index, prefix) => {
    const suffix = index === 0 ? 'from' : 'to';
    return (
      <Field
        {...fieldProps}
        name={`${name}.${suffix}`}
        id={id ? `${id}-${suffix}` : ''}
        label=""
        prepend={prefix}
        value={bound(index)}
        error={error}
        onChange={ev => emit(index, ev.target.value)}
        onClear={() => emit(index, '')}
      />
    );
  };
  return (
    <div className={classnames('rbf-input-range form-group', !labelTop && 'row')}>
      {label && label !== '' && (
        <label htmlFor={id ? `${id}-from` : undefined} className={classnames(!labelTop && `col-xxs-w${props.labelSize} col-form-label`)}>
          {label}
        </label>
      )}
      <div className={classnames(!labelTop && `col-xxs-w${props.inputSize}`)}>
        <div className="rbf-input-range-fields">
          <div className="rbf-input-range-field">{field(0, fromLabel)}</div>
          <div className="rbf-input-range-field">{field(1, toLabel)}</div>
        </div>
        {help && help !== '' && <small className="form-text text-muted">{help}</small>}
      </div>
    </div>
  );
};

InputRange.propTypes = {
  component: PropTypes.elementType.isRequired,
  fieldProps: PropTypes.object,
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  fromLabel: PropTypes.node,
  toLabel: PropTypes.node,
  label: PropTypes.string,
  labelTop: PropTypes.bool,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  id: PropTypes.string,
};

InputRange.defaultProps = {
  fieldProps: {},
  value: [],
  fromLabel: '',
  toLabel: '',
  label: '',
  labelTop: true,
  labelSize: 6,
  inputSize: 30,
  help: null,
  error: false,
  id: '',
};

export default InputRange;

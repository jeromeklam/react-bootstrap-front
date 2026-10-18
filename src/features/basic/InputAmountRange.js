import React from 'react';
import PropTypes from 'prop-types';
import InputMonetary from './InputMonetary';
import InputRange from './InputRange';
import { rbfIntl } from '../intl';

/**
 * Plage de montants « de … à … » : deux InputMonetary, qui affichent eux-mêmes
 * l'unité ; valeur [from, to] en chaînes avec le point décimal, '' pour une borne
 * absente (allowNull).
 */
export const InputAmountRange = props => {
  const { unit, allowNull, size, disabled, fromLabel, toLabel, t, ...rest } = props;
  return (
    <InputRange
      {...rest}
      component={InputMonetary}
      fromLabel={fromLabel || t({ id: 'rbf.range.min', defaultMessage: 'de' })}
      toLabel={toLabel || t({ id: 'rbf.range.max', defaultMessage: 'à' })}
      fieldProps={{ inputMoney: unit, allowNull, size, disabled }}
    />
  );
};

InputAmountRange.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  unit: PropTypes.string,
  allowNull: PropTypes.bool,
  fromLabel: PropTypes.node,
  toLabel: PropTypes.node,
  label: PropTypes.string,
  labelTop: PropTypes.bool,
  labelSize: PropTypes.number,
  inputSize: PropTypes.number,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.element]),
  id: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  t: PropTypes.func,
};

InputAmountRange.defaultProps = {
  value: [],
  unit: '€',
  allowNull: true,
  fromLabel: null,
  toLabel: null,
  label: '',
  labelTop: true,
  labelSize: 6,
  inputSize: 30,
  help: null,
  error: false,
  id: '',
  size: null,
  disabled: false,
  t: rbfIntl,
};

export default InputAmountRange;

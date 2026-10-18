import React from 'react';
import PropTypes from 'prop-types';
import InputDate from './InputDate';
import InputRange from './InputRange';
import { rbfIntl } from '../intl';

/**
 * Plage de dates « du … au … » : deux InputDate (masque + calendrier sur bureau,
 * champ natif sur mobile), valeur [from, to] en 'YYYY-MM-DD'.
 */
export const InputDateRange = props => {
  const { calIcon, delIcon, size, disabled, borderColor, fromLabel, toLabel, t, ...rest } = props;
  return (
    <InputRange
      {...rest}
      component={InputDate}
      fromLabel={fromLabel || t({ id: 'rbf.range.from', defaultMessage: 'du' })}
      toLabel={toLabel || t({ id: 'rbf.range.to', defaultMessage: 'au' })}
      fieldProps={{ calIcon, delIcon, size, disabled, borderColor }}
    />
  );
};

InputDateRange.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  calIcon: PropTypes.element.isRequired,
  delIcon: PropTypes.element.isRequired,
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
  borderColor: PropTypes.string,
  t: PropTypes.func,
};

InputDateRange.defaultProps = {
  value: [],
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
  borderColor: 'secondary',
  t: rbfIntl,
};

export default InputDateRange;

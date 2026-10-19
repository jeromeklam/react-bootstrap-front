import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FILTER_OPER_EQUAL, FILTER_OPER_NOT_EQUAL, FILTER_OPER_IN, FILTER_OPER_NOT_IN } from '../filter';
import { rbfIntl } from '../intl';
import { fieldsForRows, findField } from './catalog';
import { getFieldOperators, needsValue, isRange } from './operators';
import { tr } from './i18n';
import SearchFormField from './SearchFormField';

/**
 * Une ligne de critère : [champ] [opérateur] [valeur(s)] [×]. Le champ et
 * l'opérateur sont des selects natifs (InputSelect déclenche onChange au
 * montage) ; la zone de valeur est le champ de la fiche qui convient à
 * l'opérateur (plage pour « entre », pastilles pour un choix multiple…).
 * Critère : { id, name, operator, values }.
 */
const MULTI = [FILTER_OPER_EQUAL, FILTER_OPER_NOT_EQUAL, FILTER_OPER_IN, FILTER_OPER_NOT_IN];

/* Le composant de saisie d'après le type du champ et l'opérateur. */
export const widgetForOperator = (field, oper) => {
  if (!field) {
    return 'text';
  }
  if (field.virtual) {
    return field.widget || 'text';
  }
  if (isRange(oper)) {
    if (field.type === 'monetary') {
      return 'amount-range';
    }
    return field.type === 'number' ? 'number-range' : 'date-range';
  }
  switch (field.type) {
    case 'select':
      return field.multiple !== false && MULTI.includes(oper) ? 'pills' : 'select';
    case 'bool':
      return 'bool';
    case 'date':
    case 'datetime':
      return 'date';
    case 'monetary':
      return 'amount';
    case 'number':
      return 'number';
    default:
      return 'text';
  }
};

const multiValued = widget => widget === 'pills' || widget.endsWith('-range');

/* Les zones larges (pastilles, plages) prennent toute une ligne sous le champ et
   l'opérateur ; les autres restent sur leur ligne. */
const wideWidget = widget => widget === 'pills' || widget.endsWith('-range');

export const SearchCriteriaRow = props => {
  const { catalog, criterion, usedNames, onChange, onRemove, icons, size, disabled, t } = props;
  const field = criterion.name ? findField(catalog, criterion.name) : null;
  const operator = criterion.operator || (field ? field.defaultOperator : '');
  const widget = widgetForOperator(field, operator);
  const values = Array.isArray(criterion.values) ? criterion.values : [];
  const selectClass = classnames('custom-select', size && `custom-select-${size}`);

  const onField = event => {
    const next = findField(catalog, event.target.value);
    onChange({ ...criterion, name: next ? next.name : '', operator: next ? next.defaultOperator : '', values: [] });
  };
  const onOperator = event => {
    const nextOper = event.target.value;
    const nextWidget = widgetForOperator(field, nextOper);
    const keep = needsValue(nextOper) && needsValue(operator) && multiValued(nextWidget) === multiValued(widget);
    onChange({ ...criterion, operator: nextOper, values: keep ? values : [] });
  };
  const onValue = event => {
    const value = event.target.value;
    onChange({ ...criterion, values: Array.isArray(value) ? value : [value] });
  };

  let valueZone;
  if (!field) {
    valueZone = <input type="text" className={classnames('form-control border-rbf', size && `form-control-${size}`)} disabled placeholder={tr(t, 'rbf.search.row.valuePlaceholder', 'Valeur')} />;
  } else if (!needsValue(operator)) {
    valueZone = <span className="form-control-plaintext text-muted small rbf-criteria-novalue">{tr(t, 'rbf.search.row.noValue', 'pas de valeur à saisir')}</span>;
  } else {
    const rowField = { ...field, widget, placeholder: tr(t, 'rbf.search.row.valuePlaceholder', 'Valeur'), hint: null };
    valueZone = (
      <SearchFormField
        field={rowField}
        value={multiValued(widget) ? values : values[0]}
        onChange={onValue}
        icons={icons}
        size={size}
        disabled={disabled}
        t={t}
      />
    );
  }
  const operators = field ? (field.virtual ? [{ value: FILTER_OPER_EQUAL, label: tr(t, 'rbf.filter.oper.eq', 'est') }] : getFieldOperators(field, t)) : [];
  return (
    <div className="rbf-criteria-row d-flex flex-wrap align-items-start" role="group">
      <select className={classnames(selectClass, 'rbf-criteria-field mr-2 mb-2')} value={criterion.name || ''} onChange={onField} disabled={disabled} aria-label={tr(t, 'rbf.search.row.field', 'Champ')}>
        <option value="">{tr(t, 'rbf.search.row.field', 'Champ')}…</option>
        {fieldsForRows(catalog).map(f => (
          <option key={f.name} value={f.name} disabled={usedNames.includes(f.name) && f.name !== criterion.name}>
            {f.label}
          </option>
        ))}
      </select>
      <select className={classnames(selectClass, 'rbf-criteria-operator mr-2 mb-2')} value={operator} onChange={onOperator} disabled={disabled || !field || field.virtual} aria-label={tr(t, 'rbf.search.row.operator', 'Opérateur')}>
        {!field && <option value="">—</option>}
        {operators.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className={classnames('rbf-criteria-value flex-grow-1 mr-2 mb-2', field && needsValue(operator) && wideWidget(widget) && 'rbf-criteria-value-wide')}>{valueZone}</div>
      <button type="button" className={classnames('btn btn-outline-rbf bg-light text-secondary rbf-criteria-remove mb-2', size && `btn-${size}`)} title={tr(t, 'rbf.search.row.remove', 'Retirer ce critère')} aria-label={tr(t, 'rbf.search.row.remove', 'Retirer ce critère')} disabled={disabled} onClick={() => onRemove(criterion.id)}>
        {icons.remove || '×'}
      </button>
    </div>
  );
};

SearchCriteriaRow.propTypes = {
  catalog: PropTypes.array.isRequired,
  criterion: PropTypes.object.isRequired,
  usedNames: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  icons: PropTypes.object,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  t: PropTypes.func,
};

SearchCriteriaRow.defaultProps = {
  usedNames: [],
  icons: {},
  size: null,
  disabled: false,
  t: rbfIntl,
};

export default SearchCriteriaRow;

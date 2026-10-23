import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputText, InputMonetary, InputDate, InputSegmented, InputPillGroup, InputDateRange, InputAmountRange } from '../basic';
import { FILTER_OPER_BETWEEN } from '../filter';
import { rbfIntl } from '../intl';
import { tr, warnOnce } from './i18n';

/**
 * Un champ de la fiche de recherche, choisi d'après le `widget` du catalogue (ou
 * le type du champ) : texte, nombre, montant, date, plages, pastilles, groupe
 * segmenté, select, booléen. `field.render` remplace tout. Émet
 * { target: { name, value } }.
 */
export const widgetFor = field => {
  if (field.widget) {
    return field.widget;
  }
  switch (field.type) {
    case 'number':
      return 'number';
    case 'monetary':
      return field.defaultOperator === FILTER_OPER_BETWEEN ? 'amount-range' : 'amount';
    case 'date':
    case 'datetime':
      return field.defaultOperator === FILTER_OPER_BETWEEN ? 'date-range' : 'date';
    case 'bool':
      return 'bool';
    case 'select':
      return field.multiple ? 'pills' : 'select';
    case 'picker':
      return 'picker';
    default:
      return 'text';
  }
};

/* Largeur par défaut d'un champ, en 36es de la section. */
export const widthFor = field => {
  if (field.width) {
    return field.width;
  }
  switch (widgetFor(field)) {
    case 'pills':
      return 36;
    case 'date-range':
      return 15;
    case 'amount-range':
    case 'number-range':
      return 12;
    case 'segmented':
    case 'bool':
      return 'auto';
    default:
      return 12;
  }
};

export const SearchFormField = props => {
  const { field, value, onChange, icons, showLabel, size, disabled, t } = props;
  const emit = next => onChange({ target: { name: field.name, value: next } });
  const forward = ev => emit(ev.target.value);
  const label = showLabel ? field.label : '';
  const placeholder = field.placeholder || field.label;
  const widget = widgetFor(field);
  if (typeof field.render === 'function') {
    return field.render({ field, value, onChange: emit, icons, t, widget });
  }
  const text = value === null || typeof value === 'undefined' ? '' : value;
  const range = Array.isArray(value) ? value : ['', ''];
  const list = Array.isArray(value) ? value : [];
  switch (widget) {
    case 'pills':
      return (
        <InputPillGroup
          name={field.name}
          label={label}
          value={list}
          options={field.options}
          multiple={field.multiple}
          hint={field.hint || null}
          checkIcon={icons.check || null}
          size={size}
          disabled={disabled}
          onChange={forward}
          showEndedLabel={tr(t, 'rbf.search.ended.show', 'Afficher aussi les {n} terminé(s)')}
          hideEndedLabel={tr(t, 'rbf.search.ended.hide', 'Masquer les terminés')}
          endedTitle={tr(t, 'rbf.search.ended.title', 'Terminé')}
          allLabel={tr(t, 'rbf.search.pills.all', 'Tous')}
          noneLabel={tr(t, 'rbf.search.pills.none', 'Aucun')}
        />
      );
    case 'segmented':
      return (
        <InputSegmented name={field.name} label={label} value={String(text)} options={field.options} size={size} disabled={disabled} onChange={forward} />
      );
    case 'bool':
      return (
        <InputSegmented
          name={field.name}
          label={label}
          value={String(text)}
          options={[
            { value: '', label: tr(t, 'rbf.search.value.all', 'Tous') },
            { value: '1', label: tr(t, 'rbf.search.value.yes', 'oui') },
            { value: '0', label: tr(t, 'rbf.search.value.no', 'non') },
          ]}
          size={size}
          disabled={disabled}
          onChange={forward}
        />
      );
    case 'date-range':
      return (
        <InputDateRange
          name={field.name}
          label={label}
          value={range}
          calIcon={icons.calendar}
          delIcon={icons.clear}
          size={size}
          disabled={disabled}
          fromLabel={field.fromLabel || null}
          toLabel={field.toLabel || null}
          onChange={forward}
        />
      );
    case 'amount-range':
    case 'number-range':
      return (
        <InputAmountRange
          name={field.name}
          label={label}
          value={range}
          unit={widget === 'number-range' ? '' : field.unit || '€'}
          size={size}
          disabled={disabled}
          fromLabel={field.fromLabel || null}
          toLabel={field.toLabel || null}
          onChange={forward}
        />
      );
    case 'date':
      return (
        <InputDate name={field.name} label={label} value={String(text)} calIcon={icons.calendar} delIcon={icons.clear} size={size} disabled={disabled} onChange={forward} />
      );
    case 'amount':
      return (
        <InputMonetary name={field.name} label={label} value={String(text)} allowNull inputMoney={field.unit || '€'} size={size} disabled={disabled} onChange={forward} />
      );
    case 'number':
      return (
        <div className="form-group">
          {label !== '' && <label htmlFor={field.name}>{label}</label>}
          <input
            type="number"
            id={field.name}
            name={field.name}
            className={classnames('form-control', size && `form-control-${size}`)}
            placeholder={placeholder}
            value={text}
            disabled={disabled}
            onChange={forward}
          />
        </div>
      );
    case 'select':
      return (
        <div className="form-group">
          {label !== '' && <label htmlFor={field.name}>{label}</label>}
          <select
            id={field.name}
            name={field.name}
            className={classnames('custom-select', size && `custom-select-${size}`)}
            value={String(text)}
            disabled={disabled}
            onChange={forward}
          >
            <option value="">{placeholder}</option>
            {field.options.map(option => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
                {option.ended ? ` ${tr(t, 'rbf.search.ended.suffix', '(terminé)')}` : ''}
              </option>
            ))}
          </select>
        </div>
      );
    case 'picker':
      warnOnce(`champ « ${field.name} » : un sélecteur (picker) dans la fiche passe par field.render`);
      return null;
    default:
      return (
        <InputText name={field.name} label={label} placeholder={placeholder} value={String(text)} size={size} disabled={disabled} onChange={forward} />
      );
  }
};

SearchFormField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  icons: PropTypes.object,
  showLabel: PropTypes.bool,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  t: PropTypes.func,
};

SearchFormField.defaultProps = {
  value: undefined,
  icons: {},
  showLabel: false,
  size: null,
  disabled: false,
  t: rbfIntl,
};

export default SearchFormField;

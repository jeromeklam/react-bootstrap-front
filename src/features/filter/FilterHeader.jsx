import React from 'react';
import {
  FILTER_MODE_OR,
  FILTER_MODE_AND,
  FILTER_OPER_LIKE,
  FILTER_OPER_SOUND_LIKE,
  FILTER_OPER_NOT_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_NOT_EQUAL,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
  FILTER_OPER_LOWER,
  FILTER_OPER_LOWER_OR_EQUAL,
  FILTER_OPER_GREATER,
  FILTER_OPER_GREATER_OR_EQUAL,
} from './';
import { InputRadio } from '../basic';

export default function FilterHeader(props) {
  const mode = props.filters.getMode();
  const oper = props.filters.getOperator();
  return (
    <div className="filter-filter-header">
      <div className="row">
        <div className="col-xxs-w16 col-first">
          <InputRadio
            className="ml-3 mr-1 text-secondary"
            id="filter-or"
            type="radio"
            name="mode"
            label="Opérateur"
            value={mode}
            onChange={props.onMode}
            options={[
              { label: 'et', value: FILTER_MODE_AND },
              { label: 'ou', value: FILTER_MODE_OR },
            ]}
            borderColor="secondary-light"
          />
        </div>
        <div className="col-xxs-w16 form-group">
          <label htmlFor="filter-oper" className="text-secondary">
            <span>Condition</span>
          </label>
          <select
            id="filter-oper"
            className="form-control border-secondary-light"
            onChange={props.onOperator}
            value={oper}
          >
            <option value={FILTER_OPER_EQUAL}>Egal =</option>
            <option value={FILTER_OPER_NOT_EQUAL}>Différent !=</option>
            <option value={FILTER_OPER_LIKE}>Contient *</option>
            <option value={FILTER_OPER_SOUND_LIKE}>Ressemble à ~</option>
            <option value={FILTER_OPER_NOT_LIKE}>Ne contient pas !*</option>
            <option value={FILTER_OPER_EMPTY}>Vide &Oslash;</option>
            <option value={FILTER_OPER_NOT_EMPTY}>Pas vide !&Oslash;</option>
            <option value={FILTER_OPER_LOWER}>Inférieur &lt;</option>
            <option value={FILTER_OPER_LOWER_OR_EQUAL}>Inférieur ou égal &lt;=</option>
            <option value={FILTER_OPER_GREATER}>Supérieur &gt;</option>
            <option value={FILTER_OPER_GREATER_OR_EQUAL}>Supérieur ou égal &gt;=</option>
          </select>
        </div>
      </div>
    </div>
  );
}

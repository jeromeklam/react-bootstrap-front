import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FILTER_MODE_OR,
  FILTER_MODE_AND,
  FILTER_OPER_LIKE,
  FILTER_OPER_NOT_LIKE,
  FILTER_OPER_EQUAL,
  FILTER_OPER_NOT_EQUAL,
  FILTER_OPER_EMPTY,
  FILTER_OPER_NOT_EMPTY,
  FILTER_OPER_LOWER,
  FILTER_OPER_LOWER_OR_EQUAL,
  FILTER_OPER_LOWER_OR_EQUAL_OR_NULL,
  FILTER_OPER_GREATER,
  FILTER_OPER_GREATER_OR_EQUAL,
  FILTER_OPER_GREATER_OR_EQUAL_OR_NULL,
} from './';
import { InputRadio, InputDate } from '../basic';

export default class FilterBuilder extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    filters: PropTypes.element.isRequired,
    onFilterOperator: PropTypes.func.isRequired,
    calIcon: PropTypes.element.isRequired,
    clearIcon: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: 'tt',
    };
  }

  render() {
    const mode = this.props.filters.getMode();
    const oper = this.props.filters.getOperator();
    return (
      <div className="filter-filter-builder">
        <div className="row">
          <div className="col-xs-w16 col-first">
            <label htmlFor="filter-or" className="">
              <span>Opérateur</span>
            </label>
            <InputRadio
              className="ml-3 mr-1"
              id="filter-or"
              type="radio"
              name="mode"
              value={mode}
              onChange={this.props.onMode}
              options={[{ label: 'et', value: FILTER_MODE_AND }, { label: 'ou', value: FILTER_MODE_OR }]}
            />
          </div>
          <div className="col-xs-w16">
            <label htmlFor="filter-oper" className="">
              <span>Condition par défaut</span>
            </label>
            <select id="filter-oper" className="form-control" onChange={this.props.onOperator} value={oper}>
              <option value={FILTER_OPER_EQUAL}>Egal =</option>
              <option value={FILTER_OPER_NOT_EQUAL}>Différent !=</option>
              <option value={FILTER_OPER_LIKE}>Contient *</option>
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
        <hr />
        {this.props.cols.map((col) => {
          if (col.filterable && col.label !== '') {
            const filter = this.props.filters;
            let colFilterable = col.col;
            if (col.filterable.col && col.filterable.col !== '') {
              colFilterable = col.filterable.col;
            }
            const elem = filter.findFirst(colFilterable);
            let value = '';
            let colOper = oper;
            if (elem) {
              value = elem.getFilterCrit();
              colOper = elem.getOperator();
            }
            const prepend = (
              <select
                id={`oper-${colFilterable}`}
                name={`oper-${colFilterable}`}
                value={colOper}
                className="border-0 bg-light text-secondary"
                onChange={this.props.onFilterOperator}
              >
                <option value={FILTER_OPER_EQUAL}>=</option>
                <option value={FILTER_OPER_NOT_EQUAL}>!=</option>
                <option value={FILTER_OPER_LIKE}>*</option>
                <option value={FILTER_OPER_NOT_LIKE}>!*</option>
                <option value={FILTER_OPER_EMPTY}>&Oslash;</option>
                <option value={FILTER_OPER_NOT_EMPTY}>!&Oslash;</option>
                <option value={FILTER_OPER_GREATER}>&gt;</option>
                <option value={FILTER_OPER_GREATER_OR_EQUAL}>&gt;=</option>
                <option value={FILTER_OPER_GREATER_OR_EQUAL_OR_NULL}>&gt;=&Oslash;</option>
                <option value={FILTER_OPER_LOWER}>&lt;</option>
                <option value={FILTER_OPER_LOWER_OR_EQUAL}>&lt;=</option>
                <option value={FILTER_OPER_LOWER_OR_EQUAL_OR_NULL}>&lt;=&Oslash;</option>
              </select>
            );
            switch (col.filterable.type) {
              case 'date':
                return (
                  <div key={colFilterable}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      <InputDate
                        borderColor="primary"
                        prepend={prepend}
                        id={colFilterable}
                        name={colFilterable}
                        value={value}
                        className="form-control border-primary rounded-right"
                        onChange={this.props.onChange}
                        calIcon={this.props.calIcon}
                        delIcon={this.props.clearIcon}
                      />
                    </div>
                  </div>
                );
              case 'boolean':
              case 'bool':
                if (value === true ) {
                  value = 1;
                } else {
                  if (value === false ) {
                    value = 0;
                  }
                }
                return (
                  <div className="form-group">
                    <label htmlFor={colFilterable} className="">
                      {col.label}
                    </label>
                    <div className="input-group">
                      <InputRadio
                        className="border-0 bg-light text-secondary mr-3"
                        type="radio"
                        name={colFilterable}
                        value={''+value}
                        onChange={this.props.onChange}
                        options={[
                          { label: 'Oui', value: '1' },
                          { label: 'Non', value: '0' },
                          { label: 'Indifférent', value: '' },
                        ]}
                      />
                    </div>
                  </div>
                );
              case 'select':
              case 'select-label':
                return (
                  <div key={colFilterable}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      <select
                        id={colFilterable}
                        name={colFilterable}
                        value={value}
                        className="form-control border-primary"
                        onChange={this.props.onChange}
                      >
                        <option key="0" value="" />
                        {col.filterable.options.map(elt => (
                          <option key={elt.value} value={(col.filterable.type === 'select-label') ? elt.label : elt.value}>
                            {elt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              default:
                return (
                  <div key={colFilterable}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend border border-primary rounded-left">
                          {prepend}
                        </div>
                        <input
                          type="text"
                          id={colFilterable}
                          name={colFilterable}
                          value={value}
                          className="form-control border-primary rounded-right"
                          onChange={this.props.onChange}
                        />
                      </div>
                    </div>
                  </div>
                );
            }
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

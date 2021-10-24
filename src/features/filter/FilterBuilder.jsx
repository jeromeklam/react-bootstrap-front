import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  FILTER_OPER_LIKE,
  FILTER_OPER_SOUND_LIKE,
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
import { InputAutocomplete, FilterHeader } from './';

const getOptionsForType = (type) => {
  let options = [
    {value: FILTER_OPER_EQUAL, label: '='},
    {value: FILTER_OPER_NOT_EQUAL, label: '!='},
    {value: FILTER_OPER_EMPTY, label: 'ø'},
    {value: FILTER_OPER_NOT_EMPTY, label: '!ø'},
  ];
  if (type !== 'date' && type !== 'datetime' && type !== 'picker' && type !== 'select') {
    options.push(
      {value: FILTER_OPER_LIKE, label: '*'},
      {value: FILTER_OPER_NOT_LIKE, label: '!*'},
      {value: FILTER_OPER_SOUND_LIKE, label: '~'}
    );
  }
  if (type !== 'picker' && type !== 'select') {
    options.push(
      {value: FILTER_OPER_GREATER, label: '>'},
      {value: FILTER_OPER_GREATER_OR_EQUAL, label: '>='},
      {value: FILTER_OPER_GREATER_OR_EQUAL_OR_NULL, label: '>=ø'},
      {value: FILTER_OPER_LOWER, label: '<'},
      {value: FILTER_OPER_LOWER_OR_EQUAL, label: '<='},
      {value: FILTER_OPER_LOWER_OR_EQUAL_OR_NULL, label: '<=ø'},
    );
  };
  return options;
}

export default class FilterBuilder extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    filters: PropTypes.element.isRequired,
    onFilterOperator: PropTypes.func.isRequired,
    calIcon: PropTypes.element.isRequired,
    className: PropTypes.string,
    clearIcon: PropTypes.element.isRequired,
    withHeader: PropTypes.bool,
  };
  static defaultProps = {
    className: '',
    withHeader: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: 'tt',
    };
  }

  render() {
    const oper = this.props.filters.getOperator();
    return (
      <div className={classnames('filter-filter-builder', this.props.className)}>
        {this.props.withHeader && (
          <>
            <FilterHeader {...this.props} />
            <hr />
          </>
        )}
        {this.props.cols.map(col => {
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
                className="border-0 text-secondary rounded-left"
                onChange={this.props.onFilterOperator}
              >            
                {getOptionsForType(col.filterable.type).map(elem => 
                  <option key={elem.value} value={elem.value}>{elem.label}</option>
                )}
              </select>
            );
            const prependPicker = (
              <button
                type="button"
                className="border-0 bg-light text-secondary rounded-left"
                id={`oper-${colFilterable}`}
                value={FILTER_OPER_EQUAL}
                disabled
              >
                {' '}
                ={' '}
              </button>
            );
            switch (col.filterable.type) {
              case 'picker':
                return (
                  <div key={col.label}>
                    <InputAutocomplete
                      prepend={prependPicker}
                      id={colFilterable}
                      label={col.label}
                      name={colFilterable}
                      display={col.filterable.display}
                      value={value}
                      size={this.props.size}
                      clearIcon={this.props.clearIcon}
                      onSearch={col.filterable.onSearch}
                      onSelect={this.props.onChange}
                    />
                  </div>
                );
              case 'date':
                return (
                  <div key={col.label}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      <InputDate
                        borderColor="secondary-light"
                        prepend={prepend}
                        id={colFilterable}
                        name={colFilterable}
                        value={value}
                        onChange={this.props.onChange}
                        calIcon={this.props.calIcon}
                        delIcon={this.props.clearIcon}
                      />
                    </div>
                  </div>
                );
              case 'boolean':
              case 'bool':
                if (value === true || value === 1 || value === '1') {
                  value = '1';
                } else {
                  if (value === false || value === 0 || value === '0') {
                    value = '0';
                  } else {
                    value = '';
                  }
                }
                return (
                  <div key={col.label} className="form-group">
                    <label htmlFor={colFilterable} className="">
                      {col.label}
                    </label>
                    <div className="input-group">
                      <InputRadio
                        className="border-0 bg-light text-secondary mr-3"
                        type="radio"
                        name={colFilterable}
                        value={`${value}`}
                        onChange={this.props.onChange}
                        borderColor="secondary-light"
                        options={[
                          { label: 'Oui', value: '1' },
                          { label: 'Non', value: '0' },
                          { label: 'Indifférent', value: '' },
                        ]}
                      />
                    </div>
                  </div>
                );
              case 'component':
                const clonedElementWithMoreProps = React.cloneElement(col.filterable.component, {
                  onChange: e => { e.target.name = colFilterable; this.props.onChange(e, FILTER_OPER_EQUAL) },
                  id: colFilterable,
                  name: colFilterable,
                  value: value
                });
                return (
                  <div key={col.name}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      {clonedElementWithMoreProps}
                    </div>
                  </div>
                );
              case 'select':
                return (
                  <div key={col.name}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      <select
                        id={colFilterable}
                        name={colFilterable}
                        value={value}
                        className="form-control border-secondary-light"
                        onChange={e => this.props.onChange(e, FILTER_OPER_EQUAL)}
                      >
                        <option key="0" value="" />
                        {col.filterable.options.map(elt => (
                          <option key={elt.value} value={elt.value}>
                            {elt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              default:
                return (
                  <div key={col.name}>
                    <div className="form-group">
                      <label htmlFor={colFilterable} className="">
                        {col.label}
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend border border-secondary-light rounded-left">{prepend}</div>
                        <input
                          type="text"
                          id={colFilterable}
                          name={colFilterable}
                          value={value}
                          className="form-control border-secondary-light rounded-right"
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

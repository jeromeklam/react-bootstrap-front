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
  FILTER_OPER_BETWEEN,
  FILTER_OPER_IN,
  FILTER_OPER_NOT_IN,
  FILTER_OPER_START_WITH,
  FILTER_OPER_END_WITH,
} from './';
import { InputRadio, InputDate, InputMonetary, InputGroupPrepend, InputGroupText } from '../basic';
import { InputAutocomplete, FilterHeader } from './';

const getOptionsForType = (type, update = false) => {
  let options = [
    {value: '', label: ''},
    {value: FILTER_OPER_EQUAL, label: 'Est égal à'},
    {value: FILTER_OPER_NOT_EQUAL, label: 'Est différenrt de'},
    {value: FILTER_OPER_EMPTY, label: 'Est vide'},
    {value: FILTER_OPER_NOT_EMPTY, label: 'N\'est pas vide'},
  ];
  if (type !== 'date' && type !== 'datetime' && type !== 'picker' && type !== 'select') {
    options.push(
      {value: FILTER_OPER_LIKE, label: 'Contient'},
      {value: FILTER_OPER_NOT_LIKE, label: 'Ne contient pas'},
      {value: FILTER_OPER_START_WITH, label: 'Commence par'},
      {value: FILTER_OPER_END_WITH, label: 'Termine par'},
      {value: FILTER_OPER_SOUND_LIKE, label: 'Ressemble à'}
    );
  }
  if (type !== 'picker' && type !== 'select') {
    options.push(
      {value: FILTER_OPER_GREATER, label: 'Supérieur à'},
      {value: FILTER_OPER_GREATER_OR_EQUAL, label: 'Supérieur ou égal à'},
      {value: FILTER_OPER_GREATER_OR_EQUAL_OR_NULL, label: 'Vide ou supérieur et égal à'},
      {value: FILTER_OPER_LOWER, label: 'Inférieur à'},
      {value: FILTER_OPER_LOWER_OR_EQUAL, label: 'Inférieur ou égal à'},
      {value: FILTER_OPER_LOWER_OR_EQUAL_OR_NULL, label: 'Vide ou inférieur et égal à'},
    );
  };
  if (update && (type === 'date' || type === 'datetime' || type === 'monetary' || type === 'number')) {
    options.push(
      {value: FILTER_OPER_BETWEEN, label: 'Compris entre'}
    );
  }
  return options;
}

export default class FilterBuilder extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    filters: PropTypes.element.isRequired,
    onFilterOperator: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    addIcon: PropTypes.element.isRequired,
    delIcon: PropTypes.element.isRequired,
    calIcon: PropTypes.element.isRequired,
    className: PropTypes.string,
    withHeader: PropTypes.bool,
  };
  static defaultProps = {
    className: '',
    onUpdate: null,
    onAdd: null,
    onRemove: null,
    withHeader: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      id: 'tt',
    };
  }

  render() {
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
            const allConds = getOptionsForType(col.filterable.type, this.props.onUpdate ? true : false);
            let value = '';
            let colOper = '';
            let allValues = {};
            if (elem) {
              value = elem.getFilterCrit();
              colOper = elem.getOperator();
              allValues = elem.getFilterCrits();
              if (allConds.findIndex(colL => colL.value === colOper) < 0) {
                colOper = FILTER_OPER_EQUAL;
              }
            }
            if (value === null) {
              value = '';
            }
            const prepend = (
              <select
                id={`oper-${colFilterable}`}
                name={`oper-${colFilterable}`}
                value={colOper}
                className="border-0 text-secondary rounded-left bg-light"
                onChange={this.props.onFilterOperator}
              >            
                {allConds.map(elem => 
                  <option key={elem.value} value={elem.value}>{elem.label}</option>
                )}
              </select>
            );
            const prependPicker = (
              <button
                type="button"
                className="border-0 bg-light text-secondary rounded-left bg-light"
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
                      clearIcon={this.props.delIcon}
                      onSearch={col.filterable.onSearch}
                      onSelect={this.props.onChange}
                    />
                  </div>
                );
              case 'date':
                return (
                  <div key={col.label}>
                    <div className={classnames("form-group", colOper === FILTER_OPER_BETWEEN && "form-group-no-bottom")}>
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
                        delIcon={this.props.delIcon}
                      />
                    </div>
                    {colOper === FILTER_OPER_BETWEEN && this.props.onUpdate &&
                      <div className="form-group">
                        <InputDate
                          borderColor="secondary-light"
                          prepend={' et'}
                          id={colFilterable}
                          name={colFilterable}
                          value={elem.getFilterCrit('between')}
                          onChange={this.props.onUpdate}
                          calIcon={this.props.calIcon}
                          delIcon={this.props.delIcon}
                        />
                      </div>
                    }
                  </div>
                );
                case 'monetary':
                  return (
                    <div key={col.label}>
                      <div className={classnames("form-group", colOper === FILTER_OPER_BETWEEN && "form-group-no-bottom")}>
                        <label htmlFor={colFilterable} className="">
                          {col.label}
                        </label>
                        <InputMonetary
                          borderColor="secondary-light"
                          prepend={prepend}
                          id={colFilterable}
                          name={colFilterable}
                          value={value}
                          onChange={this.props.onChange}
                          calIcon={this.props.calIcon}
                          delIcon={this.props.delIcon}
                        />
                      </div>
                      {colOper === FILTER_OPER_BETWEEN && this.props.onUpdate &&
                        <div className="form-group">
                          <InputMonetary
                            borderColor="secondary-light"
                            prepend={' et'}
                            id={colFilterable}
                            name={colFilterable}
                            value={elem.getFilterCrit('between')}
                            onChange={this.props.onUpdate}
                            calIcon={this.props.calIcon}
                            delIcon={this.props.delIcon}
                          />
                        </div>
                      }
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
                      <div className="input-group">
                        <InputGroupPrepend>
                          <InputGroupText className="border-rbf bg-light">{prepend}</InputGroupText>
                        </InputGroupPrepend>
                        <select
                          id={colFilterable}
                          name={colFilterable}
                          value={value}
                          className="form-control border-secondary-light"
                          onChange={this.props.onChange}
                        >
                          <option key="0" value="" />
                          {col.filterable.options.map(elt => (
                            <option key={elt.value} value={elt.value}>
                              {elt.label}
                            </option>
                          ))}
                        </select>
                        {value &&
                          <div className="input-group-append border-secondary-light rounded-right">
                            <button
                              type="button"
                              className={classnames(
                                'btn btn-input btn-outline-rbf bg-light'
                              )}
                              onClick={() => {
                                const ev = {
                                  target: {
                                    name: colFilterable,
                                    value: '',
                                  }
                                }
                                this.props.onAdd(ev);
                              }}
                            >
                              {this.props.addIcon}
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                    {Object.keys(allValues).map(key => {
                      if (key !== 'default') {
                        return (
                          <div className="form-group">
                            <div className="input-group">
                              <InputGroupPrepend>
                                <InputGroupText className="border-rbf bg-light">{' ou'}</InputGroupText>
                              </InputGroupPrepend>
                              <select
                                id={colFilterable + '@@' + key}
                                name={colFilterable + '@@' + key}
                                value={allValues[key]}
                                className="form-control border-secondary-light"
                                onChange={this.props.onUpdate}
                              >
                                <option key="0" value="" />
                                {col.filterable.options.map(elt => (
                                  <option key={elt.value} value={elt.value}>
                                    {elt.label}
                                  </option>
                                ))}
                              </select>
                              <div className="input-group-append border-secondary-light rounded-right">
                                  <button
                                    type="button"
                                    className={classnames(
                                      'btn btn-input btn-outline-rbf bg-light'
                                    )}
                                    onClick={() => {
                                      const ev = {
                                        target: {
                                          name: colFilterable + '@@' + key,
                                          value: '',
                                        }
                                      }
                                      this.props.onRemove(ev);
                                    }}
                                  >
                                    {this.props.delIcon}
                                  </button>
                                </div>
                            </div>
                          </div>
                        )
                      }
                    })}
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
                        <InputGroupPrepend>
                          <InputGroupText className="border-rbf bg-light">{prepend}</InputGroupText>
                        </InputGroupPrepend>
                        <input
                          type="text"
                          id={colFilterable}
                          name={colFilterable}
                          value={value}
                          className="form-control border-secondary-light rounded-right"
                          onChange={this.props.onChange}
                        />
                        {value &&
                          <div className="input-group-append border-secondary-light rounded-right">
                            <button
                              type="button"
                              className={classnames(
                                'btn btn-input btn-outline-rbf bg-light'
                              )}
                              onClick={() => {
                                const ev = {
                                  target: {
                                    name: colFilterable,
                                    value: '',
                                  }
                                }
                                this.props.onChange(ev);
                              }}
                            >
                              {this.props.delIcon}
                            </button>
                            <button
                              type="button"
                              className={classnames(
                                'btn btn-input btn-outline-rbf bg-light'
                              )}
                              onClick={() => {
                                const ev = {
                                  target: {
                                    name: colFilterable,
                                    value: '',
                                  }
                                }
                                this.props.onAdd(ev);
                              }}
                            >
                              {this.props.addIcon}
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                    {Object.keys(allValues).map(key => {
                      if (key !== 'default') {
                        return (
                          <div className="form-group">
                            <div className="input-group">
                              <InputGroupPrepend>
                                <InputGroupText className="border-rbf bg-light">{' ou'}</InputGroupText>
                              </InputGroupPrepend>
                              <input
                                type="text"
                                id={colFilterable + '@@' + key}
                                name={colFilterable + '@@' + key}
                                value={allValues[key] || ''}
                                className="form-control border-secondary-light rounded-right"
                                onChange={this.props.onUpdate}
                              />
                                <div className="input-group-append border-secondary-light rounded-right">
                                  <button
                                    type="button"
                                    className={classnames(
                                      'btn btn-input btn-outline-rbf bg-light'
                                    )}
                                    onClick={() => {
                                      const ev = {
                                        target: {
                                          name: colFilterable + '@@' + key,
                                          value: '',
                                        }
                                      }
                                      this.props.onRemove(ev);
                                    }}
                                  >
                                    {this.props.delIcon}
                                  </button>
                                </div>
                            </div>
                          </div>
                        )
                      }
                      return null;
                    })}
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

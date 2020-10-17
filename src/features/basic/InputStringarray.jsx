import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { InputText } from './';

const InputLine = props => (
  <div className="row">
    <div className="col-sm-15">
      <InputText
        name="value"
        value={props.value.value}
        labelTop={false}
        inputSize={36}
        label=""
        disabled={!props.value.new}
        onChange={props.onChange}
      />
    </div>
    <div className="col-sm-15">
      <InputText
        name="label"
        value={props.value.label}
        labelTop={false}
        inputSize={36}
        label=""
        onChange={props.onChange}
      />
    </div>
    <div className="col-sm-6">
      <button className="btn bg-light btn-outline-secondary text-warning" onClick={props.onDelete}>
        {props.minusIcon}
      </button>
    </div>
  </div>
);
InputLine.propTypes = {
  value: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  minusIcon: PropTypes.element.isRequired,
};

const emptyItem = { value: '', label: '', new: true };

export default class InputStringarray extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    labelTop: PropTypes.bool,
    plusIcon: PropTypes.element.isRequired,
    label: PropTypes.string,
    titleValue: PropTypes.string,
    titleLabel: PropTypes.string,
  };
  static defaultProps = {
    labelTop: true,
    label: '',
    titleValue: '',
    titleLabel: '',
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
    this.onDelOne = this.onDelOne.bind(this);
  }

  onAddNew() {
    const datas = this.props.value;
    let lines = JSON.parse(datas) || [emptyItem];
    lines.push(emptyItem);
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(lines),
      },
    });
  }

  onDelOne(idx) {
    const datas = this.props.value;
    let lines = JSON.parse(datas) || [emptyItem];
    if (lines[idx].new) {
      lines.splice(idx, 1);
    } else {
      lines[idx].deleted = true;
    }
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(lines),
      },
    });
  }

  onChange(event, idx) {
    let value = event.target.value;
    const datas = this.props.value;
    let lines = JSON.parse(datas) || [emptyItem];
    lines[idx][event.target.name] = value;
    if (!lines[idx].new) {
      lines[idx].updated = true;
    }
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(lines),
      },
    });
  }

  render() {
    let addNew = true;
    const datas = this.props.value;
    const lines = JSON.parse(datas) || [emptyItem];
    return (
      <div className="form-group">
        {this.props.label && (
          <label htmlFor={this.props.id} className={classnames(!this.props.labelTop && 'col-sm-6 col-form-label')}>
            {this.props.label}
          </label>
        )}
        {(this.props.titleValue || this.props.titleLabel) && (
           <div className="row">
             <div className="col-sm-15">
               <label className={classnames(!this.props.labelTop && 'col-form-label')}>
                 {this.props.titleValue}
               </label>
             </div>
             <div className="col-sm-15">
               <label className={classnames(!this.props.labelTop && 'col-form-label')}>
                 {this.props.titleLabel}
               </label>
             </div>
           </div>
        )}
        <div>
          {lines.map((line, i) => {
            if (line.label === '' && line.value === '') {
              addNew = false;
            }
            if (!line.deleted) {
              return (
                <InputLine
                  key={`line-${i}`}
                  {...this.props}
                  value={line}
                  onChange={(event) => { this.onChange(event, i); }}
                  onDelete={() => { this.onDelOne(i); }}
                />
              );
            }
            return null;
          })}
          {addNew && (
            <button className="btn bg-light btn-outline-secondary" onClick={this.onAddNew}>
              {this.props.plusIcon}
            </button>
          )}
        </div>
      </div>
    );
  }
}

import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import fr from 'date-fns/locale/fr';
import './InputDate.css';

registerLocale('fr', fr);

const Input = forwardRef(({
  onChange,
  placeholder,
  value,
  id,
  onClick,
  onClear,
  delIcon,
  calIcon,
  size,
  error,
  warning,
}, _ref) => (
  <div className="input-group">
    <input
      className={classnames(
        'border-secondary form-control',
        size && `form-control-${size}`,
        (error || warning) && 'is-invalid',
      )}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      id={id}
      onClick={onClick}
      ref={_ref}
    />
    <div className="input-group-append">
      <button type="button" className={classnames('btn btn-outline-secondary bg-light', size && `btn-${size}`)} onClick={onClear}>
        {delIcon}
      </button>
      <button type="button" className={classnames('btn btn-outline-secondary bg-light', size && `btn-${size}`)} onClick={onClick}>
        {calIcon}
      </button>
    </div>
  </div>
));

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

Input.defaultProps = {
  placeholder: 'Date',
};

export default class InputDatetime extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    labelTop: PropTypes.bool,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    labelSize: PropTypes.number,
    inputSize: PropTypes.number,
    delIcon: PropTypes.element.isRequired,
    calIcon: PropTypes.element.isRequired,
    error: PropTypes.element,
  };

  static defaultProps = {
    labelTop: true,
    value: '',
    label: '',
    id: '',
    size: null,
    labelSize: 6,
    inputSize: 30,
    onChange: () => {},
    disabled: false,
    required: false,
    error: false,
  };

  constructor(props) {
    super(props);
    let value = null;
    if (this.props.value) {
      value = Date.parse(this.props.value);
    }
    this.state = {
      value: value,
    };
    this.onDatePicker = this.onDatePicker.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onClear(event) {
    this.setState({ value: null });
    const event2 = {
      target: {
        name: this.props.name,
        value: null,
      },
    };
    this.props.onChange(event2);
  }

  onDatePicker(date) {
    this.setState({ value: date });
    const event = {
      target: {
        name: this.props.name,
        value: date,
      },
    };
    this.props.onChange(event);
  }

  render() {
    return (
      <div
        className={classnames(
          'form-group',
          !this.props.labelTop && 'row',
          this.props.size && `form-group-${this.props.size}`
        )}
      >
        {this.props.label !== '' && (
          <label
            htmlFor={this.props.id}
            className={classnames(
              !this.props.labelTop && `col-sm-${this.props.labelSize} col-form-label`,
              this.props.size && `col-form-label-${this.props.size}`
            )}
          >
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div
          className={classnames(
            !this.props.labelTop && `col-sm-${this.props.inputSize}`,
            this.props.error && 'is-invalid',
          )}
        >
          <DatePicker
            selected={this.state.value}
            onChange={this.onDatePicker}
            dateFormat="dd/MM/yyyy HH:mm"
            locale="fr"
            showWeekNumbers
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            popperPlacement="bottom-start"
            customInput={<Input onClear={this.onClear} {...this.props} />}
            className="form-control"
          />
        </div>
        {this.props.error && <div className="invalid-feedback">{this.props.error}</div>}
      </div>
    );
  }
}

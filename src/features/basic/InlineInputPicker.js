import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export const InlineInputPicker = props => (
  <div
    className={classnames(
      'form-group layout-input-picker',
      !props.labelTop && 'row',
      props.size && `form-group-${props.size}`,
    )}
  >
    <div className={classnames(!props.labelTop && `col-xs-w${props.inputSize}`)}>
      <div className="row">
        <div className={classnames('col-xs-w36 input-group', props.error && 'is-invalid')}>
          <input type="hidden" name={'autocomplete-field-@'} value={props.value} />
          <input
            type="text"
            name={props.name}
            value={props.display || ''}
            className={classnames('border-secondary form-control', props.size && `form-control-${props.size}`)}
            onChange={props.onChange}
            autoComplete="off"
          />
          <div className="input-group-append">
            {props.onClear && (
              <button
                type="button"
                className={classnames('btn btn-outline-secondary bg-light', props.size === 'sm' && `btn-${props.size}`)}
                onClick={props.onClear}
              >
                {props.clearIcon}
              </button>
            )}
            {props.onMore && (
              <button
                type="button"
                className={classnames('btn btn-outline-secondary bg-light', props.size === 'sm' && `btn-${props.size}`)}
                onClick={props.onMore}
              >
                {props.moreIcon}
              </button>
            )}
          </div>
          {props.list && props.list.length > 0 && (
            <div className="dropdown-menu show">
              {props.list.map(item => (
                <a
                  key={item[props.pickerId]}
                  className="dropdown-item"
                  onClick={() => {
                    item.id = '' + item[props.pickerId];
                    props.onSelect(item);
                  }}
                >
                  {item[props.pickerDisplay]}
                </a>
              ))}
            </div>
          )}
        </div>
        {props.error && <div className="invalid-feedback">{props.error}</div>}
      </div>
    </div>
  </div>
);

InlineInputPicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  clearIcon: PropTypes.element.isRequired,
  moreIcon: PropTypes.element.isRequired,
  value: PropTypes.string,
  display: PropTypes.string,
  onClear: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
  list: PropTypes.element.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  pickerId: PropTypes.string,
  pickerDisplay: PropTypes.string,
  size: PropTypes.string,
  inputSize: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.element,
};

InlineInputPicker.defaultProps = {
  value: '',
  display: '',
  pickerId: '',
  pickerDisplay: '',
  size: null,
  inputSize: 36,
  required: false,
  error: false,
};

import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';

class InlineInput extends React.Component {

  static propTypes = {
    onSave: PropTypes.func,
    border: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    resize: PropTypes.oneOf(['none', 'vertical', 'horizontal']),
  };

  static defaultProps = {
    onSave: () => {},
    placeholder: '',
    value: '',
    border: false,
    autoFocus: false,
    resize: 'none',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return { value: props.value };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    }
  }

  onFocus = e => e.target.select();

  // This is the way to select all text if mouse clicked
  onMouseDown = e => {
    if (document.activeElement !== e.target) {
      e.preventDefault();
      this.refInput.focus();
    }
  };

  onBlur = () => {
    this.updateValue();
  };

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.refInput.blur();
      e.preventDefault();
    }
    if (e.keyCode === 27) {
      this.setValue(this.props.value);
      this.refInput.blur();
      e.preventDefault();
    }
    if (e.keyCode === 9) {
      if (this.getValue().length === 0) {
        this.props.onCancel();
      }
      this.refInput.blur();
      e.preventDefault();
    }
  };

  getValue = () => this.refInput.value;
  setValue = value => (this.refInput.value = value);

  updateValue = () => {
    if (this.getValue() !== this.props.value) {
      this.props.onSave(this.getValue());
    }
  };

  setRef = ref => {
    this.refInput = ref;
    if (this.props.resize !== 'none') {
      autosize(this.refInput);
    }
  };

  render() {
    const { autoFocus, border, value, placeholder } = this.props;
    return (
      <textarea
        className="trello-inline-input text-secondary bold"
        ref={this.setRef}
        onMouseDown={this.onMouseDown}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        placeholder={value.length === 0 ? undefined : placeholder}
        defaultValue={value}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        rows={1}
        autoFocus={autoFocus}
      />
    );
  }
};

export default InlineInput;

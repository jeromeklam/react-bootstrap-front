import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import { DropdownWrapper } from '../advanced'
import { DropdownMenu } from '../basic';

export default class ColorPicker extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef()
    }
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (color) => {
    const { onChange } = this.props;
    onChange('color', color.hex);
  }

  render() {
    const trigger = (
      <button
        type="button"
        className={classnames(this.props.className, 'btn btn-light')}
      >
        {this.props.config.icon ? this.props.config.icon : 'Color' }
      </button>
    );
    const { color } = this.props.currentState;
    return (
      <DropdownWrapper autoClose={false} trigger={trigger} className="ui-inline-wrapper btn-group pl-2" align="bottom-right" myRef={this.state.myRef}>
        <DropdownMenu>
          <ChromePicker color={color} onChangeComplete={this.onChange} />
        </DropdownMenu>
      </DropdownWrapper>
    );
  }
}
import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced'
import { DropdownMenu, DropdownMenuOption } from '../basic';

export default class MailMerge extends Component {
  static propTypes = {
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef()
    }
    this.onChange = this.onChange.bind(this);
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  onChange = (text) => {
    this.props.onChangeText(text);
  }

  render() {
    const trigger = (
      <button
        type="button"
        className={classnames(this.props.className, 'btn btn-light')}
      >
        {this.props.icon ? this.props.icon : 'MailMerge' }
      </button>
    );
    const options = this.props.options;
    return (
      <DropdownWrapper trigger={trigger} className="ui-inline-wrapper btn-group pl-2" align="bottom-right" myRef={this.state.myRef}>
        <DropdownMenu>
          {options.map((text, index) =>
            (<DropdownMenuOption
              className="rdw-mailmerge-option"
              onClick={() => this.onChange(text.text_content)}
              key={index}
            >
              {text.text_code}
            </DropdownMenuOption>),
          )}
        </DropdownMenu>
      </DropdownWrapper>
    );
  }
}
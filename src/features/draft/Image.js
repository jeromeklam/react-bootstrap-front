import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced'
import { DropdownMenu, InputText } from '../basic';

export default class Image extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      myRef: React.createRef()
    }
    this.onChange = this.onChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }

  onChange(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const value = ev.target.value;
      const name = ev.target.name;
      this.setState({ [name]: value });
    }
  }

  onAdd(ev) {
    const url = this.state.url;
    this.setState({ url: '' });
    this.props.onChange(url);
  }

  render() {
    const trigger = (
      <button
        type="button"
        className={classnames(this.props.className, 'btn btn-light')}
      >
        {this.props.config.icon ? this.props.config.icon : 'Image'}
      </button>
    );
    //console.log(this.props.currentState, this.props.config);
    return (
      <DropdownWrapper autoClose={false} trigger={trigger} className="ui-inline-wrapper btn-group pl-2" align="bottom-right" myRef={this.state.myRef}>
        {({ onClose }) =>
          <DropdownMenu>
            <>
              <InputText labelTop={true} label="Url" name="url" value={this.state.url} onChange={this.onChange} />
              <button type="button" class="btn btn-xs btn-success" onClick={(ev) => { onClose(); this.onAdd(ev); }}>Ok</button>
            </>
          </DropdownMenu>
        }
      </DropdownWrapper>
    );
  }
}
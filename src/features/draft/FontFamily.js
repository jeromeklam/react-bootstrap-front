import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced'
import { DropdownMenu, DropdownMenuOption } from '../basic';

export default class FontFamily extends Component {
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

  onChange = (family) => {
    const { onChange } = this.props;
    onChange('family', family.hex);
  }

  render() {
    const trigger = (
      <button
        type="button"
        className={classnames(this.props.className, 'btn btn-light')}
      >
        {this.props.icon ? this.props.icon : 'Font' }
      </button>
    );
    const {
        config: { icon, className, dropdownClassName, options, title },
        onChange,
        expanded,
        doCollapse,
        onExpandEvent,
        doExpand,
        translations,
      } = this.props;
    let { currentState: { fontFamily: currentFontFamily } } = this.props;
    let { defaultFontFamily } = this.state;
    currentFontFamily = currentFontFamily ||
    (options && options.indexOf(defaultFontFamily) >= 0 && defaultFontFamily);
    return (
      <DropdownWrapper trigger={trigger} className="ui-inline-wrapper btn-group pl-2" align="bottom-right" myRef={this.state.myRef}>
        <DropdownMenu>
         {options.map((family, index) =>
           (<DropdownMenuOption
             className="rdw-fontfamily-option"
             active={currentFontFamily === family}
             onClick={() => onChange(family)}
             key={index}
           >
             {family}
           </DropdownMenuOption>),
         )}
        </DropdownMenu>
      </DropdownWrapper>
    );
  }
}
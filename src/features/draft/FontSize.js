import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { DropdownWrapper } from '../advanced'
import { DropdownMenu, DropdownMenuOption } from '../basic';

export default class FontSize extends Component {
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
        Size
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
    let { currentState: { fontSize: currentFontSize } } = this.props;
    let { defaultFontSize } = this.state;
    defaultFontSize = Number(defaultFontSize);
    currentFontSize = currentFontSize ||
    (options && options.indexOf(defaultFontSize) >= 0 && defaultFontSize);
    return (
      <DropdownWrapper trigger={trigger} className="rbf-inline-wrapper btn-group pl-2" align="bottom-right" myRef={this.state.myRef}>
        <DropdownMenu>
         {options.map((size, index) =>
           (<DropdownMenuOption
             className="rdw-fontsize-option"
             active={currentFontSize === size}
             onClick={() => onChange(size)}
             key={index}
           >
             {size}
           </DropdownMenuOption>),
         )}
        </DropdownMenu>
      </DropdownWrapper>
    );
  }
}
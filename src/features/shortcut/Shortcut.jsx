import React, { Component } from 'react';
import classnames from 'classnames';

class Shortcut extends Component {
  constructor(props) {
    super(props);
    this._onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    if (this.props.onClick) {
      this.props.onClick(evt);
    }
  }
  //
  render() {
    const { title, icon, letters, hide, className, size } = this.props;
    return (
      <button
        title={title}
        className={classnames(
          'shortcut',
          'shortcut-' + size,
          hide && 'shortcut-off',
          className,
        )}
        onClick={evt => {
          this.onClick(evt);
        }}
      >
        <div className={classnames('shortcut-content', letters && 'shortcut-letters', hide && 'shortcut-off')}>
          {icon}
          {letters && <span>{letters}</span>}
        </div>
      </button>
    );
  }
}

export default Shortcut;

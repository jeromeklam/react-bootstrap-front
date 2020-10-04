import PropTypes from 'prop-types'
import React from 'react'

class IconWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { event, accessors, icons } = this.props;
    const done = accessors.done(event);
    const priority = accessors.priority(event);
    return (
      <div className="rbc-icons">
        {priority && (
          icons && icons[priority] ? <div className="rbc-icon">{this.props.icons[priority]}</div> : <span></span>
        )}
        {done && (
          icons && icons.done ? <div className="rbc-icon">{this.props.icons.done}</div> : <span>Ok</span>
        )}
      </div>
    );
  }
};

export default IconWrapper

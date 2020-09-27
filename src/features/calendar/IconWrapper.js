import PropTypes from 'prop-types'
import React from 'react'

class IconWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { event, accessors, icons } = this.props;
    let done = accessors.done(event);
    return (
      <div className="rbc-icons">
        {done ? (
          icons && icons.done ? <div className="rbc-icon">{this.props.icons.done}</div> : <span>Ok</span>
        ) : (
          <span></span>
        )}
      </div>
    );
  }
};

export default IconWrapper

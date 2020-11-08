import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Tag extends Component {
  render() {
    const { title, color, bgcolor, tagStyle, className, ...otherProps } = this.props;
    const style = { color: color, backgroundColor: bgcolor, ...tagStyle };
    return (
      <span style={style} {...otherProps} className={classnames('trello-tag', className)}>
        {title}
      </span>
    );
  }
}

Tag.propTypes = {
  bgcolor: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  tagStyle: PropTypes.object,
  title: PropTypes.string.isRequired,
};
Tag.defaultProps = {
  bgcolor: 'orange',
  color: 'white',
  className: '',
  tagStyle: {},
};

export default Tag;

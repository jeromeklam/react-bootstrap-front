import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Tag extends Component {
  render() {
    const { title, theme, className, ...otherProps } = this.props;
    return (
      <span {...otherProps} className={classnames('trello-tag text-white', `bg-${theme}`, className)}>
        {title}
      </span>
    );
  }
}

Tag.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.string,
  title: PropTypes.string.isRequired,
};
Tag.defaultProps = {
  className: '',
  theme: 'secondary',
};

export default Tag;

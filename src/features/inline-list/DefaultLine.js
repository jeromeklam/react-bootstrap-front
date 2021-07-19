import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getObjectmemberValue } from '../helpers';
import { HoverObserver } from '../advanced';
import { DefaultCol } from '../list';

const mystyle = {
  minHeight: '40px',
  lineHeight: '40px',
  verticalAlign: 'middle',
};

export default class DefaultLine extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    item: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
  };
  static defaultProps = {
    onSelect: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  mouseLeave() {
    this.setState({ flipped: false });
  }

  mouseEnter() {
    this.setState({ flipped: true });
  }

  handleDoubleClick(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.props.item);
    } else {
      this.props.inlineActions.forEach(action => {
        if (action.role === 'MODIFY') {
          action.onClick(this.props.id);
        }
      });
    }
    return false;
  }

  render() {
    return (
      <div className="inline-list-default-line">
        <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
          <div
            onDoubleClick={this.handleDoubleClick}
            style={mystyle}
            className={classnames(
              'default-list-wrapper row row-line-separator border-secondary-light',
              this.props.fClassName && this.props.fClassName(this.props.item),
              this.state.flipped && 'row-line-hover'
            )}
          >
            {this.props.cols.map((oneCol, i) => {
              if (!oneCol.hidden) {
                const line = { ...oneCol, id: this.props.id };
                const content = getObjectmemberValue(this.props.item, oneCol.col);
                return <DefaultCol {...line} content={content} item={this.props.item} selectable={false} />;
              }
              return null;
            })}
          </div>
        </HoverObserver>
      </div>
    );
  }
}

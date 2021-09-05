import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { HoverObserver } from '../advanced';
import { getObjectmemberValue, isMobileDevice } from '../helpers';
import { DefaultLineCol, ActionButton } from './';

const mystyle = {};

const navstyle = {
  position: 'absolute',
  right: '10px',
  padding: '0px',
};

export default class DesktopListLine extends Component {
  static propTypes = {
    className: PropTypes.string,
    counter: PropTypes.number,
    cols: PropTypes.element.isRequired,
    id: PropTypes.string.isRequired,
    item: PropTypes.element.isRequired,
    fClassName: PropTypes.func,
    fDisplay: PropTypes.func,
    onDelOne: PropTypes.func.isRequired,
    inlineActions: PropTypes.element.isRequired,
    inlineOpenedId: PropTypes.number,
    inlineComponent: PropTypes.element,
    onSelect: PropTypes.func,
    selected: PropTypes.element,
    mode: PropTypes.string,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    counter: 0,
    inlineOpenedId: 0,
    inlineComponent: null,
    onSelect: () => {},
    onClick: () => {},
    selected: [],
    fClassName: null,
    fDisplay: null,
    mode: 'inline',
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
    this.props.inlineActions.forEach(action => {
      if (action.role === 'MODIFY') {
        action.onClick(this.props.id);
      }
    });
    return false;
  }

  render() {
    const { item } = this.props;
    let rowOddEven = 'row-no-odd-even';
    if (this.props.counter) {
      rowOddEven = this.props.counter % 2 === 0 ? 'row-even' : 'row-odd';
    }
    return (
      <div className={this.props.className}>
        <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
          <div
            onDoubleClick={this.handleDoubleClick}
            onClick={ev => {
              this.props.onClick(item);
            }}
            style={mystyle}
            className={classnames(
              'default-list-wrapper row row-line',
              this.props.fClassName && this.props.fClassName(item),
              this.props.inlineOpenedId === this.props.id ? 'bg-selected' : 'text-dark',
              this.state.flipped && 'row-line-hover',
              rowOddEven
            )}
          >
            <div className="col-highlighter" />
            {this.props.cols.map((oneCol, i) => {
              if (!oneCol.hidden) {
                const line = { ...oneCol, id: this.props.id };
                const content = getObjectmemberValue(item, oneCol.col);
                return (
                  <DefaultLineCol
                    key={line.name}
                    selected={this.props.selected}
                    onSelect={this.props.onSelect}
                    content={content}
                    item={item}
                    {...line}
                  />
                );
              }
              return null;
            })}
            {this.state.flipped && (
              <div style={navstyle} className="default-line-menu btn-group">
                {this.props.inlineActions &&
                  this.props.inlineActions.map(action => {
                    let display = true;
                    if (typeof action.fDisplay === 'function') {
                      display = action.fDisplay(this.props.item);
                    }
                    if (
                      display &&
                      (this.props.inlineOpenedId !== this.props.id ||
                        action.role === 'DELETE' ||
                        action.role === 'MODIFY')
                    ) {
                      if (action.role === 'DETAIL' || action.role === 'SUMMARY') {
                        return null;
                      }
                      let actionClass = '';
                      switch (action.role) {
                        case 'PRINT':
                        case 'MODIFY':
                          actionClass = 'white btn-secondary';
                          break;
                        default:
                          actionClass = 'btn-' + action.theme;
                          break;
                      }
                      return (
                        <ActionButton
                          key={action.name}
                          action={action}
                          item={item}
                          className={classnames('btn-inline btn-action', actionClass)}
                        />
                      );
                    }
                    return null;
                  })}
              </div>
            )}
          </div>
        </HoverObserver>
      </div>
    );
  }
}

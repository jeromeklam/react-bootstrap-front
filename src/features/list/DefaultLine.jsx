import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { HoverObserver } from '../advanced';
import { getObjectmemberValue } from '../helpers';
import { DefaultCol, ActionButton } from './';

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
    selected: PropTypes.array,
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
      clicked: false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
        if (action.param === 'object') {
          action.onClick(this.props.item);
        } else {
          action.onClick(this.props.id);
        }
      }
    });
    return false;
  }

  handleClick(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (!this.state.clicked) {
      this.setState({clicked: true});
      setTimeout(() => { this.setState({clicked: false}); }, 500);
      this.props.onClick(this.props.item);
    }
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
            onDoubleClick={ev => {
              this.handleDoubleClick(ev);
            }}
            onClick={ev => {
              this.handleClick(ev);
            }}
            style={mystyle}
            className={classnames(
              'default-list-wrapper row row-line',
              this.props.fClassName && this.props.fClassName(item),
              this.props.inlineOpenedId === item.id ? 'bg-selected' : 'text-dark',
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
                  <DefaultCol
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
                    if (typeof action.fShow === 'function') {
                      display = action.fShow(this.props.item);
                    }
                    if (
                      display &&
                      (this.props.inlineOpenedId !== this.props.id ||
                        action.role === 'DELETE' ||
                        action.role === 'MODIFY')
                    ) {
                      let actionClass = '';
                      if (action.role !== 'OTHER') {
                        actionClass = 'btn-' + action.theme;
                      } else {
                        actionClass = 'btn-light btn-outline-sedonary-light border-secondary text-secondary';
                      }
                      if (action.component) {
                        const clonedElementWithMoreProps = React.cloneElement(action.component, {
                          item: this.props.item,
                        });
                        return clonedElementWithMoreProps;
                      } else {
                        return (
                          <ActionButton
                            key={action.name}
                            action={action}
                            item={item}
                            className={classnames('btn-inline btn-action', actionClass)}
                          />
                        );
                      }
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

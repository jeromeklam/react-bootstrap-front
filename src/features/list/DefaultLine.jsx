import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { HoverObserver } from '../advanced';
import { getObjectmemberValue } from '../helpers';
import { DefaultCol, ActionButton } from './';

const duration = 500;

const mystyle = {
  minHeight: '40px',
  lineHeight: '40px',
  verticalAlign: 'middle',
};

const navstyle = {
  position: 'absolute',
  right: '10px',
  padding: '0px',
};

const defaultStyle = {
  height: '0px',
  display: 'none',
  transition: `height ${duration}ms opacity ${duration}ms`,
  animationIterationCount: '1',
};

const transitionStyles = {
  entering: {
    height: '0px',
    display: 'block',
    opacity: '0',
  },
  entered: {
    height: '100%',
    display: 'block',
    opacity: '1',
  },
  exiting: {
    height: '100%',
    opacity: '1',
  },
  exited: {
    height: '0px',
    display: 'none',
    opacity: '0',
  },
};

const inlineStyle = {
  overflowY: 'auto',
  overflowX: 'hidden',
};

export default class DesktopListLine extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    cols: PropTypes.element.isRequired,
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
    const highlight = this.state.flipped || this.props.inlineOpenedId === this.props.id;
    return (
      <div className={this.props.className}>
        <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
          <div
            onDoubleClick={this.handleDoubleClick}
            onClick={() => {
              this.props.onClick(item);
            }}
            style={mystyle}
            className={classnames(
              'default-list-wrapper row row-line-separator',
              this.props.fClassName && this.props.fClassName(item),
              this.props.inlineOpenedId === this.props.id ? 'bg-secondary text-light pt-2 pb-0' : 'text-dark',
              this.props.inlineOpenedId !== this.props.id && this.state.flipped && 'row-line-hover'
            )}
          >
            <div className="col-highlighter"></div>
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
            {(highlight) && (
              <ul style={navstyle} className="default-line-menu nav">
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
                      return (
                        <li className="nav-item" key={action.name}>
                          <ActionButton action={action} item={item} className={classnames('btn-inline',action.theme && `btn-${action.theme}`)} />
                        </li>
                      );
                    }
                    return null;
                  })}
              </ul>
            )}
          </div>
        </HoverObserver>
        {this.props.mode === 'inline' && (
          <CSSTransition in={this.props.inlineOpenedId === this.props.id} timeout={duration}>
            {state => (
              <div
                className="row bg-secondary text-light pt-2 pb-2"
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                <div className="col-xs-w36 pb-3">
                  {this.props.inlineOpenedId === this.props.id && (
                    <div className="row">
                      <div className="col-xs-w1 text-center bg-secondary" />
                      <div className="col-xs-w32 bg-white p-0 text-secondary">
                        <div className="custom-scrollbar p-0" style={inlineStyle}>
                          {this.props.inlineComponent}
                        </div>
                      </div>
                      <div className="col-xs-w3 text-center">
                        <nav className="text-center pt-2">
                          <button
                            type="button"
                            title="Fermer"
                            className={classnames('btn btn-left', 'btn-secondary')}
                            onClick={evt => {
                              evt.stopPropagation();
                              this.props.onClick(null);
                            }}
                          >
                            {this.props.closeIcon}
                          </button>
                          {this.props.inlineActions &&
                            this.props.inlineActions.map((action, i) => (
                              <div key={`action-${i}`}>
                                {(action.role === 'OTHER' || action.role === 'DETAIL') && (
                                  <ActionButton
                                    action={action}
                                    item={item}
                                    className={classnames(
                                      'btn btn-left',
                                      action.name === this.props.currentInline
                                        ? 'btn-primary'
                                        : action.theme
                                        ? `btn-${action.theme}`
                                        : 'btn-secondary'
                                    )}
                                  />
                                )}
                              </div>
                            ))}
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CSSTransition>
        )}
      </div>
    );
  }
}

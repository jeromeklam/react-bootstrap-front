import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { ActionButton, MobileLineCol, getCardTitle } from './';
import { HoverObserver } from '../advanced';
import { getObjectmemberValue, isMobileDevice } from '../helpers';
import { TouchHandler } from '../advanced';

const duration = 600;

const navstyle = {
  right: '-100%',
  padding: '0px',
  float: 'right',
  transition: `all ${duration}ms `,
};

const navStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-100%' },
  exited: { right: '-100%' },
};

export class MobileLine extends Component {
  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.element.isRequired,
    counter: PropTypes.number,
    currentFlipped: PropTypes.number,
    hideMenu: PropTypes.bool,
    id: PropTypes.string.isRequired,
    item: PropTypes.element.isRequired,
    mobile: PropTypes.bool,
    title: PropTypes.string.isRequired,
    selectable: PropTypes.bool,
    onSelect: PropTypes.func,
    forSelectOne: PropTypes.bool,
    setCurrentFlipped: PropTypes.func,
    selected: PropTypes.array,
  };

  static defaultProps = {
    className: '',
    counter: 0,
    currentFlipped: 0,
    hideMenu: false,
    mobile: true,
    selectable: true,
    onSelect: () => {},
    forSelectOne: false,
    setCurrentFlipped: () => {},
    selected: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  mouseLeave() {
    if (!isMobileDevice()) {
      this.props.setCurrentFlipped(0);
      this.setState({ flipped: false });
    }
  }

  mouseEnter() {
    if (!isMobileDevice()) {
      this.props.setCurrentFlipped(this.props.item.id);
      this.setState({ flipped: true });
    }
  }

  openMenu() {
    this.props.setCurrentFlipped(this.props.item.id);
    this.setState({ flipped: true });
  }

  closeMenu() {
    this.props.setCurrentFlipped(0);
    this.setState({ flipped: false });
  }

  handleDoubleClick(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    if (this.props.forSelectOne) {
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
    let rowOddEven = 'row-no-odd-even';
    if (this.props.counter) {
      rowOddEven = this.props.counter % 2 === 0 ? 'row-even' : 'row-odd';
    }
    const selectable =
      this.props.selectable && this.props.cols && this.props.cols.find(oneCol => oneCol.selectable === true);
    return (
      <div
        id={`rbf-list-mobile-line${this.props.item.id}`}
        className={classnames(
          'row rbf-list-mobile-line',
          rowOddEven,
          this.props.className,
          this.props.fClassName && this.props.fClassName(this.props.item)
        )}
      >
        <div className="col-xxs-w36">
          <div
            className="card card-mobile-line"
            onClick={ev => {
              if (this.props.forSelectOne) {
                this.props.onSelect(this.props.item);
              } else {
                if (isMobileDevice()) {
                  if (!this.props.mobile) {
                    this.closeMenu();
                    this.props.onClick(this.props.item);
                  } else {
                    if (this.props.item.id === this.props.currentFlipped) {
                      this.closeMenu();
                      this.handleDoubleClick(ev);
                    } else {
                      this.closeMenu();
                      this.props.onClick(this.props.item);
                    }
                  }
                } else {
                  this.props.onClick(this.props.item);
                }
              }
            }}
          >
            <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
              <TouchHandler
                className={classnames(
                  'card-header rbf-list-mobile-line-header',
                  this.props.inlineOpenedId === this.props.id && 'bg-selected',
                  this.props.item.id === this.props.currentFlipped ? 'text-white bg-primary-light' : 'text-secondary'
                )}
                swipRight={this.openMenu}
                swipLeft={this.closeMenu}
              >
                <div className="rbf-list-mobile-line-header-highlighter" />
                {selectable && (
                  <div className="rbf-list-mobile-line-header-select">
                    <div
                      className={classnames(
                        'select-line border border-secondary mr-2 white',
                        this.props.selected.find(elem => elem === this.props.id) && 'selected'
                      )}
                      onClick={ev => {
                        if (ev) {
                          ev.preventDefault();
                          ev.stopPropagation();
                        }
                        this.props.onSelect(this.props.id);
                      }}
                    >
                      <div className="select-line-inner bg-secondary" />
                    </div>
                  </div>
                )}
                <span className="rbf-list-mobile-line-header-title">
                  {getCardTitle(this.props.cols, this.props.item)}
                </span>
                {(this.props.mobile || isMobileDevice()) && (
                  <CSSTransition
                    in={this.state.flipped && this.props.item.id === this.props.currentFlipped}
                    timeout={duration}
                  >
                    {state => (
                      <div
                        style={{ ...navstyle, ...navStyles[state] }}
                        className="nav btn-group rbf-list-mobile-line-header-nav"
                      >
                        {this.props.inlineActions &&
                          this.props.inlineActions.map(action => {
                            if (action.role === 'DETAIL' || action.role === 'SUMMARY') {
                              return null;
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
                                  item={this.props.item}
                                  className={classnames('btn-inline', action.theme && `btn-${action.theme}`)}
                                />
                              );
                            }
                          })}
                        {false && !this.props.hideMenu && (
                          <button
                            key="openclose"
                            type="button"
                            disabled={false}
                            title=""
                            className={classnames('btn btn-inline btn-light')}
                            onClick={ev => {
                              if (ev) {
                                ev.preventDefault();
                                ev.stopPropagation();
                              }
                              this.setState({ flipped: !this.state.flipped });
                            }}
                          >
                            <span className="rbf-list-mobile-line-3dots text-secondary">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                role="img"
                                style={{ verticalAlign: '-0.125em' }}
                                width="1em"
                                height="1em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 1000 1000"
                              >
                                <path d="M654 501l346 346l-154 154l-346-346l-346 346L0 847l346-346L0 155L154 1l346 346L846 1l154 154z" />
                              </svg>
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </CSSTransition>
                )}
              </TouchHandler>
            </HoverObserver>
            <div className="card-body pl-2 pr-2 pt-0 pb-3">
              <TouchHandler onTap={e => this.handleDoubleClick(e)} onDoubleTap={e => this.handleDoubleClick(e)}>
                {this.props.cols.map((oneCol, i) => {
                  if (!oneCol.hidden && oneCol.card && oneCol.card.role && oneCol.card.role === 'FIELD') {
                    const content = getObjectmemberValue(this.props.item, oneCol.col);
                    if (oneCol.card.hideEmpty) {
                      if (!content) {
                        return null;
                      } else {
                        if (!content.id || content.id === '' || content.id === 0) {
                          return null;
                        }
                      }
                    }
                    const line = { ...oneCol, id: this.props.id };
                    const first = i === 0;
                    const last = i === this.props.cols.length - 1;
                    return (
                      <MobileLineCol
                        key={`col-${oneCol.col}`}
                        first={first}
                        last={last}
                        content={content}
                        item={this.props.item}
                        {...line}
                      />
                    );
                  }
                  return null;
                })}
              </TouchHandler>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

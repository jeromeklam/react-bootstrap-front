import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader, DefaultTitle, DefaultFooter, DefaultLine, MobileLine, DefaultRightHeader } from './';
import { getSizeFromWidth, isInViewPort } from '../helpers';
import { DefaultPanel } from '../filter';
import { WidthObserver, TouchHandler } from '../advanced';
import { ShortcutBar } from '../shortcut';
import { ActionButton } from './';

const duration = 600;

const fullDiv = {
  position: 'absolute',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
};

const defaultStyle = {
  position: 'fixed',
  right: '-400px',
  width: '400px',
  top: '60px',
  bottom: '0px',
  zIndex: '877',
  transition: `all ${duration}ms `,
  animationIterationCount: '1',
};

const listStyle = {
  top: '50px',
  height: 'calc(100% - 50px)',
  position: 'absolute',
  left: '0px',
  right: '0px',
  bottom: '0px',
  overflow: 'hidden',
  transition: `all ${duration}ms `,
};

const footerstyle = {
  marginLeft: '-5px',
  marginRight: '-5px',
  transition: `all ${duration}ms `,
};

const transitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-400px' },
  exited: { right: '-400px' },
};

const titleStyle = {
  height: '40px',
  lineHeight: '40px',
  fontWeight: 'bold',
  paddingTop: '0px',
  paddingBottom: '0px',
  left: '0px',
  position: 'absolute',
  right: '0px',
  top: '0px',
  zIndex: '700',
  overflow: 'hidden',
};

let listTransitionStyles = {
  entering: { left: '0px', position: 'absolute', right: '1200px' },
  entered: { left: '0px', position: 'absolute', right: '1200px' },
  exiting: { left: '0px', position: 'absolute', right: '0px' },
  exited: { left: '0px', position: 'absolute', right: '0px' },
};

const inlineStyle = {
  overflow: 'hidden',
  right: '-1200px',
  width: '1200px',
  bottom: '0px',
  position: 'absolute',
  top: '50px',
  zIndex: '700',
  transition: `all ${duration}ms `,
};

let inlineTransitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-1200px' },
  exited: { right: '-1200px' },
  form: { right: '0px', left: '0px', width: '100%' },
};

export default class DefaultList extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    currentInline: PropTypes.string,
    currentItem: PropTypes.object,
    items: PropTypes.element.isRequired,
    titleMultiline: PropTypes.bool,
    loadMorePending: PropTypes.bool.isRequired,
    onSetFiltersAndSort: PropTypes.func.isRequired,
    onUpdateShortcuts: PropTypes.func,
    inlineActions: PropTypes.element.isRequired,
    inlineOpenedId: PropTypes.number,
    inlineComponent: PropTypes.element,
    inlineOpenedItem: PropTypes.element,
    mode: PropTypes.string,
    closeIcon: PropTypes.element,
    oddEven: PropTypes.bool,
  };
  static defaultProps = {
    currentInline: '',
    currentItem: null,
    inlineOpenedId: 0,
    inlineComponent: null,
    inlineOpenedItem: null,
    onUpdateShortcuts: () => {},
    mode: 'inline',
    closeIcon: null,
    titleMultiline: false,
    oddEven: true,
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.inlineOpenedId !== state.inlineOpenedId ||
      props.currentItem !== state.currentItem ||
      props.mode !== state.mode
    ) {
      const contentSize = getSizeFromWidth(state.width);
      const splited = props.inlineOpenedId && parseInt(props.inlineOpenedId, 10) > 0;
      const listSize = splited ? getSizeFromWidth(state.width - 1200) : contentSize;
      const dataSize = splited ? getSizeFromWidth(1200) : 'none';
      return {
        splited: props.inlineComponent !== null,
        mode: props.mode,
        contentSize: contentSize,
        listSize: listSize,
        dataSize: dataSize,
        currentItem: props.currentItem,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      contentSize: 'lg',
      listSize: 'lg',
      dataSize: 'none',
      panelOpen: false,
      currentItem: props.currentItem,
      splited: props.inlineComponent !== null,
      mode: props.mode,
      currentFlipped: 0,
    };
    this.togglePanel = this.togglePanel.bind(this);
    this.handleObserver = this.handleObserver.bind(this);
    this.toggleSplit = this.toggleSplit.bind(this);
    this.setCurrentFlipped = this.setCurrentFlipped.bind(this);
  }

  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    this.observer = new IntersectionObserver(this.handleObserver, options);
    if (this.loadingRef) {
      this.observer.observe(this.loadingRef);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.mode === 'right' && this.state.currentItem && prevState.currentItem !== this.state.currentItem) {
      try {
        const el = document.getElementById(`rbf-list-mobile-line${this.state.currentItem.id}`);
        const b = isInViewPort(el);
        if (!b) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (ex) {}
    }
  }

  setCurrentFlipped(id) {
    this.setState({ currentFlipped: id });
  }

  toggleSplit() {
    this.setState({ splited: !this.state.splited });
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
  }

  togglePanel(filters = false, sort = false) {
    if (filters !== false && sort !== false) {
      this.props.onSetFiltersAndSort(filters, sort);
    }
    this.setState({ panelOpen: !this.state.panelOpen });
  }

  render() {
    let dispCols = this.props.cols;
    dispCols.forEach(col => {
      if (typeof col.size === 'object') {
        let min = 'none';
        if (col.size.xs) {
          min = col.size.xs;
        } else {
          if (col.size.sm) {
            min = col.size.sm;
          } else {
            if (col.size.md) {
              min = col.size.md;
            } else {
              if (col.size.lg) {
                min = col.size.lg;
              } else {
                if (col.size.xl) {
                  min = col.size.xl;
                }
              }
            }
          }
        }
        if (!col.size.xs) {
          col.size.xs = min;
        } else {
          min = col.size.xs;
        }
        if (!col.size.sm) {
          col.size.sm = min;
        } else {
          min = col.size.sm;
        }
        if (!col.size.md) {
          col.size.md = min;
        } else {
          min = col.size.md;
        }
        if (!col.size.lg) {
          col.size.lg = min;
        } else {
          min = col.size.lg;
        }
        if (!col.size.xl) {
          col.size.xl = min;
        }
      } else {
        col.size = { xxs: col.size, xs: col.size, sm: col.size, md: col.size, lg: col.size, xl: col.size };
      }
      if (col.card && !col.card.position) {
        col.card.position = 99;
      }
    });
    let mobileCols = dispCols.filter(col => col.card);
    dispCols = dispCols.filter(col => !col.hidden);
    mobileCols.sort((a, b) => {
      if ((a.card.position && b.card.position && a.card.position > b.card.position) || !a.card.position) {
        return 1;
      } else {
        return -1;
      }
    });
    let locTitleStyle = titleStyle;
    let locListStyle = listStyle;
    let counter = 1;
    return (
      <div style={fullDiv}>
        <WidthObserver>
          {({ mediaSize, width }) => {
            let calcW = parseInt(width, 10) - 350;
            listTransitionStyles.entering.right = calcW + 'px';
            listTransitionStyles.entered.right = calcW + 'px';
            inlineTransitionStyles.exiting.right = '-' + calcW + 'px';
            inlineTransitionStyles.exited.right = '-' + calcW + 'px';
            inlineStyle.width = calcW + 'px';
            inlineStyle.right = '-' + calcW + 'px';
            return (
              <div>
                <DefaultHeader {...this.props} onToggleFilter={this.togglePanel} />
                <CSSTransition in={this.state.panelOpen} timeout={duration}>
                  {state => (
                    <div
                      className="default-list-panel bg-white text-secondary border border-left-secondary"
                      style={{
                        ...defaultStyle,
                        ...transitionStyles[state],
                      }}
                    >
                      <DefaultPanel onToggleFilter={this.togglePanel} {...this.props} />
                    </div>
                  )}
                </CSSTransition>
                <div className={classnames('default-list', 'content-' + this.state.contentSize)}>
                  <CSSTransition in={this.state.splited} timeout={duration}>
                    {state => (
                      <div className="list-inset">
                        {this.state.mode !== 'form' && (
                          <div
                            className="default-list-list list-inset"
                            style={{
                              ...locListStyle,
                              ...listTransitionStyles[state],
                            }}
                          >
                            <WidthObserver>
                              {({ mediaSize }) => {
                                let lHeaderStyles = { height: '0px', display: 'none' };
                                let lListStyles = { top: '0px', height: '100%' };
                                if (mediaSize !== 'xxs' && mediaSize !== 'xs') {
                                  if (this.props.titleMultiline) {
                                    lHeaderStyles = { height: '72px', display: 'block' };
                                    lListStyles = { top: '72px', height: 'calc(100% - 72px)' };
                                    locTitleStyle = {
                                      ...titleStyle,
                                      height: '72px',
                                      lineHeight: '36px',
                                    };
                                  } else {
                                    lHeaderStyles = { height: '36px', display: 'block' };
                                    lListStyles = { top: '36px', height: 'calc(100% - 36px)' };
                                    locTitleStyle = {
                                      ...titleStyle,
                                      height: '36px',
                                      lineHeight: '36px',
                                    };
                                  }
                                }
                                return (
                                  <div className="list-inset">
                                    <div
                                      className="default-list-list-header overflow-hidden"
                                      style={{ ...lHeaderStyles }}
                                    >
                                      <DefaultTitle
                                        style={locTitleStyle}
                                        {...this.props}
                                        cols={dispCols}
                                        className={'list-' + this.state.listSize}
                                      />
                                    </div>
                                    {this.props.items.length > 0 ? (
                                      <div
                                        className="default-list-list-body custom-scrollbar overflowY"
                                        style={{ ...lListStyles }}
                                      >
                                        {this.props.items.map(item => (
                                          <div key={item.id}>
                                            {mediaSize === 'xxs' || mediaSize === 'xs' ? (
                                              <MobileLine
                                                {...this.props}
                                                id={item.id}
                                                item={item}
                                                hideMenu={true}
                                                mobile={false}
                                                cols={mobileCols}
                                                counter={this.props.oddEven ? counter++ : 0}
                                                currentFlipped={this.state.currentFlipped}
                                                setCurrentFlipped={this.setCurrentFlipped}
                                              />
                                            ) : (
                                              <DefaultLine
                                                {...this.props}
                                                id={item.id}
                                                item={item}
                                                cols={dispCols}
                                                counter={this.props.oddEven ? counter++ : 0}
                                              />
                                            )}
                                          </div>
                                        ))}
                                        <div ref={loadingRef => (this.loadingRef = loadingRef)} style={footerstyle}>
                                          <DefaultFooter {...this.props} />
                                        </div>
                                      </div>
                                    ) : (
                                      <DefaultFooter {...this.props} />
                                    )}
                                  </div>
                                );
                              }}
                            </WidthObserver>
                          </div>
                        )}
                        <div
                          className="default-list-right"
                          style={{
                            ...inlineStyle,
                            ...inlineTransitionStyles[state],
                          }}
                        >
                          <WidthObserver>
                            {(this.state.splited || this.state.mode === 'right') && (
                              <div className="rbf-list-default-list-right-wrapper">
                                <div className="rbf-list-default-list-right-header">
                                  <div className="no-gutters h-100">
                                    <div className="float-left">
                                      <DefaultRightHeader {...this.props} />
                                    </div>
                                    <div className="float-right">
                                      <div className="rbf-list-default-list-right-menu text-center h-100">
                                        {this.props.currentItem && this.props.rightMode === 'tabs' && (
                                          <div className="text-center btn-group mr-2">
                                            {this.props.inlineActions &&
                                              this.props.inlineActions
                                                .filter(action => action.role === 'DETAIL' || action.role === 'SUMMARY')
                                                .map((action, i) => {
                                                  return (
                                                    <ActionButton
                                                      key={`action-${i}`}
                                                      action={action}
                                                      item={this.props.currentItem}
                                                      className={classnames(
                                                        'btn',
                                                        action.name === this.props.currentInline
                                                          ? 'btn-primary'
                                                          : action.role === 'MODIFY' || action.role === 'DELETE'
                                                          ? `btn-${action.theme}`
                                                          : 'btn-light btn-outline-secondary-light text-secondary'
                                                      )}
                                                    />
                                                  );
                                                })}
                                          </div>
                                        )}
                                        {this.props.currentItem && this.props.rightMode === 'shortcuts' && (
                                          <div className="text-center btn-group mr-2 d-xxs-hidden">
                                            <ShortcutBar
                                              shortcuts={this.props.shortcuts}
                                              onToggle={this.props.onUpdateShortcuts}
                                            />
                                          </div>
                                        )}
                                        {this.props.onPrevious && this.props.onNext && this.props.currentItem && (
                                          <div className="text-center btn-group mr-2">
                                            <ActionButton
                                              key={`action-previous`}
                                              action={{
                                                label: 'previous',
                                                onClick: this.props.onPrevious,
                                                disabled: false,
                                                icon: this.props.previousIcon,
                                              }}
                                              item={this.props.currentItem}
                                              className="btn btn-light btn-outline-secondary-light text-secondary"
                                            />
                                            <ActionButton
                                              key={`action-next`}
                                              action={{
                                                label: 'next',
                                                onClick: this.props.onNext,
                                                disabled: false,
                                                icon: this.props.nextIcon,
                                              }}
                                              item={this.props.currentItem}
                                              className="btn btn-light btn-outline-secondary-light text-secondary"
                                            />
                                          </div>
                                        )}
                                        {this.props.currentItem && (
                                          <div className="text-center btn-group">
                                            {this.props.inlineActions &&
                                              this.props.inlineActions
                                                .filter(action => action.role !== 'SUMMARY')
                                                .map((action, i) => {
                                                  return (
                                                    <ActionButton
                                                      key={`action-${i}`}
                                                      action={action}
                                                      item={this.props.currentItem}
                                                      className={classnames(
                                                        'btn',
                                                        action.name === this.props.currentInline
                                                          ? 'btn-primary'
                                                          : `btn-${action.theme}`
                                                      )}
                                                    />
                                                  );
                                                })}
                                            <button
                                              type="button"
                                              title="close"
                                              className={classnames('btn', 'btn-secondary')}
                                              onClick={evt => {
                                                evt.stopPropagation();
                                                this.props.onClick(null);
                                              }}
                                            >
                                              {this.props.closeIcon}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="rbf-list-default-list-right-content custom-scrollbar p-0 text-secondary h-100">
                                  <TouchHandler
                                    className="h-100 w-100"
                                    swipRight={this.props.onNext}
                                    swipLeft={this.props.onPrevious}
                                  >
                                    <div className="row">
                                      <div className="col-xxs-w36">
                                        <div className="p-2">{this.props.inlineComponent}</div>
                                      </div>
                                    </div>
                                  </TouchHandler>
                                </div>
                              </div>
                            )}
                          </WidthObserver>
                        </div>
                      </div>
                    )}
                  </CSSTransition>
                </div>
              </div>
            );
          }}
        </WidthObserver>
      </div>
    );
  }
}

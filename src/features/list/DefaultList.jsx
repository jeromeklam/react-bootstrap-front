import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader, DefaultTitle, DefaultFooter, DefaultLine, MobileLine, LoadEmpty, DefaultRightHeader } from './';
import { getSizeFromWidth, isInViewPort, randomString, isDescendant } from '../helper';
import { DefaultPanel } from '../filter';
import { WidthObserver } from '../advanced';
import { ActionButton } from './';

const duration = 200;

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
  transition: `right ${duration}ms ease ${duration}ms`,
  animationIterationCount: '1',
};

const dataStyle = {
  top: '90px',
  height: 'calc(100% - 90px)',
  position: 'absolute',
  left: '0px',
  right: '0px',
  overflowY: 'scroll',
  overflowX: 'hidden',
  transition: `right ${duration}ms ease ${duration}ms`,
};

const footerstyle = {
  marginLeft: '-5px',
  marginRight: '-5px',
  transition: `right ${duration}ms ease ${duration}ms`,
};

const transitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-400px' },
  exited: { right: '-400px' },
};

const titleLineStyle = {
  left: '0px',
  position: 'absolute',
  right: '0px',
  top: '50px',
  zIndex: '700',
  transition: `right ${duration}ms ease ${duration}ms`,
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
  overflowY: 'scroll',
  overflowX: 'hidden',
  right: '0px',
  width: '1200px',
  bottom: '0px',
  position: 'absolute',
  top: '110px',
  zIndex: '700',
  transition: `right ${duration}ms ease ${duration}ms, top ${duration}ms ease ${duration}ms`,
};

let inlineTransitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-1200px' },
  exited: { right: '-1200px' },
};

const rightInlineButtonsStyle = {
  position: 'fixed',
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
    inlineActions: PropTypes.element.isRequired,
    inlineOpenedId: PropTypes.number,
    inlineComponent: PropTypes.element,
    inlineOpenedItem: PropTypes.element,
    mode: PropTypes.string,
    onSelect: PropTypes.func,
    closeIcon: PropTypes.element,
  };
  static defaultProps = {
    currentInline: '',
    currentItem: null,
    inlineOpenedId: 0,
    inlineComponent: null,
    inlineOpenedItem: null,
    mode: 'inline',
    closeIcon: null,
    onSelect: () => {},
    titleMultiline: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.inlineOpenedId !== state.inlineOpenedId || props.currentItem !== state.currentItem) {
      const contentSize = getSizeFromWidth(state.width);
      const splited = props.inlineOpenedId && parseInt(props.inlineOpenedId, 10) > 0;
      const listSize = splited ? getSizeFromWidth(state.width - 1200) : contentSize;
      const dataSize = splited ? getSizeFromWidth(1200) : 'none';
      return {
        splited: splited,
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
      id: randomString(32),
      currentItem: props.currentItem,
      splited: props.inlineOpenedId && parseInt(props.inlineOpenedId, 10) > 0,
    };
    this.togglePanel = this.togglePanel.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.downHandler = this.downHandler.bind(this);
    this.upHandler = this.upHandler.bind(this);
  }

  componentDidMount() {
    /*const elem = document.getElementById(this.state.id);
    if (elem) {
      document.addEventListener("keydown", this.downHandler);
      document.addEventListener("keyup", this.upHandler);
    }*/
  }

  componentWillUnmount() {
    /*const elem = document.getElementById(this.state.id);
    if (elem) {
      document.removeEventListener("keydown", this.downHandler);
      document.removeEventListener("keyup", this.upHandler);
    }*/
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

  downHandler(ev) {

  }

  upHandler(ev) {
    //console.log(isDescendant(ev.target, this.state.id));    
  }

  updateDimensions(width, height) {
    const contentSize = getSizeFromWidth(width);
    const listSize = this.state.splited ? getSizeFromWidth(width - 1200) : contentSize;
    const dataSize = this.state.splited ? getSizeFromWidth(1200) : 'none';
    this.setState({ contentSize: contentSize, listSize: listSize, dataSize: dataSize });
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
        col.size = { xs: col.size, sm: col.size, md: col.size, lg: col.size, xl: col.size };
      }
    });
    dispCols = dispCols.filter(col => !col.hidden);
    let locTitleStyle = titleStyle;
    let locDataStyle = dataStyle;
    if (this.props.titleMultiline) {
      locTitleStyle = {
        ...titleStyle,
        height: '80px',
        lineHeight: '40px',
      };
      locDataStyle = {
        ...dataStyle,
        top: '130px',
        height: 'calc(100% - 130px)',
      };
    }
    if (this.state.splited && this.props.mode === 'right') {
      locDataStyle = { ...locDataStyle, top: '50px', height: 'calc(100% - 50px)' };
    }

    return (
      <div style={fullDiv} id={this.state.id}>
        <WidthObserver>
          {({ mediaSize }) => {
            const globalSize = mediaSize;
            //console.log('size', globalSize);
            switch (globalSize) {
              case 'sm':
                listTransitionStyles.entering.right = '624px';
                listTransitionStyles.entered.right = '624px';
                inlineTransitionStyles.exiting.right = '-624px';
                inlineTransitionStyles.exited.right = '-624px';
                inlineStyle.width = '624px';
                break;
              case 'md':
                listTransitionStyles.entering.right = '800px';
                listTransitionStyles.entered.right = '800px';
                inlineTransitionStyles.exiting.right = '-800px';
                inlineTransitionStyles.exited.right = '-800px';
                inlineStyle.width = '800px';
                break;
              case 'lg':
                listTransitionStyles.entering.right = '1024px';
                listTransitionStyles.entered.right = '1024px';
                inlineTransitionStyles.exiting.right = '-1024px';
                inlineTransitionStyles.exited.right = '-1024px';
                inlineStyle.width = '1024px';
                break;
              case 'xl':
                listTransitionStyles.entering.right = '1280px';
                listTransitionStyles.entered.right = '1280px';
                inlineTransitionStyles.exiting.right = '-1280px';
                inlineTransitionStyles.exited.right = '-1280px';
                inlineStyle.width = '1280px';
                break;
              default:
                break;
            }
            return (
              <div>
                <DefaultHeader {...this.props} onToggleFilter={this.togglePanel} />
                <CSSTransition in={this.state.panelOpen} timeout={duration}>
                  {state => (
                    <div
                      className="default-list-panel bg-light text-secondary"
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
                      <div>
                        <div
                          style={
                            this.props.mode === 'right'
                              ? { ...titleLineStyle, ...listTransitionStyles[state] }
                              : { ...titleLineStyle }
                          }
                        >
                          <WidthObserver>
                            {({ mediaSize }) => {
                              if (mediaSize !== 'xs') {
                                return (
                                  <DefaultTitle
                                    style={locTitleStyle}
                                    {...this.props}
                                    cols={dispCols}
                                    className={'list-' + this.state.listSize}
                                  />
                                );
                              }
                              return null;
                            }}
                          </WidthObserver>
                        </div>
                        <div
                          className={classnames(
                            'custom-scrollbar',
                            'inline-' + this.state.dataSize,
                            'list-' + this.state.listSize
                          )}
                          style={
                            this.props.mode === 'right'
                              ? { ...locDataStyle, ...listTransitionStyles[state] }
                              : { ...locDataStyle }
                          }
                        >
                          <WidthObserver>
                            {({ mediaSize }) => (
                              <div className="default-list-body">
                                {this.props.items.length > 0 ? (
                                  <div>
                                    {this.props.items.map((item, idx) => {
                                      return (
                                        <div key={item.id}>
                                          {this.props.mode === 'right' && this.state.splited ? (
                                            <MobileLine {...this.props} id={item.id} item={item} hideMenu={true} />
                                          ) : (
                                            <DefaultLine
                                              {...this.props}
                                              id={item.id}
                                              item={item}
                                              cols={dispCols}
                                              counter={idx}
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div>{!this.props.loadMorePending && <LoadEmpty />}</div>
                                )}
                                <div style={footerstyle}>
                                  <DefaultFooter {...this.props} />
                                </div>
                              </div>
                            )}
                          </WidthObserver>
                        </div>
                        {this.props.mode === 'right' && (
                          <>
                            <div
                              className="rbf-list-default-list-right-top p-0 text-secondary"
                              style={{ ...inlineStyle, ...inlineTransitionStyles[state], top: '50px' }}
                            >
                              <DefaultRightHeader {...this.props} />
                            </div>
                            <div
                              className={classnames('custom-scrollbar', 'inline-' + this.state.dataSize)}
                              style={{ ...inlineStyle, ...inlineTransitionStyles[state] }}
                            >
                              <WidthObserver>
                                <div className="row">
                                  <div className="rbf-list-default-list-right-separator text-center" />
                                  <div className="rbf-list-default-list-right-content p-0 text-secondary h-100">
                                    <div className="row">
                                      <div className="col-xs-w36">
                                        <div className="custom-scrollbar p-0">{this.props.inlineComponent}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="rbf-list-default-list-right-menu text-center">
                                    <nav className="text-center pt-0" style={rightInlineButtonsStyle}>
                                      <button
                                        type="button"
                                        title="close"
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
                                                item={this.props.currentItem}
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
                              </WidthObserver>
                            </div>
                          </>
                        )}
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

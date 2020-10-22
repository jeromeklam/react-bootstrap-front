import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { DefaultHeader, DefaultTitle, DefaultFooter, DefaultLine, LoadEmpty } from './';
import { getSizeFromWidth } from '../helper';
import { DefaultPanel } from '../filter';

const duration = 500;

const fullDiv = {
  position: 'absolute',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
};

const defaultStyle = {
  position: 'absolute',
  right: '-400px',
  width: '400px',
  top: '0px',
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
  overflowY: 'auto',
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

const listTransitionStyles = {
  entering: { left: '0px', position: 'absolute', right: '1024px' },
  entered: { left: '0px', position: 'absolute', right: '1024px' },
  exiting: { left: '0px', position: 'absolute', right: '0px' },
  exited: { left: '0px', position: 'absolute', right: '0px' },
};

const inlineStyle = {
  overflowY: 'auto',
  overflowX: 'hidden',
  right: '0px',
  width: '1024px',
  bottom: '0px',
  position: 'absolute',
  top: '50px',
  zIndex: '700',
  transition: `right ${duration}ms ease ${duration}ms`,
};

const inlineTransitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: '-1024px' },
  exited: { right: '-1024px' },
};


export default class DefaultList extends Component {
  static propTypes = {
    cols: PropTypes.element.isRequired,
    items: PropTypes.element.isRequired,
    titleMultiline: PropTypes.bool,
    loadMorePending: PropTypes.bool.isRequired,
    onSetFiltersAndSort: PropTypes.func.isRequired,
    inlineActions: PropTypes.element.isRequired,
    inlineOpenedId: PropTypes.number,
    inlineComponent: PropTypes.element,
    inlineOpenedItem: PropTypes.element,
    mode: PropTypes.string,
    closeIcon: PropTypes.element,
  };
  static defaultProps = {
    inlineOpenedId: 0,
    inlineComponent: null,
    inlineOpenedItem: null,
    mode: 'inline',
    closeIcon: null,
  };
  static defaultProps = {
    titleMultiline: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.inlineOpenedId !== state.inlineOpenedId) {
      const contentSize = getSizeFromWidth(state.width);
      const splited = props.inlineOpenedId && parseInt(props.inlineOpenedId, 10) > 0;
      const listSize = splited ? getSizeFromWidth(state.width - 1024) : contentSize;
      const dataSize = splited ? getSizeFromWidth(1024) : 'none';
      return { splited: splited, contentSize: contentSize, listSize: listSize, dataSize: dataSize };
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
      splited: props.inlineOpenedId && parseInt(props.inlineOpenedId, 10) > 0,
    };
    this.togglePanel = this.togglePanel.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions(width, height) {
    const contentSize = getSizeFromWidth(width);
    const listSize = this.state.splited ? getSizeFromWidth(width - 1024) : contentSize;
    const dataSize = this.state.splited ? getSizeFromWidth(1024) : 'none';
    this.setState({ contentSize: contentSize, listSize: listSize, dataSize: dataSize });
  };

  togglePanel(filters = false, sort = false) {
    if (filters !== false && sort !== false) {
      this.props.onSetFiltersAndSort(filters, sort);
    }
    this.setState({ panelOpen: !this.state.panelOpen });
  }

  render() {
    const dispCols = this.props.cols.filter(col => !col.hidden);
    let locTitleStyle = titleStyle;
    let locDataStyle = dataStyle;
    if (this.props.titleMultiline) {
      locTitleStyle = {
        ...titleStyle,
        height:'80px',
        lineHeight: '40px',
      };
      locDataStyle = {
        ...dataStyle,
        top:'130px',
        height: 'calc(100% - 130px)',
      };
    }
    return (
      <div style={fullDiv}>
        <DefaultHeader {...this.props} onToggleFilter={this.togglePanel} />
          <CSSTransition in={this.state.panelOpen} timeout={duration}>
            {state => (
              <div
                className="default-list-panel bg-primary-light text-secondary"
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
                  <div style={this.props.mode === 'right' ? {...titleLineStyle, ...listTransitionStyles[state]} : {...titleLineStyle}}>
                    <DefaultTitle style={locTitleStyle} {...this.props} cols={dispCols} className={'list-' + this.state.listSize} cols={dispCols}/>
                  </div>
                  <div className={classnames('custom-scrollbar', 'inline-' + this.state.dataSize, 'list-' + this.state.listSize)} style={this.props.mode === 'right' ? {...locDataStyle, ...listTransitionStyles[state]} : {...locDataStyle}}>
                    <div className="default-list-body">
                      {this.props.items.length > 0 ? (
                        <div>
                          {this.props.items.map(item => (
                            <DefaultLine key={item.id} id={item.id} item={item} {...this.props} cols={dispCols} />
                          ))}
                        </div>
                      ) : (
                        <div>{!this.props.loadMorePending && <LoadEmpty />}</div>
                      )}
                      <div style={this.props.mode === 'right' ? {...footerstyle, ...listTransitionStyles[state]} : {...footerstyle}}>
                        <DefaultFooter {...this.props} />
                      </div>
                    </div>
                  </div>
                  {this.props.mode === 'right' &&
                    <div className={classnames('custom-scrollbar bg-secondary', 'inline-' + this.state.dataSize )} style={{...inlineStyle, ...inlineTransitionStyles[state]}}>
                      <div className="row">
                        <div className="col-1 text-center bg-secondary" />
                        <div className="col-32 bg-white p-0 text-secondary h-100">
                          <div className="custom-scrollbar p-0">
                            {this.props.inlineComponent}
                          </div>
                        </div>
                        <div className="col-3 text-center">
                          <nav className="text-center pt-2">
                            <button
                              type="button"
                              title="close"
                              className={classnames('btn btn-left', 'btn-secondary')}
                              onClick={(evt) => {
                                evt.stopPropagation();
                                this.props.onClick(null);
                              }}
                            >
                              {this.props.closeIcon}
                            </button>
                            {this.props.inlineActions &&
                              this.props.inlineActions.map((action, i) => (
                                <div key={`action-${i}`}>
                                  {action.role !== 'DELETE' && action.role !== 'MODIFY' && (
                                    <button
                                      type="button"
                                      title={action.label || ''}
                                      className={classnames('btn btn-left', action.active ? 'btn-primary' : 'btn-secondary')}
                                      onClick={(evt) => {
                                        evt.stopPropagation();
                                        if (action.param === 'object') {
                                          action.onClick(this.props.inlineOpenedItem);
                                        } else {
                                          action.onClick(this.props.inlineOpenedId);
                                        }
                                      }}
                                    >
                                      {action.icon}
                                    </button>
                                  )}
                                </div>
                              ))}
                          </nav>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              )}
            </CSSTransition>
          </div>
      </div>
    );
  }
}

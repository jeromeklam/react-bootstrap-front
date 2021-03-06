import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { TouchHandler } from '../advanced';
import { ResponsiveButton } from '../basic';
import { sizeGreater } from '../helpers';
import { Portal, WidthObserver } from './';
import { SmLoading9x9 } from '../spinner';

let zIndex = 1200;

const duration = 300;

const defaultStyle = {
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
  exiting: { opacity: 1, transition: `opacity ${duration}ms ease-in-out` },
  exited: { opacity: 0 },
};

const backStyle = {
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
};

const modalStyle = {
  display: 'block',
  position: 'fixed',
  left: '0px',
  right: '0px',
  top: '0px',
  bottom: '0px',
};

const closeStyle = {
  position: 'absolute',
  right: '20px',
  top: '5px',
  padding: '5px',
  fontSize: '2rem',
  fontWeight: '200',
};

const titleStyle = {
  position: 'absolute',
  right: '50px',
  top: '0px',
};

const inlineStyle = {
  maxHeight: '650px',
  padding: '10px',
};

export default class ResponsiveModalInner extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    buttons: PropTypes.element,
    size: PropTypes.string.isRequired,
    title: PropTypes.string,
    height: PropTypes.string,
    loader: PropTypes.bool,
    modalClassName: PropTypes.string,
    closeClassName: PropTypes.string,
    header: PropTypes.element,
    scroll: PropTypes.bool,
    zoom: PropTypes.number,
  };

  static defaultProps = {
    children: null,
    buttons: [],
    title: '',
    height: '',
    loader: false,
    modalClassName: 'bg-secondary text-light',
    closeClassName: 'text-light',
    header: null,
    scroll: true,
    zoom: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      opacity: '0',
      show: false,
    };
  }

  componentDidMount() {
    const list = document.getElementsByClassName('modal-opacity');
    if (list.length <= 1) {
      this.setState({ opacity: '0.8', show: true });
    } else {
      this.setState({ show: true });
    }
  }

  render() {
    const bStyles = { ...backStyle, opacity: this.state.opacity };
    let iStyles = { overflowX: 'hidden', overflowY: 'auto' };
    let scrollStyles = { ...inlineStyle };
    if (this.props.height && this.props.height !== '') {
      iStyles.height = this.props.height;
      iStyles.minHeight = this.props.height;
      inlineStyle.maxHeight = this.props.height;
    } else {
      switch (this.props.size) {
        case 'xl':
          iStyles.height = '510px';
          iStyles.minHeight = '510px';
          scrollStyles.maxHeight = '510px';
          break;
        case 'lg':
          iStyles.height = '480px';
          iStyles.minHeight = '480px';
          scrollStyles.maxHeight = '480px';
          break;
        case 'md':
          iStyles.height = '450px';
          iStyles.minHeight = '450px';
          scrollStyles.maxHeight = '450px';
          break;
        default:
          iStyles.height = '350px';
          iStyles.minHeight = '350px';
          scrollStyles.maxHeight = '350px';
          break;
      }
    }
    return (
      <Portal className="backdrop-style" zIndex={zIndex++}>
        <div className="modal-style modal-opacity bg-secondary-light" style={{ ...bStyles, zIndex: zIndex++ }} />
        <div style={{ ...modalStyle, zIndex: zIndex++ }}>
          <Transition in={this.state.show} timeout={100}>
            {state => (
              <WidthObserver zoom={this.props.zoom}>
                {({ mediaSize }) => (
                  <div
                    className={classnames('modal', state)}
                    style={{ ...defaultStyle, ...transitionStyles[state] }}
                  >
                    <div
                      className={classnames(
                        'modal-dialog',
                        sizeGreater(this.props.size, mediaSize) ? 'modal-fullscreen' : `modal-${this.props.size}`,
                        state
                      )}
                    >
                      <div className="modal-content modal-shadow">
                        <div
                          className={classnames('modal-header pb-2', this.props.modalClassName)}
                          style={{ display: 'initial', minHeight: '58px' }}
                        >
                          <div className="row">
                            <div className="col-xs-w36 p-0">
                              {this.props.tabs && this.props.tabs.length > 0 && (
                                <ul className="nav nav-tabs w-100">
                                  {this.props.tabs &&
                                    this.props.tabs.map(oneTab => (
                                      <li key={oneTab.key} data-id={oneTab.key} className="nav-item">
                                        <button
                                          className={classnames(
                                            'nav-link',
                                            `${this.props.tab}` === `${oneTab.key}` && 'active'
                                          )}
                                          onClick={ev => {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            this.props.onNavTab(oneTab.key);
                                          }}
                                        >
                                          <>
                                            {sizeGreater(mediaSize, 'xs') ? oneTab.label : oneTab.shortcut}
                                            {oneTab.removeable === true && (
                                              <span
                                                className="nav-link-inner-btn"
                                                onClick={ev => {
                                                  ev.preventDefault();
                                                  ev.stopPropagation();
                                                  this.props.onDelTab(oneTab.id);
                                                }}
                                              >
                                                {this.props.delIcon}
                                              </span>
                                            )}
                                          </>
                                        </button>
                                      </li>
                                    ))}
                                  {this.props.onAddTab && (
                                    <li key="add-tab" className="nav-item">
                                      <button
                                        className={classnames('nav-link')}
                                        onClick={ev => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          this.props.onAddTab();
                                        }}
                                      >
                                        <span>{this.props.addIcon}</span>
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              )}
                              <h5 className="modal-title" id="exampleModalLabel" style={titleStyle}>
                                {(sizeGreater(mediaSize, 'xs') ||
                                  !this.props.tabs ||
                                  (this.props.tabs && this.props.tabs.length <= 0)) &&
                                  this.props.title}
                              </h5>
                              {this.props.loader ? (
                                <div className="text-light modal-header-loader">
                                  <SmLoading9x9 />
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  style={closeStyle}
                                  className={classnames('close', this.props.closeClassName)}
                                  onClick={ev => {
                                    console.log('Close', ev);
                                    if (ev) {
                                      ev.stopPropagation();
                                    }
                                    this.props.onClose(ev);
                                  }}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              )}
                            </div>
                          </div>
                          {this.props.header && <div className="pull-left w-100 pt-3">{this.props.header}</div>}
                        </div>
                        <div
                          className={classnames('modal-body', this.props.scroll && 'custom-scrollbar')}
                          style={iStyles}
                        >
                          <TouchHandler swipRight={this.props.onNext} swipLeft={this.props.onPrevious}>
                            {this.props.children}
                          </TouchHandler>
                        </div>
                        {this.props.buttons && (
                          <div className={classnames('modal-footer', this.props.modalClassName)}>
                            {this.props.buttons.map((button, idx) => {
                              if (sizeGreater(mediaSize, 'xs') || button.name !== '') {
                                return <ResponsiveButton key={`btn-resp${idx}`} button={button} />;
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </WidthObserver>
            )}
          </Transition>
        </div>
      </Portal>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { MobileLine, MobileHeader, MobileFooter } from './';
import { DefaultPanel } from '../filter';
import { readToolbarOpen, writeToolbarOpen } from './toolbarStorage';

const duration = 300;

const datastyle = {
  top: '50px',
  height: 'calc(100% - 50px)',
  position: 'absolute',
  overflowY: 'auto',
  overflowX: 'hidden',
  left: '0px',
  right: '0px',
};

const defaultStyle = {
  position: 'fixed',
  right: 'calc(-100%)',
  width: 'calc(100%)',
  top: '60px',
  bottom: '80px',
  zIndex: '877',
  transition: `right ${duration}ms`,
  animationIterationCount: '1',
};

const transitionStyles = {
  entering: { right: '0px' },
  entered: { right: '0px' },
  exiting: { right: 'calc(-100%)' },
  exited: { right: 'calc(-100%)' },
};

export default class MobileList extends Component {
  static propTypes = {
    mainCol: PropTypes.string,
    toolbar: PropTypes.node,
    toolbarHeight: PropTypes.number,
    toolbarOpen: PropTypes.bool,
    toolbarDefaultOpen: PropTypes.bool,
    toolbarStorageKey: PropTypes.string,
    onToolbarToggle: PropTypes.func,
    items: PropTypes.element.isRequired,
    loadMorePending: PropTypes.bool.isRequired,
    onSetFiltersAndSort: PropTypes.func.isRequired,
  };
  static defaultProps = {
    mainCol: '',
    toolbar: null,
    toolbarHeight: 44,
    toolbarOpen: null,
    toolbarDefaultOpen: false,
    toolbarStorageKey: null,
    onToolbarToggle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      prevY: 0,
      panelOpen: false,
      currentFlipped: 0,
      toolbarOpen: readToolbarOpen(props.toolbarStorageKey, props.toolbarDefaultOpen),
    };
    this.togglePanel = this.togglePanel.bind(this);
    this.toggleToolbar = this.toggleToolbar.bind(this);
    this.setCurrentFlipped = this.setCurrentFlipped.bind(this);
    this.handleObserver = this.handleObserver.bind(this);
  }

  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
    this.observer = new IntersectionObserver(this.handleObserver.bind(this), options);
    if (this.loadingRef) {
      this.observer.observe(this.loadingRef);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.loadingRef) {
      this.observer.observe(this.loadingRef);
    }
  }

  setCurrentFlipped(id) {
    this.setState({ currentFlipped: id });
  }

  togglePanel(filters = false, sort = false) {
    if (filters !== false && sort !== false) {
      this.props.onSetFiltersAndSort(filters, sort);
    }
    this.setState({ panelOpen: !this.state.panelOpen });
  }

  isToolbarOpen() {
    return this.props.toolbarOpen !== null ? this.props.toolbarOpen : this.state.toolbarOpen;
  }

  toggleToolbar() {
    const open = !this.isToolbarOpen();
    if (this.props.toolbarOpen === null) {
      writeToolbarOpen(this.props.toolbarStorageKey, open);
      this.setState({ toolbarOpen: open });
    }
    if (this.props.onToolbarToggle) {
      this.props.onToolbarToggle(open);
    }
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (y < this.state.prevY) {
      this.props.onLoadMore();
    }
    this.setState({ prevY: y });
  }

  render() {
    let dispCols = this.props.cols;
    dispCols.forEach(col => {
      if (col.card && !col.card.position) {
        col.card.position = 99;
      }
    });
    //dispCols = dispCols.filter(col => !col.hidden);
    let mobileCols = dispCols.filter(col => col.card);
    mobileCols.sort((a, b) => {
      if ((a.card.position && b.card.position && a.card.position > b.card.position) || !a.card.position) {
        return 1;
      } else {
        return -1;
      }
    });
    let counter = 1;
    const toolbarOpen = !!(this.props.toolbar && this.isToolbarOpen());
    const headerHeight = 50 + (toolbarOpen ? this.props.toolbarHeight : 0);
    return (
      <div style={{ ...datastyle, top: `${headerHeight}px`, height: `calc(100% - ${headerHeight}px)` }}>
        <MobileHeader {...this.props} toolbarOpen={toolbarOpen} onToolbarToggle={this.toggleToolbar} onToggleFilter={this.togglePanel} />
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
        {this.props.items.length > 0 ? (
          <div className="">
            {this.props.items.map(item => {
              const title = item[this.props.mainCol];
              return (
                <MobileLine
                  {...this.props}
                  cols={mobileCols}
                  counter={this.props.oddEven ? counter++ : 0}
                  key={item.id}
                  id={item.id}
                  item={item}
                  title={title}
                  currentFlipped={this.state.currentFlipped}
                  setCurrentFlipped={this.setCurrentFlipped}
                />
              );
            })}
            <div ref={loadingRef => (this.loadingRef = loadingRef)}>
              <MobileFooter {...this.props} />
            </div>
          </div>
        ) : (
          <MobileFooter {...this.props} />
        )}
      </div>
    );
  }
}

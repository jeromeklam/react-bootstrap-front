import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TouchHandler extends Component {
  static propTypes = {
    className: PropTypes.string,
    onDoubleTap: PropTypes.func,
    onTap: PropTypes.func,
    swipLeft: PropTypes.func,
    swipRight: PropTypes.func,
  };
  static defaultProps = {
    classname: '',
    onDoubleTap: () => {},
    onTap: () => {},
    swipLeft: () => {},
    swipRight: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      startx: 0,
      endx: 0,
      starty: 0,
      endy: 0,
      ref: React.createRef(),
      timer: null,
      clickTimer: null,
    };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.handleTouchLeave = this.handleTouchLeave.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  componentDidMount() {
    if (this.state.ref) {
      let supportsPassive = false;
      try {
        let opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true;
          },
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) {}
      const passiveEvent = supportsPassive ? { capture: true, passive: true } : true;
      const el = this.state.ref.current;
      if (el) {
        el.addEventListener('touchstart', this.handleTouchStart, passiveEvent);
        el.addEventListener('touchend', this.handleTouchEnd, passiveEvent);
        el.addEventListener('touchcancel', this.handleTouchCancel, passiveEvent);
        el.addEventListener('touchleave', this.handleTouchLeave, passiveEvent);
        el.addEventListener('touchmove', this.handleTouchMove, passiveEvent);
      }
    }
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
  }

  handleTouchStart(e) {
    const self = this;
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
    if (e && e.targetTouches) {
      this.setState({
        startx: e.targetTouches[0].clientX,
        starty: e.targetTouches[0].clientY,
        endx: e.targetTouches[0].clientX,
        endy: e.targetTouches[0].clientY,
        timer: setTimeout(() => self.props.onTap(e), 700),
      });
    }
  }

  handleTouchMove(e) {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
    if (e && e.targetTouches) {
      this.setState({ endx: e.targetTouches[0].clientX, endy: e.targetTouches[0].clientY });
    } else {
      this.setState({ startx: 0, starty: 0, endx: 0, endy: 0 });
    }
  }

  handleTouchCancel(e) {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
    //console.log('Cancel', e);
  }

  handleTouchLeave(e) {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
    //console.log('Leave', e);
  }

  handleTouchEnd(e) {
    // Double Tap
    const self = this;
    if (this.state.clickTimer === null) {
      const clickTimer = setTimeout(function() {
        if (self.state.clickTimer) {
          clearTimeout(self.state.clickTimer);
        }
        self.setState({ clickTimer: null });
      }, 500);
      this.setState({ clickTimer: clickTimer });
    } else {
      clearTimeout(this.state.clickTimer);
      this.setState({ clickTimer: null });
      this.props.onDoubleTap(e);
    }
    // End
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
    const x = this.state.endx - this.state.startx;
    const y = this.state.endy - this.state.starty;
    if (x > 150) {
      if (this.props.swipLeft) {
        this.props.swipLeft();
      }
    } else {
      if (x < -150) {
        if (this.props.swipRight) {
          this.props.swipRight();
        }
      } else {
        if (y > 150) {
        } else {
          if (y < 150) {
          }
        }
      }
    }
    this.setState({ startx: 0, starty: 0, endx: 0, endy: 0 });
  }

  render() {
    return (
      <div className={this.props.className} ref={this.state.ref}>
        {this.props.children}
      </div>
    );
  }
}

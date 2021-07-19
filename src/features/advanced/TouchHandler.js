import React, { Component } from 'react';

export default class TouchHandler extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      startx: 0,
      endx: 0,
      starty: 0,
      endy: 0,
      ref: React.createRef(),
    };
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);
    this.handleTouchLeave = this.handleTouchLeave.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  componentDidMount() {
    if (this.state.ref) {
      const el = this.state.ref.current;
      if (el) {
        el.addEventListener('touchstart', this.handleTouchStart, false);
        el.addEventListener('touchend', this.handleTouchEnd, false);
        el.addEventListener('touchcancel', this.handleTouchCancel, false);
        el.addEventListener('touchleave', this.handleTouchLeave, false);
        el.addEventListener('touchmove', this.handleTouchMove, false);
      }
    }
  }

  handleTouchStart(e) {
    if (e && e.targetTouches) {
      this.setState({
        startx: e.targetTouches[0].clientX,
        starty: e.targetTouches[0].clientY,
        endx: e.targetTouches[0].clientX,
        endy: e.targetTouches[0].clientY,
      });
    }
  }

  handleTouchMove(e) {
    if (e && e.targetTouches) {
      this.setState({ endx: e.targetTouches[0].clientX, endy: e.targetTouches[0].clientY });
    } else {
      this.setState({ startx: 0, starty: 0, endx: 0, endy: 0 });
    }
  }

  handleTouchCancel(e) {
    console.log('Cancel', e);
  }

  handleTouchLeave(e) {
    console.log('Leave', e);
  }

  handleTouchEnd() {
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
    return <div ref={this.state.ref}>{this.props.children}</div>;
  }
}

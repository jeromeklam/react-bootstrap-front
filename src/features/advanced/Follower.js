import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '../advanced';
import { getRefCoords } from '../helper';

export default class Follower extends Component {
  static propTypes = {
    className: PropTypes.string,
    myRef: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
    onClose: PropTypes.func.isRequired,
    align: PropTypes.string,
    maxHeight: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    align: 'bottom',
    maxHeight: 'auto',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.myRef !== state.myRef) {
      return { myRef: props.myRef, coords: getRefCoords(props.myRef) };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      myRef: this.props.myRef,
      coords: getRefCoords(this.props.myRef),
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
    document.addEventListener('scroll', this.handleScroll, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('scroll', this.handleScroll, true);
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(event.target)) {
      this.props.onClose();
      if (this.props.myRef && this.props.myRef.current.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  handleScroll(event) {
    this.setState({ coords: getRefCoords(this.state.myRef) });
  }

  render() {
    let divStyle = {
      position: 'absolute',
      padding: '4px',
      maxHeight: this.props.maxHeight,
      overflow: 'hidden',
    };
    try {
      if (this.state.coords) {
        const { coords } = this.state;
        console.log(coords);
        switch (this.props.align) {
          case 'right':
            divStyle.left = coords.right + 10;
            divStyle.top = coords.top;
            break;
          case 'bottom':
          default:
            if (coords.left > coords.w / 2) {
              divStyle.right = -1 * coords.right;
            } else {
              divStyle.left = coords.left;
            }
            divStyle.top = coords.top + coords.height + 10;
            break;
        }
      }
    } catch (ex) {
      console.log(ex);
    }
    return (
      <div className={this.props.className} style={divStyle}>
        <div
          className="custom-scrollbar"
          style={{ maxHeight: this.props.maxHeight, overflowX: 'hidden', overflowY: 'auto' }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

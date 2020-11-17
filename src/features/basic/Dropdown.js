import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '../advanced';

const getCoords = (props) => {
  if (props.myRef && props.myRef.current) {
    try {
      return props.myRef.current.getBoundingClientRect();
    } catch (ex) {
      console.log("FK pas de coordonées",ex);
    }
  }
  return null;
}

export default class Dropdown extends Component {
  static propTypes = {
    align: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    maxHeight: PropTypes.string,
    myRef: PropTypes.element.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    align: 'bottom-left',
    className: '',
    maxHeight: 'auto',
    onClose: null
  };

  constructor(props) {
    super(props);
    this.state = {
      coords: getCoords(this.props),
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
      this.props.onClose && this.props.onClose();
      if (this.props.myRef && this.props.myRef.current.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  handleScroll(event) {
    this.setState({coords: getCoords(this.props)});
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
        switch (this.props.align) {
          case 'bottom-right':
            divStyle.right = -1 * (coords.left + coords.width);
            divStyle.top = coords.top + coords.height;
            break;
          default:
            divStyle.left = coords.left;
            divStyle.top = coords.top + coords.height;
            break;
        }
      }
    } catch (ex) { console.log(ex); }
    return (
      <Portal>
        <div className={this.props.className} style={divStyle}>
          <div className="custom-scrollbar" style={{ maxHeight: this.props.maxHeight, overflowX: 'hidden', overflowY: 'auto' }}>
            {this.props.children}
          </div>
        </div>
      </Portal>
    );
  }
}

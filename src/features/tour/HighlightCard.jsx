import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ToolTip from 'react-portal-tooltip';
import * as actions from './redux/actions';
import { Row, Col } from '../grid';

let globalRef = 1;

const tooltipStyle = {
  style: {
    background: 'rgba(245,245,245,.9)',
    boxShadow: '5px 5px 3px rgba(0,0,0,.5)',
    maxWidth: '400px',
  },
  arrowStyle: {
    color: 'rgba(0,0,0,.8)',
    borderColor: true,
  },
};

export class HighlightCard extends Component {
  static propTypes = {
    tour: PropTypes.element.isRequired,
    children: PropTypes.element,
    actions: PropTypes.element.isRequired,
    title: PropTypes.string,
    position: PropTypes.string,
    arrow: PropTypes.string,
    theme: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    title: '',
    position: 'bottom',
    arrow: 'center',
    theme: 'ALL',
  };

  constructor(props) {
    super(props);
    globalRef += 1;
    this.state = {
      myRef: globalRef,
      title: this.props.title,
      position: this.props.position,
      arrow: this.props.arrow,
      theme: this.props.theme,
    };
    this.stop = this.stop.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  componentDidMount() {
    if (this.state.title !== '') {
      this.props.actions.addHighlight({ ref: this.state.myRef, theme: this.state.theme });
    }
  }

  componentWillUnmount() {
    if (this.state.title !== '') {
      this.props.actions.removeHighlight({ ref: this.state.myRef });
    }
  }

  prev(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.actions.prevHighlight(this.props.tour.theme);
  }

  next(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.actions.nextHighlight(this.props.tour.theme);
  }

  stop(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.actions.stopHighlight();
  }

  render() {
    let footer = null;
    let content = null;
    let current = null;
    console.log(this.props);
    if (this.props.tour && this.props.tour.current) {
      current = this.props.tour.current;
      footer = (
        <div className="text-secondary">
          <Row className="mt-3">
            <Col size={10} textAlign="left">
              <button type="button" className="btn btn-sm btn-primary" onClick={this.prev}>
                <span>{'<<'}</span>
              </button>
            </Col>
            <Col size={16} textAlign="center">
              <button type="button" className="btn btn-sm btn-secondary" onClick={this.stop}>
                <span>Fermer</span>
              </button>
            </Col>
            <Col size={10} textAlign="right">
              <button type="button" className="btn btn-sm btn-primary" onClick={this.next}>
                <span>{'>>'}</span>
              </button>
            </Col>
          </Row>
        </div>
      );
      content = <h5 className="text-primary text-center">{this.state.title}</h5>;
    }
    return (
      <div>
        <div className="target" id={`highlight-${this.state.myRef}`}>
          {this.props.children}
        </div>
        <ToolTip
          parent={`#highlight-${this.state.myRef}`}
          position={this.state.position}
          arrow={this.state.arrow}
          active={this.state.myRef === current}
          group={`highlight-${this.state.myRef}`}
          tooltipTimeout={100}
          useHover={false}
          style={tooltipStyle}
        >
          {content}
          {footer}
        </ToolTip>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    tour: state.tour,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightCard);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import './HighlightToggler.css';

export class HighlightToggler extends Component {
  static propTypes = {
    tour: PropTypes.element.isRequired,
    actions: PropTypes.element.isRequired,
    theme: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    theme: 'ALL',
    className: 'nav-link',
  };

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      theme: props.theme,
    };
    this.onClick = this.onClick.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  onNext() {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
    }
    if (this.props.tour.current > 0) {
      this.props.actions.nextHighlight(this.state.theme);
      const t = setTimeout(this.onNext, 3000);
      this.setState({ timer: t });
    }
  }

  onClick(e) {
    if (e) {
      e.preventDefault();
    }
    const { current } = this.props.tour;
    if (current > 0) {
      if (this.state.timer) {
        clearTimeout(this.state.timer);
        this.setState({ timer: null });
      }
    } else {
      if (this.state.timer) {
        clearTimeout(this.state.timer);
      }
      const t = setTimeout(this.onNext, 3000);
      this.setState({ timer: t });
    }
    this.props.actions.toggleHighlight(this.state.theme);
  }

  render() {
    const classname = this.props.tour.highlights.length <= 0 ? 'disabled' : '';
    return (
      <a className={classnames('help-toggler', classname, this.props.className)} onClick={this.onClick} title="Aide">
        <span><b>?</b></span>
      </a>
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
  mapDispatchToProps,
)(HighlightToggler);

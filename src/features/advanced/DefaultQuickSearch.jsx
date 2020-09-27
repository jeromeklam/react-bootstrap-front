import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DefaultQuickSearch extends Component {
  static propTypes = {
    quickSearch: PropTypes.element.isRequired,
    onSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.element.isRequired,
  };

  static defaultProps = {
    label: '',
  };

  static getDerivedStateFromProps(props, state) {
    if (props.quickSearch !== state.current) {
      return { current: props.quickSearch, search: props.quickSearch };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      current: this.props.quickSearch,
      search: this.props.quickSearch,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    if (event) {
      event.preventDefault();
    }
    this.setState({ search: event.target.value });
  }

  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    this.props.onSubmit(this.state.search);
  }

  render() {
    return (
      <form className="input-quick_search" onSubmit={this.onSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            name={this.props.name}
            placeholder={this.props.label}
            value={this.state.search}
            onChange={this.onChange}
          />
          <div className="input-group-append">
            <button type="button" className="btn btn-outline-secondary bg-light" onClick={this.onSubmit}>
              {this.props.icon}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

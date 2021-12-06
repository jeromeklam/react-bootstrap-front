import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DefaultQuickSearch extends Component {
  static propTypes = {
    quickSearch: PropTypes.element.isRequired,
    onSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.element.isRequired,
    plus: PropTypes.element,
    reset: PropTypes.element,
  };

  static defaultProps = {
    label: '',
    plus: null,
    reset: null,
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

  onSubmit(event, mode) {
    if (event) {
      event.preventDefault();
    }
    this.props.onSubmit(this.state.search, mode);
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
            <button type="button" title="Recherche simple" className="btn btn-outline-secondary bg-light" onClick={(ev) => this.onSubmit(ev, "simple")}>
              {this.props.icon}
            </button>
            {this.props.plus &&
              <button type="button" title="Recherche mois stricte" className="btn btn-outline-secondary bg-light" onClick={(ev) => this.onSubmit(ev, "plus")}>
                {this.props.plus}
              </button>
            }
            {this.props.reset &&
              <button type="button" title="Initialiser la recherche" className="btn btn-outline-secondary bg-light text-warning" onClick={(ev) => this.onSubmit(ev, "reset")}>
                {this.props.reset}
              </button>
            }
          </div>
        </div>
      </form>
    );
  }
}

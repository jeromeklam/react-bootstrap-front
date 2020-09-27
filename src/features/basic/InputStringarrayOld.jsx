import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default class InputStringarray extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    labelTop: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    plusIcon: PropTypes.element.isRequired,
    minusIcon: PropTypes.element.isRequired,
  };

  static defaultProps = {
    value: '',
    labelTop: true,
  };

  constructor(props) {
    super(props);
    let items = [];
    try {
      items = JSON.parse(this.props.value) || [];
    } catch (ex) {
      items = [];
    }
    this.state = {
      items: items,
      newItem: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onMinus = this.onMinus.bind(this);
    this.onPlus = this.onPlus.bind(this);
  }

  onChange(event) {
    if (event) {
      event.preventDefault();
    }
    const { name } = event.target;
    const idx = name.replace('field-', '');
    if (idx === '@') {
      this.setState({ newItem: event.target.value });
    } else {
      let { items } = this.state;
      items[idx].label = event.target.value;
      this.setState({ items: items });
      this.props.onChange({
        target: {
          name: this.props.name,
          value: JSON.stringify(items),
        },
      });
    }
  }

  onMinus(idx) {
    let { items } = this.state;
    items.splice(idx, 1);
    this.setState({ items: items });
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(items),
      },
    });
  }

  onPlus(event) {
    if (event) {
      event.preventDefault();
    }
    let { items } = this.state;
    items.push({ value: this.state.newItem, label: this.state.newItem });
    this.setState({ items: items, newItem: '' });
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(items),
      },
    });
  }

  render() {
    const { items, newItem } = this.state;
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row')}>
        <label htmlFor={this.props.id} className={classnames(!this.props.labelTop && 'col-sm-6 col-form-label')}>
          {this.props.label}
        </label>
        <div className={classnames(!this.props.labelTop && 'col-sm-30')}>
          {items.length > 0 && (
            <div>
              {items.map((oneItem, idx) => {
                return (
                  <div className="row" key={idx}>
                    <div className="col-36 input-group">
                      <input
                        type="text"
                        name={'field-' + idx}
                        value={oneItem.label}
                        className="border-secondary form-control"
                        onChange={this.onChange}
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary bg-light"
                          onClick={() => {
                            this.onMinus(idx);
                          }}
                        >
                          {this.props.minusIcon}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="row">
            <div className="col-36 input-group">
              <input type="text" name={'field-@'} value={newItem} className="border-secondary form-control" onChange={this.onChange} />
              <div className="input-group-append">
                <button type="button" className="btn btn-outline-secondary bg-light" onClick={this.onPlus}>
                  {this.props.plusIcon}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

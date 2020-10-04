import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './InputCheckList.css';

const emptyItem = { label : '', done: false };
const emptyList = { title : "Checklist", items : []};

export default class InputCheckList extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    addIcon: PropTypes.element.isRequired,
    delIcon: PropTypes.element.isRequired,
    addLineIcon: PropTypes.element.isRequired,
    delLineIcon: PropTypes.element.isRequired,
    openLinesIcon: PropTypes.element.isRequired,
    closeLinesIcon: PropTypes.element.isRequired,
    checkedLineIcon: PropTypes.element.isRequired,
    uncheckedLineIcon: PropTypes.element.isRequired,
    checkedLine: PropTypes.string,
  };

  static defaultProps = {
    value: '',
    addIcon: null,
    delIcon: null,
    addLineIcon: null,
    delLineIcon: null,
    openLinesIcon: null,
    closeLinesIcon: null,
    checkedLineIcon: null,
    uncheckedLineIcon: null,
    checkedLine: '',
  };

  static getDerivedStateFromProps(props, state) {
    const list = JSON.parse(props.value) || emptyList;
    if (list.title !== state.title || list.items !== state.items) {
      return {title: list.title, items: list.items};
    }
    return null;
  }

  constructor(props) {
    super(props);
    let list = emptyList;
    try {
      list = JSON.parse(props.value) || emptyList;
    } catch (ex) {
      list = emptyList;
    }
    this.state = {
      title: list.title,
      items: list.items,
      open: true,
    };
    this.onToggle = this.onToggle.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeItemCheck = this.onChangeItemCheck.bind(this);
    this.onChangeItemLabel = this.onChangeItemLabel.bind(this);
    this.onAddLine = this.onAddLine.bind(this);
    this.onDelLine = this.onDelLine.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  onChangeTitle(event, idx) {
    let { title, items } = this.state;
    title = event.target.value;
    const list = {title: title, items: items};
    this.onChange(list);
  }

  onAddLine() {
    this.setState({ open: true });
    let { title, items } = this.state;
    items.push(emptyItem);
    const list = {title: title, items: items};
    this.onChange(list);
  }

  onChangeItemLabel(event, idx) {
    let { title, items } = this.state;
    items[idx].label = event.target.value;
    const list = {title: title, items: items};
    this.onChange(list);
  }

  onChangeItemCheck(event, idx) {
    let { title, items } = this.state;
    items[idx].done = !items[idx].done;
    const list = {title: title, items: items};
    this.onChange(list);
  }

  onDelLine(idx) {
    let { title, items } = this.state;
    items.splice(idx,1);
    const list = {title: title, items: items};
    this.onChange(list);
  }

  onChange(list) {
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(list),
      },
    });
  }

  render() {
    let multi = false;
    if (this.props.onDelete) {
      multi = true;
    }
    return (
      <div className="input-check-list">
        <div className='row'>
          <div className='col-34'>
            <div className="input-group">
              <input
                label=''
                type="text"
                className={classnames('border-secondary form-control')}
                name={this.state.title}
                value={this.state.title}
                onChange={this.onChangeTitle}
              />
              <div className="input-group-append">
                {multi && (
                  <button
                    className={classnames(`btn btn-input border-secondary bg-light`)}
                    onClick={this.onAddLine}>
                    {this.props.addLineIcon}
                  </button>
                )}
                {(this.state.items && this.state.items.length > 0) && (
                  <button
                    className={classnames(`btn btn-input border-secondary bg-light`)}
                    onClick={this.onToggle}>
                    {this.state.open === true ? (
                      this.props.closeLinesIcon
                    ) : (
                      this.props.openLinesIcon
                    )}
                  </button>
                )}
                {multi && (
                  <button
                    type="button"
                    className={classnames(`btn btn-input border-secondary bg-light`)}
                    onClick={this.props.onDelete}
                  >
                    {this.props.delIcon}
                  </button>
                )}
              </div>
            </div>
          </div>
          {!multi && (
            <div className="col-2">
              <button className="btn btn-primary" onClick={this.onAddLine}>
                {this.props.addIcon}
              </button>
            </div>
          )}
        </div>
        {this.state.open && (
          this.state.items.map((item, i) => (
            <div className='row' key={`item-${i}`}>
              <div className='col-32'>
                <div className="input-group">
                  <div className="input-group-prepend border border-secondary-light rounded-left">
                    <div className="input-group-text" onClick={(e) => {this.onChangeItemCheck(e, i)}}>
                      {item.done === true ? this.props.checkedLineIcon : this.props.uncheckedLineIcon}
                    </div>
                  </div>
                  <input
                    type="text"
                    className={classnames('border-secondary-light form-control', item.done && `${this.props.checkedLine}`)}
                    name={`label-${i}`}
                    value={item.label}
                    disabled={item.done}
                    onChange={(e) => {this.onChangeItemLabel(e, i)}}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className={classnames(`btn btn-input border-secondary-light bg-light`)}
                      onClick={() => {this.onDelLine(i)}}
                    >
                      {this.props.delLineIcon}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }
}

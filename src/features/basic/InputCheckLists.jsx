import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputCheckList } from './';

const emptyList = { title : "Checklist", items : []};

export default class InputCheckLists extends Component {
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

  constructor(props) {
    super(props);
    let lists = [];
    try {
      lists = JSON.parse(props.value) || [];
    } catch (ex) {
      lists = [];
    }
    this.state = {
      lists: lists,
    };
    this.onChange = this.onChange.bind(this);
    this.onAddNew = this.onAddNew.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChange(event, idx) {
    let { lists } = this.state;
    const list = event.target.value;
    lists[idx] = JSON.parse(list);
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(lists),
      },
    });
  }

  onAddNew() {
    let { lists } = this.state;
    lists.push(emptyList);
    this.setState({ lists: lists });
  }

  onDelete(idx) {
    let { lists } = this.state;
    lists.splice(idx,1);
    this.props.onChange({
      target: {
        name: this.props.name,
        value: JSON.stringify(lists),
      },
    });
  }

  render() {
    return (
      <div className="input-check-lists">
        {this.state.lists.map((list,i) => (
          <div className="input-check-list" key={`checklist-${i}`}>
            <InputCheckList key={`checklist-${i}`}
              name=""
              value={JSON.stringify(list)}
              onChange={(e) => {this.onChange(e, i)}}
              onDelete={() => {this.onDelete(i)}}
              error={this.props.error}
              addIcon={this.props.addIcon}
              delIcon={this.props.delIcon}
              addLineIcon={this.props.addLineIcon}
              delLineIcon={this.props.delLineIcon}
              openLinesIcon={this.props.openLinesIcon}
              closeLinesIcon={this.props.closeLinesIcon}
              checkedLineIcon={this.props.checkedLineIcon}
              uncheckedLineIcon={this.props.uncheckedLineIcon}
              checkedLine={this.props.checkedLine}
            />
          </div>
        ))}
        <div className="row add-check-list">
          <div className="col-34">
            <button
              className={classnames(`btn btn-input border-secondary text-primary btn-block`)}
              onClick={this.onAddNew}>
              Ajouter une liste
            </button>
          </div>
        </div>
      </div>
    );
  }
}

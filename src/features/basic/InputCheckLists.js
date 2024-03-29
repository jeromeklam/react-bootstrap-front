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
    delIcon: PropTypes.element.isRequired,
    addLineIcon: PropTypes.element.isRequired,
    delLineIcon: PropTypes.element.isRequired,
    openLinesIcon: PropTypes.element,
    closeLinesIcon: PropTypes.element,
    checkedLineIcon: PropTypes.element.isRequired,
    uncheckedLineIcon: PropTypes.element.isRequired,
    checkedLine: PropTypes.string,
    emptyCommentLineIcon: PropTypes.element,
    commentLineIcon: PropTypes.element,
    questionLineIcon: PropTypes.element,
    warningLineIcon: PropTypes.element,
  };

  static defaultProps = {
    value: '',
    checkedLine: '',
    openLinesIcon: null,
    closeLinesIcon: null,
    warningLineIcon: null,
    questionLineIcon: null,   
    commentLineIcon: null,
    emptyCommentLineIcon: null,
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
              delIcon={this.props.delIcon}
              addLineIcon={this.props.addLineIcon}
              delLineIcon={this.props.delLineIcon}
              openLinesIcon={this.props.openLinesIcon}
              closeLinesIcon={this.props.closeLinesIcon}
              checkedLineIcon={this.props.checkedLineIcon}
              uncheckedLineIcon={this.props.uncheckedLineIcon}
              emptyCommentLineIcon={this.props.emptyCommentLineIcon} 
              commentLineIcon={this.props.commentLineIcon} 
              questionLineIcon={this.props.questionLineIcon} 
              warningLineIcon={this.props.warningLineIcon} 
              checkedLine={this.props.checkedLine}
            />
          </div>
        ))}
        <div className="row add-check-list">
          <div className="col-xxs-w34">
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

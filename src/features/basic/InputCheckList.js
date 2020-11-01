import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const emptyItem = { label: '', done: false, comment: '', question: false, warning: false };
const emptyList = { title: 'Checklist', items: [] };

export default class InputCheckList extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    addIcon: PropTypes.element,
    delIcon: PropTypes.element,
    addLineIcon: PropTypes.element,
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
    addIcon: null,
    delIcon: null,
    addLineIcon: null,
    openLinesIcon: null,
    closeLinesIcon: null,
    warningLineIcon: null,
    questionLineIcon: null,   
    commentLineIcon: null,
    emptyCommentLineIcon: null,
  };

  static getDerivedStateFromProps(props, state) {
    const list = JSON.parse(props.value) || emptyList;
    if (list.title !== state.title || list.items !== state.items) {
      return { title: list.title, items: list.items };
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
    let itemsComment = [];
    for (let i = 0; i < list.items.length; i++) {
      itemsComment.push(false);
    }
    this.state = {
      title: list.title,
      items: list.items,
      open: true,
      comm: itemsComment,
    };
    this.onToggle = this.onToggle.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeItemCheck = this.onChangeItemCheck.bind(this);
    this.onChangeItemLabel = this.onChangeItemLabel.bind(this);
    this.onChangeItemQuestion = this.onChangeItemQuestion.bind(this);
    this.onChangeItemWarning = this.onChangeItemWarning.bind(this);
    this.onChangeItemComment = this.onChangeItemComment.bind(this);
    this.onOpenItemComment = this.onOpenItemComment.bind(this);
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
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onAddLine() {
    this.setState({ open: true });
    let { title, items, comm } = this.state;
    items.push(emptyItem);
    comm.push(false);
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onChangeItemLabel(event, idx) {
    let { title, items } = this.state;
    items[idx].label = event.target.value;
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onChangeItemCheck(idx) {
    let { title, items } = this.state;
    items[idx].done = !items[idx].done;
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onChangeItemQuestion(idx) {
    let { title, items } = this.state;
    items[idx].question = !items[idx].question;
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onChangeItemWarning(idx) {
    let { title, items } = this.state;
    items[idx].warning = !items[idx].warning;
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onChangeItemComment(event, idx) {
    let { title, items } = this.state;
    items[idx].comment = event.target.value;
    const list = { title: title, items: items };
    this.onChange(list);
  }

  onOpenItemComment(idx) {
    let commOpen = this.state.comm;
    commOpen[idx] = !commOpen[idx];
    this.setState({ comm: commOpen });
  }

  onDelLine(idx) {
    let { title, items, comm } = this.state;
    items.splice(idx, 1);
    comm.splice(idx, 1);
    const list = { title: title, items: items };
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
    console.log('FK comm', this.state.comm);
    return (
      <div className="input-check-list">
        <div className="row">
          <div className="col-xs-w34">
            <div className="input-group">
              <input
                label=""
                type="text"
                className={classnames('border-secondary form-control')}
                name={this.state.title}
                value={this.state.title}
                onChange={this.onChangeTitle}
              />
              <div className="input-group-append">
                {multi && (
                  <button className={classnames(`btn btn-input border-secondary bg-light`)} onClick={this.onAddLine}>
                    {this.props.addLineIcon}
                  </button>
                )}
                {this.state.items && this.state.items.length > 0 && (
                  <button className={classnames(`btn btn-input border-secondary bg-light`)} onClick={this.onToggle}>
                    {this.state.open === true ? this.props.closeLinesIcon : this.props.openLinesIcon}
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
            <div className="col-xs-w2">
              <button className="btn btn-primary" onClick={this.onAddLine}>
                {this.props.addIcon}
              </button>
            </div>
          )}
        </div>
        {this.state.open &&
          this.state.items.map((item, i) => (
            <div className="row" key={`item-${i}`}>
              <div className="col-xs-w32">
                <div className="input-group">
                  <div className="input-group-prepend border border-secondary-light rounded-left">
                    <div
                      className="input-group-text"
                      onClick={() => {
                        this.onChangeItemCheck(i);
                      }}
                    >
                      {item.done === true ? this.props.checkedLineIcon : this.props.uncheckedLineIcon}
                    </div>
                  </div>
                  <input
                    type="text"
                    className={classnames(
                      'border-secondary-light form-control',
                      item.done && `${this.props.checkedLine}`
                    )}
                    name={`label-${i}`}
                    value={item.label}
                    disabled={item.done}
                    onChange={e => {
                      this.onChangeItemLabel(e, i);
                    }}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className={classnames(
                        `btn btn-input border-secondary-light bg-light`,
                        item.warning ? 'text-warning' : 'text-inactif'
                      )}
                      onClick={() => {
                        this.onChangeItemWarning(i);
                      }}
                    >
                      {this.props.warningLineIcon}
                    </button>
                  </div>
                  <div className="input-group-append">
                    <button
                      type="button"
                      className={classnames(
                        `btn btn-input border-secondary-light bg-light`,
                        item.question ? 'text-secondary' : 'text-inactif'
                      )}
                      onClick={() => {
                        this.onChangeItemQuestion(i);
                      }}
                    >
                      {this.props.questionLineIcon}
                    </button>
                  </div>
                  <div className="input-group-append">
                    <button
                      type="button"
                      className={classnames(`btn btn-input border-secondary-light bg-light`)}
                      onClick={() => this.onOpenItemComment(i)}
                    >
                      {item.comment && item.comment !== ''
                        ? this.props.commentLineIcon
                        : this.props.emptyCommentLineIcon}
                    </button>
                  </div>
                  <div className="input-group-append">
                    <button
                      type="button"
                      className={classnames(`btn btn-input border-secondary-light bg-light`)}
                      onClick={() => {
                        this.onDelLine(i);
                      }}
                    >
                      {this.props.delLineIcon}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-xs-w4" />
              <div className="col-xs-w2" />
              {this.state.comm[i] && (
                <div className="col-xs-w30">
                  <div className="border border-secondary-light form-group">
                    <textarea
                      name="comment"
                      className="w-100 form-control custom-scrollbar"
                      value={item.comment}
                      onChange={e => {
                        this.onChangeItemComment(e, i);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
}

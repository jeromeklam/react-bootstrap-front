import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableLabel from './EditableLabel';
import { Dropdown } from '../basic';

class NewCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: React.createRef(),
      newLabel: '',
    };
    this.updateField = this.updateField.bind(this);
    this.projectSelect = this.projectSelect.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  updateField = (field, value) => {
    this.setState({ [field]: value });
    if (field === 'label') {
      this.props.onPrjSearch(value);
    }
  };

  projectSelect = (prj) => {
    this.setState({ project: prj, newLabel: prj.label });
  };

  handleAdd = () => {
    this.props.onAdd(this.state);
  };

  render() {
    const { onCancel, t, projects } = this.props;
    return (
      <div className="trello-new-card-form">
        <article className="trello-new-card-form-wrapper">
          <header className="trello-new-card-form-header">
            <span className="trello-new-card-form-title">
              <EditableLabel
                placeholder={t({ id: 'rbf.trello.card.form.title.placeholder', defaultMessage: 'placeholder.title' })}
                onChange={val => this.updateField('title', val)}
                autoFocus
              />
            </span>
            <span className="trello-new-card-form-right" ref={this.state.ref}>
              <EditableLabel
                newLabel={this.state.newLabel}
                placeholder={t({ id: 'rbf.trello.card.form.label.placeholder', defaultMessage: 'placeholder.label' })}
                onKeyUp={e => this.updateField('label', e.target.value)}
              />
            </span>
            {projects && projects.length > 0 && (
              <Dropdown
                className="border rounded border-secondary bg-white text-secondary"
                myRef={this.state.ref}
                maxHeight="250px"
              >
                {projects.map(prj => (
                  <a
                    href="/"
                    key={`trello-card-${prj.id}`}
                    className="dropdown-item"
                    onClick={e => {
                      if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                      this.projectSelect(prj);
                    }}
                  >
                    <span>{prj.label}</span>
                  </a>
                ))}
              </Dropdown>
            )}
          </header>
          <div className="rello-new-card-form-detail">
            <EditableLabel
              placeholder={t({
                id: 'rbf.trello.card.form.description.placeholder',
                defaultMessage: 'placeholder.description',
              })}
              onChange={val => this.updateField('description', val)}
            />
          </div>
        </article>
        <button
          className="btn btn-primary"
          title={t({ id: 'rbf.trello.card.form.add.help', defaultMessage: 'button.title.Add card' })}
          onClick={this.handleAdd}
        >
          {t({ id: 'rbf.trello.card.form.add', defaultMessage: 'button.Add card' })}
        </button>
        <button
          className="btn btn-secondary"
          title={t({ id: 'rbf.trello.card.form.cancel.help', defaultMessage: 'button.title.Cancel card' })}
          onClick={onCancel}
        >
          {t({ id: 'rbf.trello.card.form.cancel', defaultMessage: 'button.Cancel card' })}
        </button>
      </div>
    );
  }
}

NewCardForm.propTypes = {
  t: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onPrjSearch: PropTypes.func.isRequired,
  projects: PropTypes.array,
};

NewCardForm.defaultProps = {
  projects: [],
};

export default NewCardForm;

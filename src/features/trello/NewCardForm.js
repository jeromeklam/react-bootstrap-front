import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableLabel from './EditableLabel';

class NewCardForm extends Component {
  updateField = (field, value) => {
    this.setState({ [field]: value });
  };

  handleAdd = () => {
    this.props.onAdd(this.state);
  };

  render() {
    const { onCancel, t } = this.props;
    return (
      <div className="trello-new-card-form">
        <article className="trello-new-card-form-wrapper">
          <header className="trello-new-card-form-header">
            <span className="trello-new-card-form-title">
              <EditableLabel
                placeholder={t('placeholder.title')}
                onChange={val => this.updateField('title', val)}
                autoFocus
              />
            </span>
            <span className="trello-new-card-form-right">
              <EditableLabel placeholder={t('placeholder.label')} onChange={val => this.updateField('label', val)} />
            </span>
          </header>
          <div className="rello-new-card-form-detail">
            <EditableLabel
              placeholder={t('placeholder.description')}
              onChange={val => this.updateField('description', val)}
            />
          </div>
        </article>
        <button className="btn btn-primary" title={t('button.title.Add card')} onClick={this.handleAdd}>
          {t('button.Add card')}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          {t('button.Cancel')}
        </button>
      </div>
    );
  }
}

NewCardForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

NewCardForm.defaultProps = {};

export default NewCardForm;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewLaneTitleEditor from 'rt/NewLaneTitleEditor';

class NewLaneForm extends Component {
  handleSubmit = () => {
    this.props.onAdd({ title: this.getValue() });
  };

  getValue = () => this.refInput.getValue();

  onClickOutside = (a, b, c) => {
    if (this.getValue().length > 0) {
      this.handleSubmit();
    } else {
      this.props.onCancel();
    }
  };

  render() {
    const { onCancel, t } = this.props;
    return (
      <section className="trello-new-lane-form">
        <div className="trello-new-lane-title">
          <NewLaneTitleEditor
            ref={ref => (this.refInput = ref)}
            placeholder={t('placeholder.title')}
            onCancel={this.props.onCancel}
            onSave={this.handleSubmit}
            resize="vertical"
            border
            autoFocus
          />
        </div>
        <div className="trello-new-lane-buttons">
          <button className="btn btn-primary" title={t('button.title.Add lane')} onClick={this.handleSubmit}>
            {t('button.Add lane')}
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            {t('button.Cancel')}
          </button>
        </div>
      </section>
    );
  }
}

NewLaneForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

NewLaneForm.defaultProps = {};

export default NewLaneForm;

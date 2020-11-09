import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableLabel from './EditableLabel';

import { Dropdown } from '../basic';

class SearchCardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: React.createRef(),
    };
    this.updateField = this.updateField.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  updateField = (field, value) => {
    this.setState({ [field]: value });
    this.props.onSearch(value);
  };

  handleAdd = () => {
    this.props.onAdd({ ...this.state, new: true, existing: false });
  };

  handleSelect = elem => {
    this.props.onAdd({ ...elem, new: false, existing: true });
  };

  render() {
    const { onCancel, t, data } = this.props;
    return (
      <div className="trello-search-card-form">
        <article className="trello-search-card-form-wrapper">
          <div ref={this.state.ref}>
            <EditableLabel
              placeholder={t('placeholder.num')}
              onKeyUp={e => this.updateField('num', e.target.value)}
              autoFocus
            />
          </div>
          {data && data.length > 0 && (
            <Dropdown
              className="border rounded border-secondary bg-white text-secondary"
              myRef={this.state.ref}
              maxHeight="250px"
            >
              {data.map(elem => (
                <a
                  href="/"
                  key={`trello-card-${elem.id}`}
                  className="dropdown-item"
                  onClick={e => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    this.handleSelect(elem);
                  }}
                >
                  <span>{elem.label}</span>
                </a>
              ))}
            </Dropdown>
          )}
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

SearchCardForm.propTypes = {
  data: PropTypes.array,
  onSearch: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

SearchCardForm.defaultProps = {
  data: [],
};

export default SearchCardForm;

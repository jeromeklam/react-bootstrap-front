import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InputKeyword } from './';

const myStyle = {
  height: 'auto',
};

export default class InputKeywords extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    labelTop: PropTypes.bool,
    keywords: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    newKeyword: PropTypes.func,
    keywordIcon: PropTypes.element,
    keywordPlusIcon: PropTypes.element,
    keywordMinusIcon: PropTypes.element,
    keywordInactiveIcon: PropTypes.element,
  };
  static defaultProps = {
    id: null,
    label: '',
    value: '',
    keywords: [],
    required: false,
    labelTop: true,
    newKeyWord: null,
    keywordIcon: null,
    keywordPlusIcon: null,
    keywordMinusIcon: null,
    keywordInactiveIcon: null,
  };

  static getDerivedStateFromProps(props, state) {
    let newState = null;
    if (props.value !== state.value) {
      if (!newState) {
        newState = {};
      }
      const value = props.value || '';
      newState.value = value;
      if (value !== '') {
        newState.list = value.split(',');
      } else {
        newState.list = [];
      }
    }
    if (props.keywords !== state.keywords) {
      if (!newState) {
        newState = {};
      }
      newState.keywords = props.keywords;
    }
    return newState;
  }

  constructor(props) {
    super(props);
    let list = [];
    // Dans valeur, on a la liste des mots clefs séparés par ,
    // On en fait un tableau de chaines
    let myKeywords = props.value || '';
    if (myKeywords !== '') {
      list = myKeywords.split(',');
    }
    this.state = {
      value: props.value,
      list: list,
      keywords: this.props.keywords,
    };
    this.onAdd = this.onAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onAdd(keyw) {
    if (keyw !== '') {
      let { list } = this.state;
      list.push(keyw);
      this.props.onChange({
        target: {
          name: this.props.name,
          value: list.join(),
        },
      });

      let allKeyws = this.state.keywords;
      if (allKeyws.length > 0) {
        let idx = allKeyws.findIndex(item => item.keyw_code === keyw);
        if (idx === -1) {
          // création d'une nouveau mot clef
          this.props.newKeyword(keyw);
        }
      }
    }
  }

  onDelete(idx) {
    let { list } = this.state;
    list.splice(idx, 1);
    this.props.onChange({
      target: {
        name: this.props.name,
        value: list.join(),
      },
    });
  }

  render() {
    return (
      <div className={classnames('form-group', !this.props.labelTop && 'row')}>
        {this.props.label !== '' && (
          <label htmlFor={this.props.id} className={classnames(!this.props.labelTop && 'col-xxs-w6 col-form-label')}>
            {this.props.label}
            {this.props.required && <span>&nbsp;*</span>}
          </label>
        )}
        <div className={classnames(!this.props.labelTop && 'col-xxs-w30')}>
          <div className="input-group row" style={myStyle}>
            {this.state.list.map((keyw, i) => {
              if (keyw !== '') {
                return (
                  <InputKeyword
                    name={`keyword-${i}`}
                    value={keyw}
                    addNew={false}
                    onDelete={() => {
                      this.onDelete(i);
                    }}
                    keywordIcon={this.props.keywordIcon}
                    keywordPlusIcon={this.props.keywordPlusIcon}
                    keywordMinusIcon={this.props.keywordMinusIcon}
                    keywordInactiveIcon={this.props.keywordInactiveIcon}
                  />
                );
              }
              return null;
            })}
            <InputKeyword
              value=""
              name={'keyword-empty'}
              addNew={true}
              myKeywords={this.state.list}
              allKeywords={this.state.keywords}
              onAdd={keyw => {
                this.onAdd(keyw);
              }}
              keywordIcon={this.props.keywordIcon}
              keywordPlusIcon={this.props.keywordPlusIcon}
              keywordMinusIcon={this.props.keywordMinusIcon}
              keywordInactiveIcon={this.props.keywordInactiveIcon}
            />
          </div>
        </div>
      </div>
    );
  }
}

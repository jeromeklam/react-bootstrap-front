import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Col } from '../grid';
import { Dropdown } from './';

export default class InputKeyword extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    addNew: PropTypes.bool,
    allKeywords: PropTypes.array,
    myKeywords: PropTypes.array,
    keywordIcon: PropTypes.element,
    keywordPlusIcon: PropTypes.element,
    keywordMinusIcon: PropTypes.element,
    keywordInactiveIcon: PropTypes.element,
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: '',
    addNew: true,
    allKeywords: [],
    myKeywords: [],
    keywordIcon: null,
    keywordPlusIcon: null,
    keywordMinusIcon: null,
    keywordInactiveIcon: null,
  };

  static getDerivedStateFromProps(props, state) {
    let newState = null;
    if (props.value !== state.valOrig) {
      if (!newState) {
        newState = {};
      }
      const value = props.value || '';
      newState.value = value;
      newState.valOrig = value;
    }
    return newState;
  }

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef(),
      id: `id-${props.name}`,
      value: props.value,
      valOrig: props.value,
      listDD: [],
      select: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onChange(event) {
    if (this.props.addNew) {
      const search = '' + event.target.value;
      let listDD = [];
      let allKeyws = this.props.allKeywords;
      let myKeyws = this.props.myKeywords;
      if (allKeyws.length > 0) {
        allKeyws.forEach(keyword => {
          let push = true;
          let keyw = keyword.keyw_code;
          if (myKeyws && myKeyws.length > 0) {
            let idx = myKeyws.findIndex(kw => kw === keyw);
            if (idx !== -1) {
              push = false;
            }
          }
          if (push) {
            if (search !== '') {
              if (keyw.includes(search)) {
                listDD.push(keyw);
              }
            } else {
              listDD.push(keyw);
            }
          }
        });
      }
      this.setState({ value: search, listDD: listDD, select: false });
    }
  }

  onSelect(item) {
    this.setState({ listDD: [] });
    if (item) {
      this.setState({ value: item, select: true });
    }
  }

  render() {
    let open = this.state.listDD && this.state.listDD.length > 0;
    return (
      <Col size={{ xxs: 18, xs: 18, md: 6, lg: 6 }} className="input-keyword">
        <div className="input-group" ref={this.state.myRef}>
          <input
            label=""
            type="text"
            className={classnames('border-secondary form-control', this.props.addNew ? '' : 'bg-light')}
            name={this.props.name}
            value={this.state.value}
            onChange={this.onChange}
            onClick={this.onChange}
            autoComplete="off"
          />
          <input type="hidden" name="autocomplete-field-@" value={this.props.value || ''} />
          <div className="input-group-append">
            {this.props.addNew ? (
              <button
                type="button"
                className={classnames(`btn btn-input border-secondary bg-light`)}
                onClick={() => {
                  this.props.onAdd(this.state.value);
                  this.setState({ value: '', listDD: [] });
                }}
              >
                {this.state.value === '' ? (
                  this.props.keywordInactiveIcon
                ) : this.state.select ? (
                  this.props.keywordIcon
                ) : (
                  this.props.keywordPlusIcon
                )}
              </button>
            ) : (
              <button
                type="button"
                className={classnames(`btn btn-input border-secondary bg-light`)}
                onClick={this.props.onDelete}
              >
                {this.props.keywordMinusIcon}
              </button>
            )}
          </div>
          {open && (
            <Dropdown
              className="border rounded border-secondary bg-white text-secondary"
              myRef={this.state.myRef}
              onClose={this.onSelect}
              maxHeight="250px"
            >
              {this.state.listDD.map((keyw, i) => (
                <a
                  key={`keyword-${i}`}
                  className="dropdown-item"
                  onClick={() => {
                    this.onSelect(keyw);
                  }}
                >
                  <span className="mr-2 text-nowrap">{keyw}</span>
                </a>
              ))}
            </Dropdown>
          )}
        </div>
      </Col>
    );
  }
}

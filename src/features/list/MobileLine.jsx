import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { ActionButton, MobileLineCol, getCardTitle } from './';

import { HoverObserver } from '../advanced';
import { getObjectmemberValue } from '../helper';
import { Row } from '../grid';

const navstyle = {
  right: '5px',
  padding: '0px',
  float: 'right',
};

export class MobileLine extends Component {
  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.element.isRequired,
    hideMenu: PropTypes.bool,
    id: PropTypes.string.isRequired,
    item: PropTypes.element.isRequired,
    mobile: PropTypes.bool,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
    hideMenu: false,
    mobile: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  mouseLeave() {
    this.setState({ flipped: false });
  }

  mouseEnter() {
    this.setState({ flipped: true });
  }

  handleDoubleClick(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    this.props.inlineActions.forEach(action => {
      if (action.role === 'MODIFY') {
        action.onClick(this.props.id);
      }
    });
    return false;
  }

  render() {
    const selectable = this.props.cols && this.props.cols.find(oneCol => oneCol.selectable === true);
    return (
      <div
        id={`rbf-list-mobile-line${this.props.item.id}`}
        className={classnames('row rbf-list-mobile-line', this.props.className)}
      >
        <div className="col-xs-w36">
          <div
            className={classnames(
              'card shadow-sm m-2',
              this.props.fClassName && this.props.fClassName(this.props.item)
            )}
            onClick={ev => {
              if (this.props.mobile) {
                this.handleDoubleClick(ev);
              } else {
                this.props.onClick(this.props.item);
              }
            }}
          >
            <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
              <div
                className={classnames(
                  'card-header rbf-list-mobile-line-header',
                  this.props.inlineOpenedId === this.props.id ? 'text-secondary bg-primary-light' : 'text-secondary'
                )}
              >
                {selectable && (
                  <div className="rbf-list-mobile-line-header-select">
                    <div
                      className={classnames(
                        'select-line border border-secondary mr-2 bg-light',
                        this.props.selected.find(elem => elem === this.props.id) && 'selected'
                      )}
                      onClick={ev => {
                        if (ev) {
                          ev.preventDefault();
                          ev.stopPropagation();
                        }
                        this.props.onSelect(this.props.id);
                      }}
                    >
                      <div className="select-line-inner bg-secondary" />
                    </div>
                  </div>
                )}
                <span className="rbf-list-mobile-line-header-title">
                  {getCardTitle(this.props.cols, this.props.item)}
                </span>

                {this.state.flipped || this.props.inlineOpenedId === this.props.id ? (
                  <ul style={navstyle} className="nav nav-pills rbf-list-mobile-line-header-nav">
                    {this.props.inlineActions &&
                      this.props.inlineActions.map(action => (
                        <li className="nav-item" key={action.name}>
                          <ActionButton
                            action={action}
                            item={this.props.item}
                            className={classnames('btn-inline', action.theme && `btn-${action.theme}`)}
                          />
                        </li>
                      ))}
                    {!this.props.hideMenu && (
                      <li className="nav-item" key="openclose">
                        <button
                          type="button"
                          disabled={false}
                          title=""
                          className={classnames('btn btn-inline')}
                          onClick={ev => {
                            if (ev) {
                              ev.preventDefault();
                              ev.stopPropagation();
                            }
                            this.setState({ flipped: !this.state.flipped });
                          }}
                        >
                          <span className="rbf-list-mobile-line-3dots">...</span>
                        </button>
                      </li>
                    )}
                  </ul>
                ) : (
                  !this.props.hideMenu && (
                    <ul style={navstyle} className="nav nav-pills rbf-list-mobile-line-header-nav">
                      <li className="nav-item" key="openclose">
                        <button
                          type="button"
                          disabled={false}
                          title=""
                          className={classnames('btn btn-inline')}
                          onClick={ev => {
                            if (ev) {
                              ev.preventDefault();
                              ev.stopPropagation();
                            }
                            this.setState({ flipped: !this.state.flipped });
                          }}
                        >
                          <span className="rbf-list-mobile-line-3dots">...</span>
                        </button>
                      </li>
                    </ul>
                  )
                )}
              </div>
            </HoverObserver>
            <div className="card-body p-2">
              <Row>
                {this.props.cols.map((oneCol, i) => {
                  if (!oneCol.hidden && oneCol.card && oneCol.card.role && oneCol.card.role === 'FIELD') {
                    const line = { ...oneCol, id: this.props.id };
                    const content = getObjectmemberValue(this.props.item, oneCol.col);
                    const first = i === 0;
                    const last = i === this.props.cols.length - 1;
                    return (
                      <MobileLineCol
                        key={`col-${oneCol.col}`}
                        first={first}
                        last={last}
                        content={content}
                        item={this.props.item}
                        {...line}
                      />
                    );
                  }
                  return null;
                })}
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

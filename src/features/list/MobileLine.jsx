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
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
    hideMenu: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: !props.hideMenu || false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
  }
  mouseLeave() {
    this.setState({ flipped: false });
  }

  mouseEnter() {
    this.setState({ flipped: true });
  }

  render() {
    return (
      <div
        id={`rbf-list-mobile-line${this.props.item.id}`}
        className={classnames('row rbf-list-mobile-line', this.props.className)}
      >
        <div className="col-xs-w36">
          <div
            className="card bg-secondary-light m-2"
            onClick={() => {
              this.props.onClick(this.props.item);
            }}
          >
            <HoverObserver onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
              <div
                className={classnames(
                  'card-header rbf-list-mobile-line-header',
                  this.props.inlineOpenedId === this.props.id ? 'text-white bg-secondary' : 'text-secondary bg-white'
                )}
              >
                <span className="rbf-list-mobile-line-header-title">{getCardTitle(this.props.cols, this.props.item)}</span>

                {(this.state.flipped || this.props.inlineOpenedId === this.props.id) && (
                  <ul style={navstyle} className="nav nav-pills justify-content-end">
                    {this.props.inlineActions &&
                      this.props.inlineActions.map(action => (
                        <li className="nav-item" key={action.name}>
                          <ActionButton action={action} item={this.props.item} className={classnames('btn-inline',action.theme && `btn-${action.theme}`)}/>
                        </li>
                      ))}
                  </ul>
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

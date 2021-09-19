import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getObjectmemberValue } from '../helpers';
import { HoverObserver, ResponsiveConfirm } from '../advanced';
import { DefaultCol } from '../list';

const mystyle = {
  minHeight: '30px',
  lineHeight: '30px',
  verticalAlign: 'middle',
};

export default class DefaultLine extends Component {
  static propTypes = {
    inlineActions: PropTypes.array,
    counter: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    item: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    onGetOne: PropTypes.func,
    onDelOne: PropTypes.func,
  };
  static defaultProps = {
    inlineActions: [],
    counter: 0,
    onSelect: null,
    onGetOne: null,
    onDelOne: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
      confirm: false,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onConfirmClose = this.onConfirmClose.bind(this);
    this.onValidConfirm = this.onValidConfirm.bind(this);
  }

  mouseLeave() {
    this.setState({ flipped: false });
  }

  mouseEnter(id) {
    this.setState({ flipped: id });
  }

  handleDoubleClick(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    if (this.props.onSelect) {
      this.props.onSelect(this.props.item);
    } else {
      this.props.onGetOne && this.props.onGetOne(this.props.id);
    }
    return false;
  }

  onConfirm(id) {
    this.setState({ confirm: true });
    this.props.onConfirm(id);
  }

  onConfirmClose() {
    this.setState({ confirm: false });
  }

  onValidConfirm() {
    this.setState({ confirm: false });
    this.props.onDelOne();
  }

  render() {
    let rowOddEven = '';
    if (this.props.counter) {
      rowOddEven = this.props.counter % 2 === 0 ? 'row-even' : 'row-odd';
    }
    return (
      <div className="inline-list-default-line">
        <HoverObserver
          onMouseEnter={() => {
            this.mouseEnter(this.props.id);
          }}
          onMouseLeave={this.mouseLeave}
        >
          <div
            onDoubleClick={this.handleDoubleClick}
            style={mystyle}
            className={classnames(
              'inline-default-list-wrapper row row-line no-gutters',
              this.props.fClassName && this.props.fClassName(this.props.item),
              this.state.flipped && 'row-line-hover',
              rowOddEven
            )}
          >
            <div className="col-highlighter" />
            {this.props.cols.map((oneCol, i) => {
              if (!oneCol.hidden) {
                const line = { ...oneCol, id: this.props.id };
                const content = getObjectmemberValue(this.props.item, oneCol.col);
                return <DefaultCol {...line} content={content} item={this.props.item} selectable={false} />;
              }
              return null;
            })}
            {this.state.flipped && this.state.flipped === this.props.id && (
              <div className="btn-group btn-group-xs" role="group" aria-label="...">
                {Array.isArray(this.props.inlineActions) &&
                  this.props.inlineActions.map((action, i) => {
                    if (action.hidden) {
                      return null;
                    }
                    if (action.component) {
                      const clonedElementWithMoreProps = React.cloneElement(action.component, {
                        item: this.props.item,
                      });
                      return clonedElementWithMoreProps;
                    } else {
                      return (
                        <button
                          key={`action-${i}`}
                          type="button"
                          className={classnames('btn btn-inline btn-secondary', 'btn-' + action.theme || 'secondary')}
                          onClick={() => {
                            action.onClick(this.props.item);
                          }}
                        >
                          {action.icon}
                        </button>
                      );
                    }
                  })}
                {this.props.onGetOne && (
                  <button
                    type="button"
                    className="btn btn-inline btn-secondary"
                    onClick={() => {
                      this.props.onGetOne(this.props.id);
                    }}
                  >
                    {this.props.getIcon}
                  </button>
                )}
                {this.props.onDelOne && (
                  <button
                    type="button"
                    className="btn btn-inline btn-warning"
                    onClick={() => this.onConfirm(this.props.id)}
                  >
                    {this.props.delIcon}
                  </button>
                )}
              </div>
            )}
          </div>
        </HoverObserver>
        <ResponsiveConfirm show={this.state.confirm} onClose={this.onConfirmClose} onConfirm={this.onValidConfirm} />
      </div>
    );
  }
}

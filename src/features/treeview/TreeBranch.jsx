import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { HoverObserver, ResponsiveConfirm } from '../advanced';
import { LoadingTreeBranch, TreeNode } from './';

const itemStyle = {
  border: '0px',
  borderRadius: '0',
};

const sidebarArrow = {
  border: 'solid',
  borderWidth: '0 3px 3px 0',
  padding: '3px',
  position: 'absolute',
  transform: 'rotate(-45deg)',
  top: '18px',
};

const sidebarArrowDown = {
  border: 'solid',
  borderWidth: '0 3px 3px 0',
  padding: '3px',
  position: 'absolute',
  transform: 'rotate(45deg)',
  top: '18px',
};

const labelStyle = {
  display: 'inline-block',
  paddingLeft: '15px',
};

export default class TreeBranch extends Component {
  static propTypes = {
    tree: PropTypes.element.isRequired,
    node: PropTypes.element.isRequired,
    onSelect: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    paddingLeft: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: -1,
      confirm: null,
    };
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onConfirmClose = this.onConfirmClose.bind(this);
    this.onConfirmDel = this.onConfirmDel.bind(this);
  }

  onConfirm(node) {
    this.setState({ confirm: node });
  }

  onConfirmClose() {
    this.setState({ confirm: null });
  }

  onConfirmDel() {
    const { confirm } = this.state;
    this.setState({ confirm: null });
    this.props.onTreeDelOne(confirm);
  }

  mouseLeave() {
    this.setState({ hover: -1 });
  }

  mouseEnter(id) {
    this.setState({ hover: id });
  }

  render() {
    const { node } = this.props;
    return (
      <div>
        <HoverObserver
          onMouseEnter={() => {
            this.mouseEnter(node.id);
          }}
          onMouseLeave={() => {
            this.mouseLeave(node.id);
          }}
        >
          <li
            className={classnames(
              'list-group-item',
              (this.props.tree.getSelected() === node.id || this.state.hover === node.id) && 'bg-primary-light',
              this.props.tree.getSelected() === node.id && 'font-weight-bold'
            )}
            style={{ ...itemStyle, paddingLeft: `${this.props.paddingLeft}px` }}
            key={node.id}
            onClick={() => {
              this.props.onSelect(node.node);
            }}
          >
            {node.children && (
              <i
                onClick={() => {
                  node.children && this.props.onToggle(node.id);
                }}
                style={node.status < 2 ? sidebarArrow : sidebarArrowDown}
              />
            )}
            <span style={labelStyle}>{node.label} </span>
            {(this.props.tree.getSelected() === node.id || this.state.hover === node.id) && (
              <div className="btn-group btn-group-sm float-right" role="group" aria-label="...">
                <button
                  type="button"
                  className="btn btn-inline btn-primary"
                  onClick={e => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    this.props.onTreeCreateOne(node.node);
                  }}
                >
                  {this.props.TreeCreateOneIcon}
                </button>
                <button
                  type="button"
                  className="btn btn-inline btn-secondary"
                  onClick={e => {
                    if (e) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                    this.props.onTreeGetOne(node.node);
                  }}
                >
                  {this.props.TreeGetOneIcon}
                </button>
                <button
                  type="button"
                  className="btn btn-inline btn-warning"
                  onClick={() => { this.onConfirm(node.node); }}
                >
                  {this.props.TreeDelOneIcon}
                </button>
              </div>
            )}
          </li>
        </HoverObserver>
        {node.children && node.status === 1 && <LoadingTreeBranch paddingLeft={this.props.paddingLeft + 20} />}
        {node.children && node.status === 2 && (
          <TreeNode {...this.props} node={node.id} paddingLeft={this.props.paddingLeft + 20} />
        )}
        {this.state.confirm && (
          <ResponsiveConfirm show onClose={this.onConfirmClose} onConfirm={this.onConfirmDel} />
        )}
      </div>
    );
  }
}

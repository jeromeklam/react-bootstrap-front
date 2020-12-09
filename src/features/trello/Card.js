import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tag from './Tag';
import CardMenu from './CardMenu';

import { Row, Col } from '../grid';
import { SvgCheckbox } from '../advanced';

class Card extends Component {
  onRemove = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onRemove();
  };
  onDelete = e => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.props.onDelete();
  };

  render() {
    const {
      showRemoveButton,
      showDeleteButton,
      style,
      onClick,
      onSelect,
      className,
      id,
      title,
      num,
      description,
      selected,
      tags,
      cardDraggable,
      t,
      user,
      project,
      priority,
      classPriority,
      deadline,
      progress,
      comment,
      status,
      attachment,
    } = this.props;

    return (
      <article
        data-id={id}
        onDoubleClick={onClick}
        onClick={evt => {
          if (evt) {
            evt.preventDefault();
            evt.stopPropagation();
          }
        }}
        style={style}
        className={classnames('trello-card', className)}
      >
        <Row>
          <Col size={3} textAlign="left">
            {onSelect && (
              <SvgCheckbox
                selected={selected}
                onChange={e => {
                  if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                  onSelect(id);
                }}
              />
            )}
          </Col>
          <Col size={7} textAlign="left">
            <span className="text-secondary">{num}</span>
          </Col>
          <Col size={19} textAlign="right">
            {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.title} {...tag} />)}
          </Col>
          <Col size={3} textAlign="center">
            <div style={{ height: 'px' }}>{user}</div>
          </Col>
          <Col size={4} textAlign="right">
            <CardMenu remove={showRemoveButton} delete={showDeleteButton} onUpdate={onClick} onDelete={this.onDelete} onRemove={this.onRemove} t={t} />
          </Col>
        </Row>
        <Row>
          <Col size={26} textAlign="left">
            <div className="trello-card-title text-secondary" draggable={cardDraggable}>
              {title}
            </div>
          </Col>
          <Col size={10} textAlign="right">
            <div className="trello-card-project text-secondary" draggable={cardDraggable}>
              {project}
            </div>
          </Col>
        </Row>
        {description && description !== '' && <div className="trello-card-detail">{description}</div>}
        <div className="trello-card-footer">
          <Row>
            <Col size={4} textAlign="left">
              <div className={classnames('trello-card-priority', `text-${classPriority}`, `border-${classPriority}`)}>
                {priority}
              </div>
            </Col>
            <Col size={11} textAlign="left">
              <div className="trello-card-deadline">{deadline}</div>
            </Col>
            <Col size={12} textAlign="left">
              <div className="trello-card-progress">{progress}</div>
            </Col>
            <Col size={2} textAlign="left">
              <div className="trello-card-comment text-secondary">{comment}</div>
            </Col>
            <Col size={2} textAlign="left">
              <div className="trello-card-attachment text-secondary">{attachment}</div>
            </Col>
            <Col size={3} textAlign="left">
              <div className="trello-card-status">{status}</div>
            </Col>
          </Row>
        </div>
      </article>
    );
  }
}

Card.propTypes = {
  showRemoveButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  style: PropTypes.object,
  tagStyle: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tags: PropTypes.array,
  selected: PropTypes.bool,
  user: PropTypes.object,
  project: PropTypes.string,
  priority: PropTypes.string,
  classPriority: PropTypes.string,
  deadline: PropTypes.object,
  progress: PropTypes.object,
  comment: PropTypes.object,
  status: PropTypes.object,
};

Card.defaultProps = {
  showRemoveButton: true,
  showDeleteButton: true,
  onDelete: () => {},
  onClick: () => {},
  onSelect: null,
  style: {},
  tagStyle: {},
  title: 'no title',
  description: '',
  tags: [],
  className: '',
  selected: false,
  user: null,
  project: '',
  priority: '',
  classPriority: '',
  deadline: null,
  progress: null,
  comment: null,
  status: null,
};

export default Card;

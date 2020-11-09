import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tag from './Tag';
import CardMenu from './CardMenu';

import { Row, Col } from '../grid';
import { SvgCheckbox } from '../advanced';

class Card extends Component {
  onDelete = e => {
    this.props.onDelete();
    e.stopPropagation();
  };

  render() {
    const {
      showDeleteButton,
      style,
      onClick,
      onSelect,
      className,
      id,
      title,
      label,
      num,
      description,
      selected,
      tags,
      cardDraggable,
      t,
    } = this.props;

    return (
      <article data-id={id} onClick={onClick} style={style} className={classnames('trello-card', className)}>
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
          <Col size={20} textAlign="left">
            {tags && tags.length > 0 && tags.map(tag => <Tag key={tag.title} {...tag} />)}
          </Col>
          <Col size={6} textAlign="right">
            <CardMenu delete={showDeleteButton} onUpdate={onClick} onDelete={this.onDelete} t={t} />
          </Col>
        </Row>
        <Row>
          <Col size={20} textAlign="left">
            <span className="trello-card-title text-secondary" draggable={cardDraggable}>
              {title}
            </span>
          </Col>
          <Col size={10} textAlign="right" />
          <Col size={6} textAlign="right" />
        </Row>
        {description && description !== '' && <div className="trello-card-detail">{description}</div>}
        <div className="trello-card-footer">
          <Row>
            <Col size={6} textAlign="left">
              <span className="trello-card-right">{label}</span>
            </Col>
            <Col size={30} textAlign="left" />
          </Row>
        </div>
      </article>
    );
  }
}

Card.propTypes = {
  showDeleteButton: PropTypes.bool,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  style: PropTypes.object,
  tagStyle: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
  selected: PropTypes.bool,
};

Card.defaultProps = {
  showDeleteButton: true,
  onDelete: () => {},
  onClick: () => {},
  onSelect: null,
  style: {},
  tagStyle: {},
  title: 'no title',
  description: '',
  label: '',
  tags: [],
  className: '',
  selected: false,
};

export default Card;

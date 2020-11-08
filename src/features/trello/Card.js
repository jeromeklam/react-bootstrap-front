import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Tag from './Tag';
import CardMenu from './CardMenu';

import { Row, Col } from '../grid';

class Card extends Component {
  onDelete = e => {
    this.props.onDelete();
    e.stopPropagation();
  };

  render() {
    const {
      showDeleteButton,
      style,
      tagStyle,
      onClick,
      className,
      id,
      title,
      label,
      description,
      tags,
      cardDraggable,
      t
    } = this.props;

    return (
      <article data-id={id} onClick={onClick} style={style} className={classnames('trello-card', className)}>
        <Row>
          <Col size={20}>
            <span className="trello-card-title text-secondary" draggable={cardDraggable}>
              {title}
            </span>
          </Col>
          <Col size={10} textAlign="right">
            <span className="trello-card-right">{label}</span>
          </Col>
          <Col size={6} textAlign="right">
            <CardMenu delete={showDeleteButton} onUpdate={onClick} onDelete={this.onDelete} t={t}/>
          </Col>
        </Row>
        <div className="trello-card-detail">{description}</div>
        {tags && tags.length > 0 && (
          <div className="trello-card-footer">
            {tags.map(tag => (
              <Tag key={tag.title} {...tag} tagStyle={tagStyle} />
            ))}
          </div>
        )}
      </article>
    );
  }
}

Card.propTypes = {
  showDeleteButton: PropTypes.bool,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  tagStyle: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
};

Card.defaultProps = {
  showDeleteButton: true,
  onDelete: () => {},
  onClick: () => {},
  style: {},
  tagStyle: {},
  title: 'no title',
  description: '',
  label: '',
  tags: [],
  className: '',
};

export default Card;

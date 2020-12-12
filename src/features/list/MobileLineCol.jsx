import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import striptags from 'striptags';

import { Col } from '../grid';

const optionsDate = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

const optionsTime = {
  hour: 'numeric',
  minute: 'numeric',
};

export const MobileLineCol = props => {
  let content = props.content;
  if (content === null) {
    content = '';
  }
  if (props.type) {
    switch (props.type) {
      case 'text': {
        content = striptags(`${content}`);
        break;
      }
      case 'html': {
        if (content && content !== null && content !== '') {
          content = content.replace(/<br>/gi, ' ');
          content = content.replace(/<br \/>/gi, ' ');
          content = content.replace(/<\/p><p>/gi, ' ');
          content = striptags(content);
          content = <div dangerouslySetInnerHTML={{ __html: `${content}` }} />;
        }
        break;
      }
      case 'date': {
        if (content !== null && content !== '') {
          const event = new Date(content);
          content = event.toLocaleDateString(props.language, optionsDate);
        } else {
          content = '';
        }
        break;
      }
      case 'datetime': {
        const event = new Date(content);
        content = `${event.toLocaleDateString(props.language, optionsDate)} ${event.toLocaleTimeString(
          props.language,
          optionsTime
        )}`;
        break;
      }
      case 'monetary': {
        let money = props.money;
        if (props.col_money) {
          money = props.item[props.col_money] || props.money;
        }
        content = new Intl.NumberFormat(props.language, {
          style: 'currency',
          currency: money,
        }).format(content);
        break;
      }
      case 'switch': {
        const pos = props.values.find(element => element.value === props.content);
        if (pos) {
          if (pos.icon) {
            content = pos.icon;
          } else {
            content = pos.label;
          }
        }
        break;
      }
      case 'bool': {
        const pos = props.values.find(element => element.value === props.content);
        if (pos) {
          if (pos.icon) {
            content = pos.icon;
          } else {
            content = pos.label;
          }
        } else if (content === '1' || content === 'O' || content === true) {
          content = 'Oui';
        } else {
          content = 'Non';
        }
        break;
      }
      case 'thumbnail': {
        content = `data:image/jpeg;base64,${content}`;
        content = <img src={content} className="rounded img-thumbnail" alt="" style={{ height: '70px' }} />;
        break;
      }
      default:
        break;
    }
  }
  if (content === null || content === '') {
    content = ' ';
  }
  if (typeof props.fDisplay === 'function') {
    content = props.fDisplay(props.item, content);
  }
  if (props.card && props.card.noLabel) {
    return (
      <Col size={36}>
        <span className="text-dark">{content}</span>
      </Col>
    );
  }
  return (
    <>
      <Col size={12}>
        <span className="text-secondary">{props.label}</span>
      </Col>
      <Col size={24}>
        <span className="text-dark">{content}</span>
      </Col>
    </>
  );
};

MobileLineCol.propTypes = {
  content: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  mob_size: PropTypes.number,
  money: PropTypes.string,
};

MobileLineCol.defaultProps = {
  mob_size: 36,
  money: 'EUR',
};

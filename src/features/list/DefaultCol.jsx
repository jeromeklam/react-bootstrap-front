import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import striptags from 'striptags';
import './DefaultCol.css';

const optionsDate = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

const optionsTime = {
  hour: 'numeric',
  minute: 'numeric',
};

const colstyle = {
  wordBreak: 'break-all',
  whiteSpace: 'nowrap',
  minHeight: '30px',
  overflow: 'hidden',
};

export const DefaultCol = (props) => {
  let { content } = props;
  let addClass = '';
  if (props.type && props.values) {
    switch (props.type) {
      case 'text': {
        content = striptags(content);
        break;
      }
      case 'html': {
        if (content && content !== null && content !== '') {
          content = content.replace('<br>', ' ');
          content = content.replace('<br />', ' ');
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
        content = `${event.toLocaleDateString(props.language, optionsDate)} ${event.toLocaleTimeString(props.language, optionsTime)}`;
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
        addClass = 'text-right';
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
        addClass = 'text-center';
        content = `data:image/jpeg;base64,${content}`;
        content = <img src={content} className="rounded img-thumbnail" alt="" style={{height : "70px"}}/>
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
  let cols = '';
  if (typeof props.size === 'object') {
    Object.keys(props.size).forEach((key) => {
      cols += ` col-${key}-${props.size[key]} `;
    });
  } else {
    cols = `col-${props.size}`;
  }
  if (typeof props.first !== 'undefined') {
    if (typeof props.first === 'object') {
      Object.keys(props.first).forEach((key) => {
        if (props.first[key]) {
          cols += ` col-${key}-first `;
        }
      });
    } else if (props.first) {
      cols += ' col-first ';
    }
  }
  if (typeof props.last !== 'undefined') {
    if (typeof props.last === 'object') {
      Object.keys(props.last).forEach((key) => {
        if (props.last[key]) {
          cols += ` col-${key}-last `;
        }
      });
    } else if (props.last) {
      cols += ' col-last ';
    }
  }
  if (typeof props.fClassName === 'function') {
    cols += ' ' + props.fClassName(props.item);
  }
  return (
    <div
      style={colstyle}
      className={classnames(
        cols,
        'col-vertical-align',
        addClass,
      )}
    >
      {props.selectable ? (
        <div>
          <div
            className={classnames(
              'select-line border border-secondary mr-2',
              props.selected.find(elem => elem === props.id) && 'selected'
            )}
            onClick={() => {
              props.onSelect(props.id);
            }}
          >
            <div className="select-line-inner bg-secondary" />
          </div>
          <span style={{ marginLeft: '20px' }}>{content}</span>
        </div>
      ) : (
        <span>{content}</span>
      )}
    </div>
  );
};

DefaultCol.propTypes = {
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  content: PropTypes.element.isRequired,
  type: PropTypes.string,
  values: PropTypes.element,
  selectable: PropTypes.bool,
  language: PropTypes.string,
  money: PropTypes.string,
  fClassName: PropTypes.func,
  fDisplay: PropTypes.func,
  item: PropTypes.element.isRequired,
};

DefaultCol.defaultProps = {
  type: 'text',
  values: [],
  selectable: false,
  language: 'fr-FR',
  money: 'EUR',
  fClassName: null,
  fDisplay: null,
};

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import striptags from 'striptags';

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

const getContent = (type, content) => {
  switch (type) {
    case 'mail':
      return <a href={`mailto:${content}`}>{content}</a>
    case 'phone':
      return <a href={`tel:${content}`}>{content}</a>
    default:
      return <span>{content}</span>;
  }
};

export const DefaultLineCol = (props) => {
  let { content } = props;
  let addClass = '';
  if (props.align !== '') {
    addClass = 'text-' + props.align;
  }
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
        if (content && content !== '') {
          const event = new Date(content);
          content = `${event.toLocaleDateString(props.language, optionsDate)} ${event.toLocaleTimeString(props.language, optionsTime)}`;
        } else {
          content = '';
        }
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
        if (props.align === '') {
          addClass = 'text-right';
        }
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
        if (props.align === '') {
          addClass = 'text-center';
        }
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
      if (!isNaN(props.size[key])) {
        cols += ` col-${key}-w${props.size[key]} `;
      } else {
        cols += ` col-${key}-${props.size[key]} `;
      }
    });
  } else {
    if (!isNaN(props.size)) {
      cols = `col-xxs-w${props.size}`;
    } else {
      cols = `col-xxs-${props.size}`;
    }
  }
  if (typeof props.first !== 'undefined') {
    if (typeof props.first === 'object') {
      Object.keys(props.first).forEach((key) => {
        if (props.first[key]) {
          cols += ` col-${key}-first `;
        }
      });
    } else if (props.first) {
      cols += ' col-xxs-first ';
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
      cols += ' col-xxs-last ';
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
        props.className,
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
        getContent(props.type, content)
      )}
    </div>
  );
};

DefaultLineCol.propTypes = {
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
  className: PropTypes.string,
  align: PropTypes.string,
};

DefaultLineCol.defaultProps = {
  type: 'text',
  values: [],
  selectable: false,
  language: 'fr-FR',
  money: 'EUR',
  fClassName: null,
  fDisplay: null,
  className: '',
  align: '',
};

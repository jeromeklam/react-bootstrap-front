import React from 'react';
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

/**
 *
 */
export const getColContent = ({ content, type, language, money, col_money, item, values }) => {
  let newContent = null;
  switch (type) {
    case 'text': {
      newContent = striptags(`${content}`);
      break;
    }
    case 'html': {
      if (content && content !== null && content !== '') {
        newContent = content.replace(/<br>/gi, ' ');
        newContent = newContent.replace(/<br \/>/gi, ' ');
        newContent = newContent.replace(/<\/p><p>/gi, ' ');
        newContent = striptags(newContent);
        newContent = <div dangerouslySetInnerHTML={{ __html: `${newContent}` }} />;
      }
      break;
    }
    case 'date': {
      if (content !== null && content !== '') {
        const event = new Date(content);
        newContent = event.toLocaleDateString(language, optionsDate);
      } else {
        newContent = '';
      }
      break;
    }
    case 'datetime': {
      if (content && content !== '') {
        const event = new Date(content);
        newContent = `${event.toLocaleDateString(language, optionsDate)} ${event.toLocaleTimeString(
          language,
          optionsTime
        )}`;
      } else {
        newContent = '';
      }
      break;
    }
    case 'monetary': {
      let crtMoney = money;
      if (col_money) {
        crtMoney = item[col_money] || money;
      }
      newContent = new Intl.NumberFormat(language, {
        style: 'currency',
        currency: crtMoney,
      }).format(content);
      break;
    }
    case 'switch': {
      const pos = values.find(element => element.value === content);
      if (pos) {
        if (pos.icon) {
          newContent = pos.icon;
        } else {
          newContent = pos.label;
        }
      }
      break;
    }
    case 'bool': {
      if (content === '1' || content === 'O' || content === true) {
        newContent = 'Oui';
      } else {
        newContent = 'Non';
      }
      break;
    }
    case 'thumbnail': {
      const contentData = `data:image/jpeg;base64,${content}`;
      newContent = <img src={contentData} className="rounded img-thumbnail" alt="" style={{ height: '70px' }} />;
      break;
    }
    case 'mail':
      newContent = (
        <a href={`mailto:${content}`} onClick={ev => ev.stopPropagation()}>
          {content}
        </a>
      );
      break;
    case 'phone':
      newContent = (
        <a href={`tel:${content}`} onClick={ev => ev.stopPropagation()}>
          {content}
        </a>
      );
      break;
    default:
      newContent = content;
      break;
  }
  return newContent;
};

/**
 * Get col content for title
 *
 * @return string
 */
export const getCardTitle = (cols, item) => {
  if (!cols || !item) {
    return '';
  }
  const pos = cols.findIndex(elem => elem.card && elem.card.role && elem.card.role === 'TITLE');
  if (pos >= 0) {
    if (typeof cols[pos].card.fDisplay === 'function') {
      return cols[pos].card.fDisplay(item);
    }
    if (typeof cols[pos].fDisplay === 'function') {
      return cols[pos].fDisplay(item);
    }
    const col = cols[pos].col;
    let content = null;
    if (item[col]) {
      content = item[col];
    }
    const obj = {
      item: item,
      content: content,
      ...cols[col]
    }
    return getColContent(obj);
  }
  return '';
};
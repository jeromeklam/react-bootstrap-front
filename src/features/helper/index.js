import striptags from 'striptags';

export const getSizeFromWidth = width => {
  let testW = parseInt(width, 10);
  if (isNaN(testW)) {
    testW = 0;
  }
  let size = 'xs';
  if (testW >= 768) {
    size = 'sm';
  }
  if (testW >= 1024) {
    size = 'md';
  }
  if (testW >= 1200) {
    size = 'lg';
  }
  if (testW >= 1600) {
    size = 'xl';
  }
  return size;
};

export const isEmptyText = text => {
  try {
    if (text === null) {
      return true;
    }
    if (text.trim() === '') {
      return true;
    }
    if (text.trim() === '<p></p>') {
      return true;
    }
  } catch (ex) {
    // @todo
  }
  return false;
};

export const roundMonetary = (value, language, money, maxDigits = null) => {
  if (language === null || language === '') {
    language = 'fr-FR';
  }
  if (money === null || money === '') {
    money = 'EUR';
  }
  if (maxDigits === null) {
    const numberFormat1 = new Intl.NumberFormat(language, { style: 'currency', currency: money });
    const options1 = numberFormat1.resolvedOptions();
    maxDigits = options1.maximumFractionDigits;
  }
  return parseFloat(value).toFixed(maxDigits);
};

export const formatNumber = (value, language, money, maxDigits = null) => {
  if (language === null || language === '') {
    language = 'fr-FR';
  }
  if (money === null || money === '') {
    money = 'EUR';
  }
  if (maxDigits === null) {
    const numberFormat1 = new Intl.NumberFormat(language, { style: 'currency', currency: money });
    const options1 = numberFormat1.resolvedOptions();
    maxDigits = options1.maximumFractionDigits;
  }
  const mask = new Intl.NumberFormat(language, {
    style: 'decimal',
    minimumFractionDigits: maxDigits,
    currency: money,
  }).format(value);
  return mask;
};

export function getObjectmemberValue(obj, member) {
  if (member !== '') {
    const elems = member.split('.');
    let value = obj;
    while (elems.length > 0) {
      const mb = elems.shift();
      if (value.hasOwnProperty(mb)) {
        value = value[mb];
      } else {
        return '';
      }
    }
    return value;
  }
  return ' ';
}

export const randomString = length => {
  const random13chars = () => {
    return Math.random()
      .toString(16)
      .substring(2, 15);
  };
  const loops = Math.ceil(length / 13);
  return new Array(loops)
    .fill(random13chars)
    .reduce((string, func) => {
      return string + func();
    }, '')
    .substring(0, length);
};

export const displayMonetary = (amount, money = 'EUR', language = 'fr-FR') => {
  if (amount === null || amount === '') {
    return '';
  }
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: money,
  }).format(amount);
};

export const displayDate = (date, language = 'fr-FR') => {
  if (date === null || date === '') {
    return '';
  }
  const myDate = new Date(date);
  if (myDate.toString() !== 'Invalid Date') {
    return myDate.toLocaleDateString(language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  }
  return '';
};

export const displayDatetime = (date, language = 'fr-FR', seconds = true) => {
  if (date === null || date === '') {
    return '';
  }
  const myDate = new Date(date);
  return (
    myDate.toLocaleDateString(language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }) +
    ' ' +
    myDate.toLocaleTimeString(language)
  );
};

export const displayBool = (bool, yes = 'Oui', no = 'Non', language = 'fr-FR') => {
  if (bool === null || bool === '') {
    return '';
  }
  if (bool === true || bool === 1 || bool === '1' || bool === 'O' || bool === 'Y') {
    return yes;
  }
  return no;
};

export const getRandomInt = (min, max) => {
  const minL = Math.ceil(min);
  const maxL = Math.floor(max);
  return Math.floor(Math.random() * (maxL - minL + 1)) + minL;
};

export const htmlToString = html => {
  let text = '';
  if (html && html !== null && html !== '') {
    text = html.replaceAll('<br>', ' ');
    text = text.replaceAll('<br />', ' ');
    text = text.replaceAll('</p><p>', ' ');
    text = striptags(text);
  }
  return text;
};

export const getFieldId = (name, id = null) => {
  if (id && id !== '') {
    return id;
  }
  const rnd = getRandomInt(10000, 99999);
  return `${name}-${rnd}`;
};

export const getRefCoords = ref => {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  let coords = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0, w, h };
  if (ref && ref.current) {
    try {
      const bRect = ref.current.getBoundingClientRect();
      if (bRect) {
        coords.top = bRect.top;
        coords.right = bRect.right;
        coords.bottom = bRect.bottom;
        coords.left = bRect.left;
        coords.width = bRect.width;
        coords.height = bRect.height;
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  return coords;
};

export const getRandomString = () => {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

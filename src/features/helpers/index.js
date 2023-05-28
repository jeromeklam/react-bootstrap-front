import React from 'react';
import striptags from 'striptags';
import { AllHtmlEntities } from 'html-entities';
import { isNull } from 'lodash';

export const verifyEmail = (email) => {
  if (email) {
    const toTest = '' + email;
    if (toTest.trim() !== '') {
      const tabs = toTest.split('@');
      if (tabs.length === 2) {
        const domain = tabs[1].split('.');
        if (domain.length === 2) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}

export const isDescendant = (el, parentId) => {
  let isChild = false;
  if (el.id === parentId) {
    isChild = true;
  }
  while ((el = el.parentNode)) {
    if (el.id == parentId) {
      isChild = true;
    }
  }
  return isChild;
};

export const verifyScope = (p_user_scope, p_scope, p_crud = false) => {
  if (!p_scope) {
    return 'CRUDPS';
  }
  const allScopes = p_user_scope.toUpperCase().split(',');
  const testScope = p_scope.toUpperCase();
  let authorized = false;
  allScopes.some(scope => {
    if (scope.trim() !== '') {
      const parts = scope.split('.');
      let resp = 'CRUDPS';
      if (parts.length > 1) {
        resp = parts[1];
      }
      if (parts[0] === 'ZEUS') {
        authorized = resp;
        return true;
      }
      if (testScope.indexOf(parts[0]) === 0) {
        authorized = resp;
        return true;
      }
      if (testScope.indexOf('*') > 0) {
        if (parts[0].indexOf(testScope.replace(/\*/g, '')) === 0) {
          authorized = resp;
          return true;
        }
      }
    }
  });
  if (!p_crud || !authorized) {
    return authorized;
  }
  if (authorized.indexOf(p_crud.toUpperCase()) >= 0) {
    return authorized;
  }
  return false;
};

export const isMobileDevice = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
};

export const hasUserMedia = () => {
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
};

export const isCamAvailable = () => {
  let response = false;
  navigator.getMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  navigator.getMedia(
    { video: true },
    function() {
      response = true;
    },
    function() {
      // webcam is not available
    }
  );
  return response;
};

export const beep = (context, freq = 2800, duration = 80, vol = 50) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  oscillator.frequency.value = freq;
  oscillator.type = 'square';
  gain.connect(context.destination);
  gain.gain.value = vol * 0.01;
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration * 0.001);
};

export const ensureDatetimeTZ = (date, hour = true) => {
  if (date instanceof Date) {
    if (!hour) {
      const getYear = date.toLocaleString("default", { year: "numeric" });
      const getMonth = date.toLocaleString("default", { month: "2-digit" });
      const getDay = date.toLocaleString("default", { day: "2-digit" });
      return getYear + '-' + getMonth + '-' + getDay; 
    }
    return date.toISOString();
  } else {
    try {
      const nDate = new Date(date);
      if (!hour) {
        const getYear1 = nDate.toLocaleString("default", { year: "numeric" });
        const getMonth1 = nDate.toLocaleString("default", { month: "2-digit" });
        const getDay1 = nDate.toLocaleString("default", { day: "2-digit" });
        return getYear1 + '-' + getMonth1 + '-' + getDay1; 
      }
      return nDate.toISOString();
    } catch (ex) {}
  }
  return isNull;
};

export const getBreakpointAsSize = p_size => {
  const size = p_size || 'xxs';
  switch (size.toLowerCase()) {
    case 'xxl':
      return 1800;
    case 'xl':
      return 1600;
    case 'xlg':
      return 1400;
    case 'lg':
      return 1200;
    case 'xmd':
      return 1100;
    case 'md':
      return 1000;
    case 'xsm':
      return 900;
    case 'sm':
      return 800;
    case 'xs':
      return 600;
    case 'xxs':
      return 500;
    default:
      return 360;
  }
};

export const sizeLower = (p_size1, p_size2) => {
  const size1 = getBreakpointAsSize(p_size1);
  const size2 = getBreakpointAsSize(p_size2);
  if (size1 < size2) {
    return true;
  }
  return false;
};

export const sizeGreater = (p_size1, p_size2) => {
  const size1 = getBreakpointAsSize(p_size1);
  const size2 = getBreakpointAsSize(p_size2);
  if (size1 > size2) {
    return true;
  }
  return false;
};

export const sizeLowerOrEqual = (p_size1, p_size2) => {
  const size1 = getBreakpointAsSize(p_size1);
  const size2 = getBreakpointAsSize(p_size2);
  if (size1 <= size2) {
    return true;
  }
  return false;
};

export const sizeGreaterOrEqual = (p_size1, p_size2) => {
  const size1 = getBreakpointAsSize(p_size1);
  const size2 = getBreakpointAsSize(p_size2);
  if (size1 >= size2) {
    return true;
  }
  return false;
};

export const getSizeFromWidth = width => {
  let testW = parseInt(width, 10);
  if (isNaN(testW)) {
    testW = 0;
  }
  let size = 'xxs';
  if (testW >= 540) {
    size = 'xs';
  }
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
    const numberFormat1 = new Intl.NumberFormat(language, {
      style: 'currency',
      currency: money,
    });
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
    const numberFormat1 = new Intl.NumberFormat(language, {
      style: 'currency',
      currency: money,
    });
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
  let time = myDate.toLocaleTimeString(language);
  if (!seconds) {
    time = time.substring(0, time.lastIndexOf(':'));
  }
  return (
    myDate.toLocaleDateString(language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }) +
    ' ' +
    time
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
    text = '' + html;
    text = text.replace(/<br>/gi, '\n');
    text = text.replace(/<li>/gi, '\n');
    text = text.replace(/<\/li>/gi, '');
    text = text.replace(/<br \/>/gi, '\n');
    text = text.replace(/<\/p><p>/gi, '\n');
    text = striptags(text);
  }
  const entities = new AllHtmlEntities();
  return entities.decode(text);
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
  let coords = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    w,
    h,
  };
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

export function isInViewPort(el, threshold) {
  threshold = threshold || 0;
  var rect = el.getBoundingClientRect();
  var height = (rect.height || el.clientHeight || 0) + threshold;
  var width = (rect.width || el.clientWidth || 0) + threshold;
  return (
    rect.top >= -height &&
    rect.left >= -width &&
    rect.bottom <= height + window.innerHeight &&
    rect.right <= width + window.innerWidth
  );
}

export function purifyString(value) {
  var r = [];
  if (value !== null && value !== '') {
    for (var i = 0, length = value.length; i < length; i++) {
      r.push(replaceCharacter(value.charAt(i)));
    }
  }
  return r.join('');
}

function replaceCharacter(character) {
  switch (character) {
    case '\r':
      return '\r';
    case '\n':
      return '\n';
    case '\t':
      return '\t';
    case '\f':
      return '\r\n';
    case '\v':
      return '\r\n';
    case '`':
      return "'";
    case '€':
      return '_';
    case '‚':
      return ',';
    case 'ƒ':
      return 'f';
    case '„':
      return '"';
    case '…':
      return '...';
    case '†':
      return '_';
    case '‡':
      return '_';
    case 'ˆ':
      return '^';
    case '‰':
      return '%';
    case 'Š':
      return 'S';
    case '‹':
      return '<';
    case 'Œ':
      return 'CE';
    case 'Ž':
      return 'Z';
    case '‘':
      return "'";
    case '’':
      return "'";
    case '“':
      return '"';
    case '”':
      return '"';
    case '•':
      return '-';
    case '–':
      return '-';
    case '—':
      return '-';
    case '˜':
      return '~';
    case '™':
      return '(tm)';
    case 'š':
      return 's';
    case '›':
      return '>';
    case 'œ':
      return 'ce';
    case 'ž':
      return 'z';
    case 'Ÿ':
      return 'Y';
    case '¡':
      return 'i';
    case '¥':
      return 'Y';
    case '¦':
      return '|';
    case 'ª':
      return 'a';
    case '¬':
      return '-';
    case '¯':
      return '-';
    case '²':
      return '2';
    case '³':
      return '3';
    case '´':
      return "'";
    case '¸':
      return ',';
    case '¹':
      return '1';
    case 'º':
      return '0';
    case '¼':
      return '1/4';
    case '½':
      return '1/2';
    case '¾':
      return '3/4';
    case '¿':
      return '?';
    case 'À':
      return 'A';
    case 'Á':
      return 'A';
    case 'Â':
      return 'A';
    case 'Ã':
      return 'A';
    case 'Ä':
      return 'A';
    case 'Å':
      return 'A';
    case 'Æ':
      return 'AE';
    case 'Ç':
      return 'C';
    case 'È':
      return 'E';
    case 'É':
      return 'E';
    case 'Ê':
      return 'E';
    case 'Ë':
      return 'E';
    case 'Ì':
      return 'I';
    case 'Í':
      return 'I';
    case 'Î':
      return 'I';
    case 'Ï':
      return 'I';
    case 'Ð':
      return 'D';
    case 'Ñ':
      return 'N';
    case 'Ò':
      return 'O';
    case 'Ó':
      return 'O';
    case 'Ô':
      return 'O';
    case 'Õ':
      return 'O';
    case 'Ö':
      return 'O';
    case '×':
      return 'x';
    case 'Ø':
      return 'O';
    case 'Ù':
      return 'U';
    case 'Ú':
      return 'U';
    case 'Û':
      return 'U';
    case 'Ü':
      return 'U';
    case 'Ý':
      return 'Y';
    case 'ß':
      return 'B';
    case 'à':
      return 'a';
    case 'á':
      return 'a';
    case 'â':
      return 'a';
    case 'ã':
      return 'a';
    case 'ä':
      return 'a';
    case 'å':
      return 'a';
    case 'æ':
      return 'ae';
    case 'ç':
      return 'c';
    case 'è':
      return 'e';
    case 'é':
      return 'e';
    case 'ê':
      return 'e';
    case 'ë':
      return 'e';
    case 'ì':
      return 'i';
    case 'í':
      return 'i';
    case 'î':
      return 'i';
    case 'ï':
      return 'i';
    case 'ñ':
      return 'n';
    case 'ò':
      return 'o';
    case 'ó':
      return 'o';
    case 'ô':
      return 'o';
    case 'õ':
      return 'o';
    case 'ö':
      return 'o';
    case '÷':
      return '/';
    case 'ø':
      return 'o';
    case 'ù':
      return 'u';
    case 'ú':
      return 'u';
    case 'û':
      return 'u';
    case 'ü':
      return 'u';
    case 'ý':
      return 'y';
    case 'ÿ':
      return 'y';
    case '©':
      return '(c)';
    case '®':
      return '(r)';
    default:
      return character;
  }
}

export const isChildEmpty = children => {
  if (!React.Children.count(children)) {
    return true;
  }
  if (Array.isArray(children)) {
    return !children.some(child => child !== null && child !== false && child !== '');
  }
  return false;
};

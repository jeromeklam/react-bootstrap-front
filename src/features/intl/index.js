import { translations } from './fr';

export const rbfIntl = (tr) => {
  if (tr && tr.id && translations && translations[tr.id]) {
    return translations[tr.id];
  }
  if (tr && tr.defaultMessage) {
    return tr.defaultMessage;
  }
  console.error("Missing translation", tr);
  return '';
};
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
    if (item[col]) {
      return item[col];
    }
  }
  return '';
};
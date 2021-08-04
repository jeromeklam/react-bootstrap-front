export { default as SortPanel } from './SortPanel';
export * from './SortableList.jsx';
export * from './SortableItem.jsx';

/**
 * 
 */
export const validSort = sort => {
  let res = [];
  sort.forEach(elt => {
    if (elt.way !== 'none') {
      const nElt = {
        col: elt.col,
        way: elt.way,
      };
      res.push(nElt);
    }
  });
  return res;
};

/**
 *
 */
export const sortToLocal = (cols, sort) => {
  let local = [];
  sort.forEach(elt => {
    let elt3 = false;
    cols.forEach(elt2 => {
      if (elt.col === elt2.col) {
        elt3 = elt2;
        return true;
      }
    });
    let newElt = {
      col: elt.col,
      way: elt.way,
      label: elt3.label,
      full: elt3,
    };
    local.push(newElt);
  });
  cols.forEach(elt => {
    if (elt.sortable) {
      const found = local.find(elt2 => {
        return elt2.col === elt.col;
      });
      if (!found) {
        let newElt = {
          col: elt.col,
          way: 'none',
          label: elt.label,
          full: elt,
        };
        local.push(newElt);
      }
    }
  });
  return local;
};

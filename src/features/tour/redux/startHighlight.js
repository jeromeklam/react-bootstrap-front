import { TOUR_START_HIGHLIGHT } from './constants';

export function startHighlight() {
  return {
    type: TOUR_START_HIGHLIGHT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_START_HIGHLIGHT: {
      const { highlights, current } = state;
      let newCrt = 0;
      if (current <= 0 && highlights.length > 0) {
        if (action.theme === 'ALL') {
          newCrt = highlights[0].ref;
        } else {
          const found = highlights.find(elem => elem.theme === action.theme);
          if (found) {
            newCrt = found.ref;
          }
        }
      }
      return {
        ...state,
        current: newCrt,
        theme: action.theme || 'ALL',
      };
    }

    default:
      return state;
  }
}

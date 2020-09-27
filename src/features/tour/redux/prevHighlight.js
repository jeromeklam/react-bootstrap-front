import { TOUR_PREV_HIGHLIGHT } from './constants';

export function prevHighlight(theme) {
  return {
    type: TOUR_PREV_HIGHLIGHT,
    theme,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_PREV_HIGHLIGHT: {
      let current = 0;
      const { highlights } = state;
      let currentPos = highlights.findIndex(elem => elem.ref === state.current);
      currentPos -= 1;
      while (currentPos >= 0 && highlights[currentPos].theme !== action.theme) {
        currentPos -= 1;
      }
      if (currentPos < 0 || highlights[currentPos].theme !== action.theme) {
        currentPos = highlights.length;
        while (currentPos >= 0 && highlights[currentPos].theme !== action.theme) {
          currentPos -= 1;
        }
      }
      if (currentPos >= 0 && highlights[currentPos].theme === action.theme) {
        current = highlights[currentPos].ref;
      }
      return {
        ...state,
        current,
        theme: action.theme || 'ALL',
      };
    }

    default:
      return state;
  }
}

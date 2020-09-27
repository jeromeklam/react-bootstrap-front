import { TOUR_NEXT_HIGHLIGHT } from './constants';

export function nextHighlight(theme) {
  return {
    type: TOUR_NEXT_HIGHLIGHT,
    theme,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_NEXT_HIGHLIGHT: {
      let current = 0;
      const { highlights } = state;
      let currentPos = highlights.findIndex(elem => elem.ref === state.current);
      currentPos += 1;
      while (currentPos < highlights.length && highlights[currentPos].theme !== action.theme) {
        currentPos += 1;
      }
      if (currentPos >= highlights.length || highlights[currentPos].theme !== action.theme) {
        currentPos = 0;
        while (currentPos < highlights.length && highlights[currentPos].theme !== action.theme) {
          currentPos += 1;
        }
      }
      if (currentPos < highlights.length && highlights[currentPos].theme === action.theme) {
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

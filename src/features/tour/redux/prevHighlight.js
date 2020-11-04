import { TOUR_PREV_HIGHLIGHT } from './constants';

export function prevHighlight() {
  return {
    type: TOUR_PREV_HIGHLIGHT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_PREV_HIGHLIGHT: {
      let currentPos = state.current || 0;
      currentPos--;
      let theme = state.theme || 'ALL';
      const { highlights } = state;
      while (currentPos >= 0 && highlights[currentPos].theme !== theme) {
        currentPos -= 1;
      }
      if (currentPos < 0 || highlights[currentPos].theme !== theme) {
        currentPos = highlights.length - 1;
        while (currentPos >= 0 && highlights[currentPos].theme !== theme) {
          currentPos -= 1;
        }
      }
      return {
        ...state,
        current: currentPos,
      };
    }

    default:
      return state;
  }
}

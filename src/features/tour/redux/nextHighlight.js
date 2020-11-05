import { TOUR_NEXT_HIGHLIGHT } from './constants';

export function nextHighlight(auto = false) {
  return {
    type: TOUR_NEXT_HIGHLIGHT,
    auto: auto,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_NEXT_HIGHLIGHT: {
      let currentPos = state.current || 0;
      currentPos++;
      let theme = state.theme || 'ALL';
      const { highlights } = state;
      while (currentPos < highlights.length && highlights[currentPos].theme !== theme) {
        currentPos += 1;
      }
      if (currentPos >= highlights.length || highlights[currentPos].theme !== theme) {
        currentPos = 0;
        while (currentPos < highlights.length && highlights[currentPos].theme !== theme) {
          currentPos += 1;
        }
      }
      return {
        ...state,
        current: currentPos,
        timer: action.auto,
      };
    }

    default:
      return state;
  }
}

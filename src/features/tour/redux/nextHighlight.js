import { TOUR_NEXT_HIGHLIGHT } from './constants';

export function nextHighlight() {
  return {
    type: TOUR_NEXT_HIGHLIGHT
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
      console.log(highlights, currentPos);
      return {
        ...state,
        current: currentPos,
      };
    }

    default:
      return state;
  }
}

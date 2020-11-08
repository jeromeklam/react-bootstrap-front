import { TOUR_START_HIGHLIGHT } from './constants';

export function startHighlight(theme) {
  return {
    type: TOUR_START_HIGHLIGHT,
    theme: theme,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_START_HIGHLIGHT: {
      let currentPos = state.current || 0;
      let theme = action.theme || 'ALL';
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
      if (currentPos >= 0 && currentPos < highlights.length) {
        let started = true;
        if (highlights[currentPos].theme !== theme) {
          started = false;
        }
        return {
          ...state,
          current: currentPos,
          started: started,
          theme: theme,
        };
      } else {
        return {
          ...state,
          started: false,
        };
      }
    }

    default:
      return state;
  }
}

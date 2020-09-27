import { TOUR_STOP_HIGHLIGHT } from './constants';

export function stopHighlight() {
  return {
    type: TOUR_STOP_HIGHLIGHT,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_STOP_HIGHLIGHT: {
      const current = 0;
      return {
        ...state,
        current,
      };
    }

    default:
      return state;
  }
}

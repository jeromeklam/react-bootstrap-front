import { TOUR_REMOVE_HIGHLIGHT } from './constants';

export function removeHighlight(args) {
  return {
    type: TOUR_REMOVE_HIGHLIGHT,
    highlight: args,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_REMOVE_HIGHLIGHT: {
      let highlights = state.highlights;
      const result = highlights.filter(elem => elem.ref !== action.highlight.ref);
      return {
        ...state,
        highlights: result,
      };
    }

    default:
      return state;
  }
}

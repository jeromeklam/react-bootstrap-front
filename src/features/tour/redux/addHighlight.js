import { TOUR_ADD_HIGHLIGHT } from './constants';

export function addHighlight(highlight = null) {
  return {
    type: TOUR_ADD_HIGHLIGHT,
    highlight: highlight,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_ADD_HIGHLIGHT: {
      if (action.highlight && !state.highlights.find(elem => elem.id === action.highlight.id)) {
        return {
          ...state,
          highlights: [...state.highlights, action.highlight],
        };
      }
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}

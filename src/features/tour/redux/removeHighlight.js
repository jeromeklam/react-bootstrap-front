import { TOUR_REMOVE_HIGHLIGHT } from './constants';

export function removeHighlight(id) {
  return {
    type: TOUR_REMOVE_HIGHLIGHT,
    id: id,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_REMOVE_HIGHLIGHT: {
      let highlights = state.highlights;
      const result = highlights.filter(elem => elem.id !== action.id);
      return {
        ...state,
        highlights: result,
      };
    }

    default:
      return state;
  }
}

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
      console.log('REMOVE', JSON.parse(JSON.stringify(state.highlights)), action.id);
      return {
        ...state,
        highlights: [...state.highlights.filter(elem => elem.id !== action.id)],
      };
    }

    default:
      return state;
  }
}

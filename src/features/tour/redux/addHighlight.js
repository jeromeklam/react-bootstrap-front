import { TOUR_ADD_HIGHLIGHT } from './constants';

export function addHighlight(args) {
  return {
    type: TOUR_ADD_HIGHLIGHT,
    highlight: args,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_ADD_HIGHLIGHT: {
      console.log('ADD', [...state.highlights, action.highlight]);
      return {
        ...state,
        highlights: [...state.highlights, action.highlight],
      };
    }

    default:
      return state;
  }
}

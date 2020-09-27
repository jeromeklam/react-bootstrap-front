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
      let { highlights } = state;
      const myHighlight = { ...action.highlight, display: false };
      highlights.push(myHighlight);
      return {
        ...state,
        highlights,
      };
    }

    default:
      return state;
  }
}

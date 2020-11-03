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
      return {
        ...state,
        current: 0,
        started: true,
        theme: action.theme || 'ALL',
      };
    }

    default:
      return state;
  }
}

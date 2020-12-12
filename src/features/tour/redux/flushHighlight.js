import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { TOUR_FLUSH_HIGHLIGHT } from './constants';

export function flushHighlight() {
  return {
    type: TOUR_FLUSH_HIGHLIGHT,
  };
}

export function useFlushHighlight() {
  const dispatch = useDispatch();
  const boundAction = useCallback((...params) => dispatch(flushHighlight(...params)), [dispatch]);
  return { flushHighlight: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_FLUSH_HIGHLIGHT:
      return {
        ...state,
        highlights: [],
        current: 0,
        started: false,
        timer: false,
      };

    default:
      return state;
  }
}

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  TOUR_START_HIGHLIGHT_TIMER,
} from './constants';

export function startHighlightTimer() {
  return {
    type: TOUR_START_HIGHLIGHT_TIMER,
  };
}

export function useStartHighlightTimer() {
  const dispatch = useDispatch();
  const boundAction = useCallback((...params) => dispatch(startHighlightTimer(...params)), [dispatch]);
  return { startHighlightTimer: boundAction };
}

export function reducer(state, action) {
  switch (action.type) {
    case TOUR_START_HIGHLIGHT_TIMER:
      return {
        ...state,
        timer: true,
      };

    default:
      return state;
  }
}

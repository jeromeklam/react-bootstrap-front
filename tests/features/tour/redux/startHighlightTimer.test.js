import { TOUR_START_HIGHLIGHT_TIMER } from '../../../../src/features/tour/redux/constants';

import { startHighlightTimer, reducer } from '../../../../src/features/tour/redux/startHighlightTimer';

let initialState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };

describe('tour/redux/startHighlightTimer', () => {
  it('returns correct action by startHighlightTimer', () => {
    expect(startHighlightTimer()).toHaveProperty('type', TOUR_START_HIGHLIGHT_TIMER);
  });

  it('handles action type TOUR_START_HIGHLIGHT_TIMER correctly', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_START_HIGHLIGHT_TIMER });
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { ...initialState, timer: true };
    expect(state).toEqual(expectedState);
  });
});

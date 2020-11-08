import { TOUR_STOP_HIGHLIGHT } from '../../../../src/features/tour/redux/constants';

import { stopHighlight, reducer } from '../../../../src/features/tour/redux/stopHighlight';

const initialState = { highlights: [], current: 0, theme: 'ALL', started: true, timer: true };
const oneHighlight = { id: 'test', theme: 'TEST', ref: { current: {} } };

describe('tour/redux/stopHighlight', () => {
  it('returns correct action by stopHighlight', () => {
    expect(stopHighlight()).toHaveProperty('type', TOUR_STOP_HIGHLIGHT);
  });

  it('handles action type TOUR_STOP_HIGHLIGHT', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_STOP_HIGHLIGHT });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.started).toEqual(false);
    expect(state.timer).toEqual(false);
  });
});

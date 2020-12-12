import {
  TOUR_FLUSH_HIGHLIGHT,
} from '../../../../src/features/tour/redux/constants';

import {
  flushHighlight,
  reducer,
} from '../../../../src/features/tour/redux/flushHighlight';

describe('tour/redux/flushHighlight', () => {
  it('returns correct action by flushHighlight', () => {
    expect(flushHighlight()).toHaveProperty('type', TOUR_FLUSH_HIGHLIGHT);
  });

  it('handles action type TOUR_FLUSH_HIGHLIGHT correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: TOUR_FLUSH_HIGHLIGHT }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});

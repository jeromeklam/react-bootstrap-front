import { TOUR_ADD_HIGHLIGHT } from '../../../../src/features/tour/redux/constants';

import { addHighlight, reducer } from '../../../../src/features/tour/redux/addHighlight';

const initialState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
const oneHighlight = { id: 'test', theme: 'TEST', ref: { current: {} } };

describe('tour/redux/addHighlight', () => {
  it('returns correct action by addHighlight', () => {
    expect(addHighlight()).toHaveProperty('type', TOUR_ADD_HIGHLIGHT);
  });

  it('handles action type TOUR_ADD_HIGHLIGHT with empty highlight', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_ADD_HIGHLIGHT });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
    expect(state).toEqual(expectedState);
  });

  it('handles action type TOUR_ADD_HIGHLIGHT with highlight', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_ADD_HIGHLIGHT, highlight: oneHighlight });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { highlights: [oneHighlight], current: 0, theme: 'ALL', started: false, timer: false };
    expect(state).toEqual(expectedState);
  });

  it('handles action type TOUR_ADD_HIGHLIGHT with same highlight', () => {
    let prevState = initialState;
    prevState.highlights.push(oneHighlight);
    const state = reducer(prevState, { type: TOUR_ADD_HIGHLIGHT, highlight: oneHighlight });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { highlights: [oneHighlight], current: 0, theme: 'ALL', started: false, timer: false };
    expect(state).toEqual(expectedState);
  });
});

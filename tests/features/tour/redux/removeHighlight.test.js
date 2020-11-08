import { TOUR_REMOVE_HIGHLIGHT } from '../../../../src/features/tour/redux/constants';

import { removeHighlight, reducer } from '../../../../src/features/tour/redux/removeHighlight';

const initialState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
const oneHighlight = { id: 'test', theme: 'TEST', ref: { current: {} } };

describe('tour/redux/removeHighlight', () => {
  it('returns correct action by removeHighlight', () => {
    expect(removeHighlight()).toHaveProperty('type', TOUR_REMOVE_HIGHLIGHT);
  });

  it('handles action type TOUR_REMOVE_HIGHLIGHT with empty highlight', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_REMOVE_HIGHLIGHT });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
    expect(state).toEqual(expectedState);
  });

  it('handles action type TOUR_REMOVE_HIGHLIGHT with highlight', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_REMOVE_HIGHLIGHT, id: oneHighlight.id });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
    expect(state).toEqual(expectedState);
  });

  it('handles action type TOUR_REMOVE_HIGHLIGHT with same highlight', () => {
    const prevState = initialState;
    prevState.highlights.push(oneHighlight);
    const state = reducer(prevState, { type: TOUR_REMOVE_HIGHLIGHT, id: oneHighlight.id });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
    expect(state).toEqual(expectedState);
  });
});

import { TOUR_PREV_HIGHLIGHT } from '../../../../src/features/tour/redux/constants';

import { prevHighlight, reducer } from '../../../../src/features/tour/redux/prevHighlight';

let initialState = { highlights: [], current: 0, theme: 'ALL', started: false, timer: false };
const anHighlight1 = { id: 'test1', theme: 'TEST', ref: { current: {} } };
const anHighlight2 = { id: 'test2', theme: 'TEST', ref: { current: {} } };
const anHighlight3 = { id: 'test3', theme: 'TEST', ref: { current: {} } };
const anHighlight4 = { id: 'test4', theme: 'ALL', ref: { current: {} } };
const anHighlight5 = { id: 'test5', theme: 'ALL', ref: { current: {} } };
initialState.highlights.push(anHighlight1);
initialState.highlights.push(anHighlight2);
initialState.highlights.push(anHighlight3);
initialState.highlights.push(anHighlight4);
initialState.highlights.push(anHighlight5);

describe('tour/redux/prevHighlight', () => {
  it('returns correct action by prevHighlight', () => {
    expect(prevHighlight()).toHaveProperty('type', TOUR_PREV_HIGHLIGHT);
  });

  it('handles action type TOUR_PREV_HIGHLIGHT with first theme', () => {
    let prevState = initialState;
    prevState.theme = 'TEST';
    prevState.current = 0;
    let state = reducer(prevState, { type: TOUR_PREV_HIGHLIGHT });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.current).toEqual(2);

    state = reducer(state, { type: TOUR_PREV_HIGHLIGHT });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.current).toEqual(1);

    state = reducer(state, { type: TOUR_PREV_HIGHLIGHT });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.current).toEqual(0);
  });
});

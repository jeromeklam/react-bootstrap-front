import { TOUR_START_HIGHLIGHT } from '../../../../src/features/tour/redux/constants';

import { startHighlight, reducer } from '../../../../src/features/tour/redux/startHighlight';

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

describe('tour/redux/startHighlight', () => {
  it('returns correct action by startHighlight', () => {
    expect(startHighlight()).toHaveProperty('type', TOUR_START_HIGHLIGHT);
  });

  it('handles action type TOUR_START_HIGHLIGHT with first theme', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_START_HIGHLIGHT, theme: 'TEST' });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.current).toEqual(0);
    expect(state.theme).toEqual('TEST');
    expect(state.started).toEqual(true);
  });

  it('handles action type TOUR_START_HIGHLIGHT with second theme', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_START_HIGHLIGHT, theme: 'ALL' });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.current).toEqual(3);
    expect(state.theme).toEqual('ALL');
    expect(state.started).toEqual(true);
  });

  it('handles action type TOUR_START_HIGHLIGHT with unknown theme', () => {
    const prevState = initialState;
    const state = reducer(prevState, { type: TOUR_START_HIGHLIGHT, theme: 'OTHER' });

    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    expect(state.started).toEqual(false);
  });
});

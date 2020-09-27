import initialState from './initialState';
import { reducer as addHighlightReducer } from './addHighlight';
import { reducer as removeHighlightReducer } from './removeHighlight';
import { reducer as toggleHighlightReducer } from './toggleHighlight';
import { reducer as startHighlightReducer } from './startHighlight';
import { reducer as stopHighlightReducer } from './stopHighlight';
import { reducer as nextHighlightReducer } from './nextHighlight';
import { reducer as prevHighlightReducer } from './prevHighlight';

const reducers = [
  addHighlightReducer,
  removeHighlightReducer,
  toggleHighlightReducer,
  startHighlightReducer,
  stopHighlightReducer,
  nextHighlightReducer,
  prevHighlightReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}

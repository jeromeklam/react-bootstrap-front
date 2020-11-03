import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import highlightReducer from './redux/reducer';

const middlewares = [logger];
let tourStore = null;

const configureStore = () => {
  //When you create multiple boards, unique stores are created for isolation
  if (!tourStore) {
    tourStore = createStore(highlightReducer, applyMiddleware(...middlewares));
  }
  return tourStore;
};

export default configureStore;

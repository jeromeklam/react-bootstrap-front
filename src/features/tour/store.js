import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import highlightReducer from './redux/reducer'

const middlewares = [logger];

const configureStore = () => {
  //When you create multiple boards, unique stores are created for isolation
  return createStore(highlightReducer, applyMiddleware(...middlewares));
}

export default configureStore;

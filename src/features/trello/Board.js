import React, { Component } from 'react';
import { Provider } from 'react-redux';
import classNames from 'classnames';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import uuidv1 from 'uuid/v1';
import BoardContainer from './BoardContainer';
import boardReducer from 'rt/reducers/BoardReducer';

const middlewares = process.env.REDUX_LOGGING ? [logger] : [];

export default class Board extends Component {
  constructor({ id }) {
    super();
    this.store = this.getStore();
    this.id = id || uuidv1();
  }

  getStore = () => {
    //When you create multiple boards, unique stores are created for isolation
    return createStore(boardReducer, applyMiddleware(...middlewares));
  };

  render() {
    const { className, ...otherProps } = this.props;
    const allClassNames = classNames('react-trello-board', className || '');
    return (
      <Provider store={this.store}>
        <BoardContainer id={this.id} {...otherProps} className={allClassNames} />
      </Provider>
    );
  }
}

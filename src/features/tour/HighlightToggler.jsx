import React, { Component } from 'react'
import { Provider } from 'react-redux'
import uuidv1 from 'uuid/v1'
import { HighlightButton } from './'
import getStore from './store.js';

export default class HighlightToggler extends Component {
  constructor(props) {
    super(props);
    this.store = getStore();
    this.id = props.id || uuidv1();
  }

  render() {
    return (
      <Provider store={this.store}>
        <HighlightButton
          id={this.id}
          {...this.props}
        />
      </Provider>
    )
  }
}

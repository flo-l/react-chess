import React from 'react';
import ReactDOM from 'react-dom';
import Provider from 'react-redux';
import { createStore } from 'redux';

import rootReducer from './reducers'
import GameController from './containers/gameController'

import './index.css'

const store = createStore(rootReducer,
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
  <GameController store={store} />,
  document.getElementById('root')
);

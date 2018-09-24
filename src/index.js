import React from 'react';
import { hot } from "react-hot-loader";
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers'
import GameController from './containers/gameController'

import './index.css'

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  )
);

ReactDOM.render(
  <GameController store={store} />,
  document.getElementById('root')
);

export default hot(module)(GameController);

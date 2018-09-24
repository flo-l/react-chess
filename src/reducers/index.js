import { combineReducers } from 'redux'
import { board } from './board'
import { ai } from './ai'

export default combineReducers({
  board,
  ai
});

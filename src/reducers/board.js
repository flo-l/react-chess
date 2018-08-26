import { clickSquare } from '../actions'
import { initPieces } from '../chess_helpers'

const initialState = {
  squares: initPieces(),
  selectedIndex: null
};

export const board = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE':
      return Object.assign({}, state, {
        selectedIndex: action.index
      });
    default:
      return state;
  }
};

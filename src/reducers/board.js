import { ChessState } from '../chess_helpers'

const initialState = {
  chess: new ChessState,
  selectedIndex: null
};

export const board = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE':
      if (state.selectedIndex === null) {
        return Object.assign({}, state, {
          selectedIndex: action.index
        });
      } else {
          // check if the click is valid etc..
          return Object.assign({}, state, {
            selectedIndex: action.index
          });
      }
    default:
      return state;
  }
};

import { ChessState } from '../chess_helpers'

const initialState = {
  chess: new ChessState(),
  selectedIndex: null
};

export const board = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE':
      if (
        state.selectedIndex === null ||
        state.chess.belongsToCurrentPlayer(action.index))
      {
        return Object.assign({}, state, {
          selectedIndex: action.index
        });
      } else {
          // check if the click is valid etc..
          if (state.chess.getPossibleMoves(action.index)) {
            console.log("TODO: make the move");
          }

          return state;
      }
    default:
      return state;
  }
};

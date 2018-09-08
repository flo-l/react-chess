import { ChessState } from '../chess_helpers'

const initialState = {
  chess: new ChessState(),
  selectedIndex: null,
  winner: null,
  flipDirection: true,
};

export const board = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE':
      if (state.winner !== null) {
        return state;
      }

      if (state.chess.belongsToCurrentPlayer(action.index)) {
        return Object.assign({}, state, {
          selectedIndex: action.index
        });
      } else {
          // check if the click is valid etc..
          if (state.chess.getPossibleMoves(state.selectedIndex).includes(action.index)) {
            const new_chess_state = state.chess.makeMove(state.selectedIndex, action.index);
            return Object.assign({}, state, {
              selectedIndex: null,
              chess: new_chess_state,
              winner: new_chess_state.calculateWinner(),
            });
          }

          return state;
      }
    default:
      return state;
  }
};

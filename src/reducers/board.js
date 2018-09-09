import { ChessState } from '../chess_helpers'

const initialState = {
  chess: new ChessState(),
  selectedIndex: null,
  winner: null,
  // possible values are 0,1,2,3, which turn the board by 0, 90, 180 or 270 degree respectively
  turn90: 2, // TODO: create a way for the user to change this
  playerMustChoosePiece: undefined, // set to idx of field if a pawn reaches the the last row and the player has not yet chosen the piece they get
};

export const board = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE':
      if (state.winner !== null || state.playerMustChoosePiece !== undefined) {
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
              playerMustChoosePiece: new_chess_state.promotionPending(),
            });
          }

          return state;
      }

      case 'PROMOTION_CHOSEN': {
        if (state.playerMustChoosePiece === undefined) {
          return state;
        }

        const new_chess_state = state.chess.executePromotion(action.piece);
        return Object.assign({}, state, {
          chess: new_chess_state,
          winner: new_chess_state.calculateWinner(),
          playerMustChoosePiece: undefined,
        });
      }
    default:
      return state;
  }
};

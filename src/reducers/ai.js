import { ChessState } from '../chess_helpers'

const initialState = {
  ai_is_white: null
};

export const ai = (state = initialState, action) => {
  switch (action.type) {
    case 'GAME_MODE_CHOSEN':
      if (state.ai_is_white === null) {
        return Object.assign({}, state, {
          ai_is_white: action.ai_is_white
        });
      }
    default:
      return state;
  }
};

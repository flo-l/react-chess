import { decodeAn } from '../chess_helpers'

export const gameModeChosen = mode => ({
  type: 'GAME_MODE_CHOSEN',
  ai_is_white: mode
})

export const selectSquare = index => ({
  type: 'SELECT_SQUARE',
  index: index
});

export const unselectSquare = () => ({
  type: 'UNSELECT_SQUARE',
});

export const makeMove = (from, to) => ({
  type: 'MAKE_MOVE',
  from: from,
  to: to,
});

export const promotionChosen = p => ({
  type: 'PROMOTION_CHOSEN',
  piece: p,
});

export const initializingAi = () => ({
  type: 'AI_INIT',
})

export const aiReady = (ai) => ({
  type: 'AI_READY',
  ai: ai,
})

export const loadAi = (ai_is_white, fen) => {
  return dispatch => {
    dispatch(initializingAi());

    // load ai js
    const js = import("../engines/littlewing_web.js");
    js.then((ai) => {
      dispatch(aiReady(ai));

      if (ai_is_white) {
        // let ai make first move
        dispatch(invokeAi(ai, fen));
      }
    });
  };
};

export const invokeAi = () => {
  return (dispatch, getState) => {
    // let ai make next move
    const state = getState();
    const ai = state.ai.ai;
    const fen = state.board.chess.fen();
    const next_move = ai.get_next_move(fen);
    const decoded = decodeAn(next_move);
    dispatch(makeMove(decoded.from, decoded.to));
  };
};

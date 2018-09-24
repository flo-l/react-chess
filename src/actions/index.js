export const gameModeChosen = mode => ({
  type: 'GAME_MODE_CHOSEN',
  ai_is_white: mode
})

export const clickSquare = index => ({
  type: 'CLICK_SQUARE',
  index: index
});

export const aiMove = move => ({
  type: 'AI_MOVE',
  move: move,
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

import { getRow, getCol, getIndex, getFieldName, getIndexFromFieldName } from '../chess_helpers'

export const loadAi = (ai_is_white, fen) => {
  return dispatch => {
    dispatch(initializingAi());

    // load ai js
    const js = import("../engines/littlewing_web.js");
    js.then((ai) => {
      dispatch(aiReady(ai));

      if (ai_is_white) {
        // let ai make first move
        const next_move = ai.get_next_move(fen, ai_is_white);
        dispatch(aiMove(next_move));
      }
    });
  };
};

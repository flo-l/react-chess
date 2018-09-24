export const gameModeChosen = mode => ({
  type: 'GAME_MODE_CHOSEN',
  ai_is_white: mode
})

export const clickSquare = index => ({
  type: 'CLICK_SQUARE',
  index: index
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

export const loadAi = () => {
  return dispatch => {
    dispatch(initializingAi());

    // load ai js
    const js = import("../engines/littlewing_web.js");
    js.then((ai) => {
      dispatch(aiReady(ai));
    });
  };
};

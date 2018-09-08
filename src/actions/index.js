export const clickSquare = index => ({
  type: 'CLICK_SQUARE',
  index: index
});

export const promotionChosen = (p) => ({
  type: 'PROMOTION_CHOSEN',
  piece: p,
});

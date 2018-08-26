import { clickSquare } from '../actions'

const initialState = {
  idx: null
}

export const clickSquareReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CLICK_SQUARE':
      return Object.assign({}, state, {
        idx: action.index
      });
    default:
      return state;
  }
};

import { connect } from 'react-redux'
import Game from '../components/game'
import { clickSquare } from '../actions'

const mapStateToProps = state => {
  let marked = Array(64).fill(null);
  if (state.clickSquareReducer.idx !== null) {
    marked[state.clickSquareReducer.idx] = 'selected';
  }

  return {
    board_size: 8,
    squares: Array(64).fill(null),
    markedIndices: marked,
    status: 'status text'
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (idx) => dispatch(clickSquare(idx))
  };
}

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameController;

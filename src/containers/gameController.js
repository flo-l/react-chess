import { connect } from 'react-redux'
import Game from '../components/game'
import { clickSquare } from '../actions'

const mapStateToProps = state => {
  let marked = Array(64).fill(null);
  if (state.board.selectedIndex !== null) {
    marked[state.board.selectedIndex] = 'selected';
  }

  return {
    board_size: 8,
    squares: state.board.squares,
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

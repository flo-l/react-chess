import { connect } from 'react-redux'
import Board from '../components/board'
import { clickSquare } from '../actions'

const mapStateToProps = state => {
  let marked = Array(64).fill(null);
  if (state.board.selectedIndex !== null) {
    marked[state.board.selectedIndex] = 'selected';

    for (const i of state.board.chess.getPossibleMoves(state.board.selectedIndex)) {
      marked[i] = 'possible_move';
    }
  }

  return {
    size: 8,
    squares: state.board.chess.squares,
    markedIndices: marked,
    turn90: state.board.turn90,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (idx) => dispatch(clickSquare(idx)),
  };
}

const BoardController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Board);

export default BoardController;

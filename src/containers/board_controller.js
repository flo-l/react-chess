import { connect } from 'react-redux'
import Board from '../components/board'
import { selectSquare, unselectSquare, makeMove } from '../actions'

const mapStateToProps = state => {
  const marked = Array(64).fill(null);
  const possibleMoves = Array(64).fill(false);
  if (state.board.selectedIndex !== null) {
    marked[state.board.selectedIndex] = 'selected';

    for (const i of state.board.chess.getPossibleMoves(state.board.selectedIndex)) {
      marked[i] = 'possible_move';
      possibleMoves[i] = true;
    }
  }

  const playerColor = state.board.chess.playerColor();
  const selectable = state.board.chess.squares.map(piece => {
    return Object.values(playerColor).find(p => p === piece);
  });

  return {
    size: 8,
    squares: state.board.chess.squares,
    indexSelectable: selectable,
    movePossible: possibleMoves,
    markedIndices: marked,
    turn90: state.board.turn90,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (idx) => dispatch(clickSquare(idx)),
    selectSquare: (idx) => dispatch(selectSquare(idx)),
    unselectSquare: () => dispatch(unselectSquare()),
    makeMove: (idx) => dispatch(makeMove(idx)),
  };
}

const BoardController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Board);

export default BoardController;

import { connect } from 'react-redux'
import Game from '../components/game'
import { clickSquare, promotionChosen } from '../actions'

const mapStateToProps = state => {
  let marked = Array(64).fill(null);
  if (state.board.selectedIndex !== null) {
    marked[state.board.selectedIndex] = 'selected';

    for (const i of state.board.chess.getPossibleMoves(state.board.selectedIndex)) {
      marked[i] = 'possible_move';
    }
  }

  let status;
  if (state.board.winner !== null) {
    if (state.board.winner === 'DRAW') {
      status = "It's a draw!"
    } else {
      status = state.board.chess.enemyString() + " player won.";
    }
  } else if (state.board.playerMustChoosePiece) {
    status = state.board.chess.enemyString() + " player, please choose your promotion piece."
  } else {
    status = "Next player is " + state.board.chess.playerString() + ".";
  }

  return {
    board_size: 8,
    squares: state.board.chess.squares,
    markedIndices: marked,
    status: status,
    turn90: state.board.turn90,
    enemyColor: state.board.chess.enemyColor(),
    promotionVisible: state.board.playerMustChoosePiece !== undefined,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (idx) => dispatch(clickSquare(idx)),
    promotionChosen: (piece) => dispatch(promotionChosen(piece)),
  };
}

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameController;

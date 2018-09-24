import { connect } from 'react-redux'
import Game from '../components/game'
import { clickSquare, promotionChosen, gameModeChosen, loadAi } from '../actions'

const mapStateToProps = state => {
  let marked = Array(64).fill(null);
  if (state.board.selectedIndex !== null) {
    marked[state.board.selectedIndex] = 'selected';

    for (const i of state.board.chess.getPossibleMoves(state.board.selectedIndex)) {
      marked[i] = 'possible_move';
    }
  }

  return {
    board_size: 8,
    squares: state.board.chess.squares,
    markedIndices: marked,
    status: status,
    turn90: state.board.turn90,
    enemyColor: state.board.chess.enemyColor(),
    promotionVisible: state.board.playerMustChoosePiece !== undefined,
    gameInitialized: state.board.gameInitialized,
    winner: state.board.winner,
    enemyString: state.board.chess.enemyString(),
    playerString: state.board.chess.playerString(),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (idx) => dispatch(clickSquare(idx)),
    promotionChosen: (piece) => dispatch(promotionChosen(piece)),
    gameModeChosen: (mode_white) => {
      dispatch(gameModeChosen(mode_white));
      dispatch(loadAi());
    },
  };
}

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameController;

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
    chess: state.board.chess,
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
    gameModeChosen: (mode_white, fen) => {
      dispatch(gameModeChosen(mode_white));
      dispatch(loadAi(mode_white, fen));
    },
  };
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const merged = {
    gameModeChosen: (mode_white) => dispatchProps.gameModeChosen(mode_white, stateProps.chess.fen()),
  }
  return Object.assign({}, ownProps, stateProps, dispatchProps, merged)
};

const GameController = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(Game);

export default GameController;

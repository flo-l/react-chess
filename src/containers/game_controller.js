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
    gameInitialized: state.board.gameInitialized,
    chess: state.board.chess,
    status: status,
    winner: state.board.winner,
    playerString: state.board.chess.playerString(),
    enemyString: state.board.chess.enemyString(),
    enemyColor: state.board.chess.enemyColor(),
    promotionVisible: state.board.playerMustChoosePiece !== undefined,
  };
};

const mapDispatchToProps = dispatch => {
  return {
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

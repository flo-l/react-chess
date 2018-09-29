import React from 'react';
import BoardController from '../containers/board_controller';
import GameModeChooser from './game_mode_chooser';
import PromotionPicker from './promotion_picker';

import '../css/game.css'

export default function Game(props) {
  let promotion_picker;
  if (props.promotionVisible) {
    promotion_picker = (<PromotionPicker
      promotionChosen={props.promotionChosen}
      playerColor={props.enemyColor}/>);
  }

  let status;
  if (props.winner !== null) {
    if (props.winner === 'DRAW') {
      status = "It's a draw!"
    } else {
      status = props.enemyString + " player won.";
    }
  } else if (props.playerMustChoosePiece) {
    status = props.enemyString + " player, please choose your promotion piece."
  } else {
    status = "Next player is " + props.playerString + ".";
  }

  let game_mode_chooser;
  if (!props.gameInitialized) {
    status = undefined;
    game_mode_chooser = <GameModeChooser gameModeChosen={props.gameModeChosen} />;
  }

  return (
    <div className="game">
      <BoardController />

      <div className="game-info">
        <div>{status}</div>

        { game_mode_chooser }
        { promotion_picker }
      </div>
    </div>
  );
}

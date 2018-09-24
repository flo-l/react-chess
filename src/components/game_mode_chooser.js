import React from 'react';

import '../css/game_mode_chooser.css';

export default function GameModeChooser(props) {
  return (
    <div className="game-mode-chooser">
      Please choose your side.
      <div className="game-mode-chooser-inner">
        <div
          className="game-mode-option"
          onClick={() => props.gameModeChosen(true)}>
          white
        </div>

        <div
          className="game-mode-option"
          onClick={() => props.gameModeChosen(false)}>
          black
        </div>
      </div>
    </div>
  );
}

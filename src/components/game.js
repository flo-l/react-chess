import React from 'react';
import Board from './board';
import PromotionPicker from './promotion_picker';

import '../css/game.css'

export default function Game(props) {
  return (
    <div className="game">
      <Board
        size={props.board_size}
        squares={props.squares}
        markedIndices={props.markedIndices}
        flipDirection={props.flipDirection}
        onClick={(i) => props.onClick(i)}
      />

    <div className="game-info">
      <div>{props.status}</div>
    </div>

    <PromotionPicker
      promotionChosen={props.promotionChosen}
      playerColor={props.enemyColor}/>

    </div>
  );
}

import React from 'react';
import Board from './board';
import PromotionPicker from './promotion_picker';

import '../css/game.css'

export default function Game(props) {
  let promotion_picker;
  if (props.promotionVisible) {
    promotion_picker = (<PromotionPicker
      promotionChosen={props.promotionChosen}
      playerColor={props.enemyColor}/>);
  }

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
      
      { promotion_picker }
    </div>
    </div>
  );
}

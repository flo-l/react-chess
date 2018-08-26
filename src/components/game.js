import React from 'react';
import Board from './board';

export default function Game(props) {
  return (
    <div className="game">
      <div className="game-board">
        <Board
          size={props.board_size}
          squares={props.squares}
          onClick={(i) => props.onClick(i)}
          markedIndices={props.markedIndices}
        />
      </div>
      <div className="game-info">
        <div>{props.status}</div>
      </div>
    </div>
  );
}

import React from 'react';
import Board from './board';

export default function Game(props) {
  return (
    <div className="game">
      <Board
        size={props.board_size}
        squares={props.squares}
        onClick={(i) => props.onClick(i)}
        markedIndices={props.markedIndices}
      />
      <div className="game-info">
        <div>{props.status}</div>
      </div>
    </div>
  );
}

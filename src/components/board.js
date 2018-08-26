import React from 'react';
import { getIndex } from '../chess_helpers.js';

function Square(props) {
  let classNames = ["square"];
  if (props.background)  { classNames.push(props.background); }

  return (
    <button
      className={classNames.join(' ')}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// this renders a n times n grid with Square
export default function Board(props) {
  const size = props.size;
  const rows = [...Array(size).keys()].map((_, row) => {
    return(
      <React.StrictMode>
      <div key={row} className="board-row">
        {
          [...Array(size).keys()]
          .map((_, col) => {
            const i = getIndex(row, col);

            let background = props.markedIndices[i];
            if (!background) {
              if ((i + row) % 2 === 1) {
                background = "white";
              } else {
                background = "black";
              }
            }

            return <Square
              key={i}
              i={i}
              value={props.squares[i]}
              onClick={() => props.onClick(i)}
              background={background}
            />;
          })
        }
      </div>
    </React.StrictMode>
    );
  });

  return (
    <div>
      {rows}
    </div>
  );
}

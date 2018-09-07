import React from 'react';
import { getIndex } from '../chess_helpers.js';

function Square(props) {
  let classNames = ["square"];
  if (props.background)  { classNames.push(props.background); }

  return (
    <svg viewBox="0 0 14 14"
      className={classNames.join(' ')}
      onClick={props.onClick}>
      <text x="50%" y="50%" font-size="9" dominant-baseline="middle" text-anchor="middle">{props.value}</text>
    </svg>
  );
}

function VerticalDescription(props) {
  const square = (<div className="description description-square"></div>);
  const descriptions = [...Array(8).keys()].reverse().map(i => {
    return (<div className={"description description-" + props.pos}>{i + 1}</div>)
  });

  return (
    <React.Fragment>
      {square}
      {descriptions}
      {square}
    </React.Fragment>
  );
}

function BoardInner(props) {
  const size = props.size;
  const rows = [...Array(size).keys()].map((_, row) => {
    return(
      <React.StrictMode>
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
    </React.StrictMode>
    );
  });

  return (
    <div class="game-board-outer">
    <div class="game-board-inner">
      {rows}
    </div>
    </div>
  );
}

// this renders a n times n grid with Square
export default function Board(props) {
  return (
    <BoardInner {...props}/>
  );
}

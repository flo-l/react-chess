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

// this renders a n times n grid with Square
export default function Board(props) {
  const size = props.size;
  const rows = [...Array(size).keys()].map((_, row) => {
    return(
      <React.StrictMode>
        <div className="description description-left">{(17-row).toString(18)}</div>
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
        <div className="description description-right">{(17-row).toString(18)}</div>
    </React.StrictMode>
    );
  });

  return (
    <div class="game-board">
      <VerticalDescription pos="top" />
      {rows}
      <VerticalDescription pos="bottom" />
    </div>
  );
}

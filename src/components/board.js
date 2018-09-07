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

function HorizontalDescriptions(props) {
  const square = (<div className="description description-square"></div>);
  const descriptions = [...Array(8).keys()].reverse().map(i => {
    return (
      <svg viewBox="0 0 14 5"
        className="description description-horizontal">
        <text x="50%" y="50%" font-size="3.5" dominant-baseline="middle" text-anchor="middle">{i + 1}</text>
      </svg>
    )
  });

  return (
    <React.Fragment>
      {square}
      {descriptions}
      {square}
    </React.Fragment>
  );
}

function VerticalDescription(props) {
  return (
    <svg viewBox="0 0 5 14"
      className="description description-vertical">
      <text x="50%" y="50%" font-size="3.5" dominant-baseline="middle" text-anchor="middle">{String.fromCharCode('a'.charCodeAt() + props.i)}</text>
    </svg>
  )
}

function VerticalDescriptions(props) {
  const descriptions = [...Array(8).keys()].map(i => {
    return (
      <React.Fragment>
        <VerticalDescription i={i}/>
        <VerticalDescription i={i}/>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      {descriptions}
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
    <div class="game-board-outermost">
      <BoardInner {...props}/>

      <HorizontalDescriptions />
      <VerticalDescriptions />
      <HorizontalDescriptions />
    </div>
  );
}

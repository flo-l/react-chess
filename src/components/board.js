import React from 'react';
import { getIndex } from '../chess_helpers.js';

function Square(props) {
  let classNames = ["square"];
  if (props.background)  { classNames.push(props.background); }

  return (
    <svg viewBox="0 0 14 14"
      className={classNames.join(' ')}
      fontFamily="Century Gothic"
      onClick={props.onClick}>
      <text x="50%" y="50%" fontSize="9" dominantBaseline="middle" textAnchor="middle">{props.value}</text>
    </svg>
  );
}

function HorizontalDescriptions(props) {
  const descriptions = [...Array(8).keys()].reverse().map(i => {
    return (
      <svg key={i*2}
        viewBox="0 0 14 5"
        fontFamily="Century Gothic"
        className="description description-horizontal">
        <text x="50%" y="50%" fontSize="3.5" dominantBaseline="middle" textAnchor="middle">{i + 1}</text>
      </svg>
    )
  });

  return (
    <React.Fragment>
      <div key={"first-" + props.x}className="description description-square"></div>
      {descriptions}
      <div key={"second-" + props.x}className="description description-square"></div>
    </React.Fragment>
  );
}

function VerticalDescription(props) {
  return (
    <svg
      viewBox="0 0 5 14"
      fontFamily="Century Gothic"
      className="description description-vertical">
      <text x="50%" y="50%" fontSize="3.5" dominantBaseline="middle" textAnchor="middle">{String.fromCharCode('a'.charCodeAt() + props.i)}</text>
    </svg>
  )
}

function VerticalDescriptions(props) {
  const descriptions = [...Array(8).keys()].map(i => {
    return (
      <React.Fragment key={"fragment" + i}>
        <VerticalDescription i={i} key={"first" + i}/>
        <VerticalDescription i={i} key={"second" + i}/>
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
      <React.StrictMode key={"strict" + row}>
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
    <div className="game-board-outer">
    <div className="game-board-inner">
      {rows}
    </div>
    </div>
  );
}

// this renders a n times n grid with Square
export default function Board(props) {
  return (
    <div className="game-board-outermost">
      <BoardInner {...props}/>

      <HorizontalDescriptions x={1}/>
      <VerticalDescriptions />
      <HorizontalDescriptions x={2}/>
    </div>
  );
}

import React from 'react';
import { getIndex } from '../chess_helpers.js';

import '../css/board.css'

function Square(props) {
  let classNames = ["square"];
  if (props.background)  { classNames.push(props.background); }

  return (
    <svg viewBox="0 0 14 14"
      className={classNames.join(' ')}
      style={
        {
          "gridRow":    props.displayedRow + 1,
          "gridColumn": props.displayedCol + 1,
        }
      }
      onClick={props.onClick}>
      <text x="50%" y="50%" fontFamily="chessFreeSerif" fontSize="9" dominantBaseline="middle" textAnchor="middle">{props.value}</text>
    </svg>
  );
}

function HorizontalDescriptions(props) {
  const size = props.size;
  const turn90Count = props.turn90;
  const descriptions = [...Array(size).keys()].map(i => {
    const displayed = turn90(props.gridRow, props.size - i, props.size + 2, turn90Count);

    return (
      <svg key={i*2}
        viewBox="0 0 5 5"
        fontFamily="gothic"
        className="description"
        style={{
          gridRow:    displayed.row + 1,
          gridColumn: displayed.col + 1,
        }}>
        <text x="50%" y="50%" fontSize="3.5" dominantBaseline="middle" textAnchor="middle">{i + 1}</text>
      </svg>
    )
  });

  return (
    <React.Fragment>
      <div key={"first-"  + props.gridRow} className="description description-square"></div>
      {descriptions}
      <div key={"second-" + props.gridRow} className="description description-square"></div>
    </React.Fragment>
  );
}

function VerticalDescription(props) {
  return (
    <svg
      viewBox="0 0 5 5"
      fontFamily="gothic"
      className="description"
      style={
        {
          gridRow:    props.displayedRow + 1,
          gridColumn: props.displayedCol + 1,
        }
      }>
      <text x="50%" y="50%" fontSize="3.5" dominantBaseline="middle" textAnchor="middle">{String.fromCharCode('a'.charCodeAt() + props.i)}</text>
    </svg>
  )
}

function VerticalDescriptions(props) {
  const turn90Count = props.turn90;
  const descriptions = [...Array(8).keys()].map(i => {
    const displayed1 = turn90(props.size - i, 0, props.size + 2, turn90Count);
    const displayed2 = turn90(props.size - i, 9, props.size + 2, turn90Count);

    return (
      <React.Fragment key={"fragment" + i}>
        <VerticalDescription i={i} key={"first" + i}  displayedRow={displayed1.row} displayedCol={displayed1.col}/>
        <VerticalDescription i={i} key={"second" + i} displayedRow={displayed2.row} displayedCol={displayed2.col}/>
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      {descriptions}
    </React.Fragment>
  );
}

// this renders a n times n grid with Square
// it is always a perfect square
function BoardInner(props) {
  const size = props.size;
  const turn90Count = props.turn90;

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

            let onClick = null;
            if (props.movePossible[i]) {
              onClick = (() => props.makeMove(i));
            } else if (props.indexSelectable[i]) {
              onClick = (() => props.selectSquare(i));
            } else {
              onClick = props.unselectSquare;
            }

            const displayed = turn90(row, col, size, turn90Count);

            return <Square
              key={i}
              i={i}
              value={props.squares[i]}
              onClick={onClick}
              background={background}
              displayedRow={displayed.row}
              displayedCol={displayed.col}
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

// turns row and col times * 90°, assuming a grid of size * size
function turn90(row, col, size, times) {
  for (let i = 0; i < times; i++) {
    // transpose
    const buf = row;
    row = col;
    col = buf;

    // mirror columns
    col = size - 1 - col;
  }

  return {row: row, col: col};
}

export default function Board(props) {
  return (
    <div className="game-board-outermost">
      <BoardInner {...props}/>

      <HorizontalDescriptions gridRow={0} {...props}/>
      <VerticalDescriptions {...props}/>
      <HorizontalDescriptions gridRow={9} {...props}/>
    </div>
  );
}

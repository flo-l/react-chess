import React from 'react';
import { getIndex } from '../chess_helpers.js';

function Square(props) {
  let classNames = ["square"];
  if (props.background)  { classNames.push(props.background); }

  return (
    <svg viewBox="0 0 14 14"
      className={classNames.join(' ')}
      fontFamily="Century Gothic"
      style={
        {
          "gridRow":    props.displayedRow + 1,
          "gridColumn": props.displayedCol + 1,
        }
      }
      onClick={props.onClick}>
      <text x="50%" y="50%" fontSize="9" dominantBaseline="middle" textAnchor="middle">{props.value}</text>
    </svg>
  );
}

function HorizontalDescriptions(props) {
  const size = props.size;
  const descriptions = [...Array(size).keys()].map(i => {
    const displayed_row = props.flipDirection ? i : size - 1 - i;

    return (
      <svg key={i*2}
        viewBox="0 0 14 5"
        fontFamily="Century Gothic"
        className="description description-horizontal"
        style={{
          gridRow: props.gridRow,
          gridColumn: displayed_row + 2
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
      viewBox="0 0 5 14"
      fontFamily="Century Gothic"
      className="description description-vertical"
      style={
        {
          "gridRow":    props.displayedRow,
          "gridColumn": props.displayedCol,
        }
      }>
      <text x="50%" y="50%" fontSize="3.5" dominantBaseline="middle" textAnchor="middle">{String.fromCharCode('a'.charCodeAt() + props.i)}</text>
    </svg>
  )
}

function VerticalDescriptions(props) {
  const descriptions = [...Array(8).keys()].map(i => {
    const displayed_row = props.flipDirection ? i : props.size - 1 - i;

    return (
      <React.Fragment key={"fragment" + i}>
        <VerticalDescription i={i} key={"first" + i}  displayedRow={displayed_row + 2} displayedCol={1}/>
        <VerticalDescription i={i} key={"second" + i} displayedRow={displayed_row + 2} displayedCol={10}/>
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
  const flip_direction = props.flipDirection;

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

            const displayed_row = flip_direction ? size - 1 - row : row;
            const displayed_col = flip_direction ? size - 1 - col : col;

            return <Square
              key={i}
              i={i}
              value={props.squares[i]}
              onClick={() => props.onClick(i)}
              background={background}
              displayedRow={displayed_row}
              displayedCol={displayed_col}
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

export default function Board(props) {
  return (
    <div className="game-board-outermost">
      <BoardInner {...props}/>

      <HorizontalDescriptions gridRow={1} {...props}/>
      <VerticalDescriptions {...props}/>
      <HorizontalDescriptions gridRow={10} {...props}/>
    </div>
  );
}

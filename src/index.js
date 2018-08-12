import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BLACK, WHITE} from './pieces.js';

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
function Board(props) {
  const size = props.size;
  const rows = [...Array(size).keys()].map((_, row) => {
    return(
      <div key={row} className="board-row">
        {
          [...Array(size).keys()]
          .map((_, col) => {
            const i = row * size + col;

            let background;
            if (props.markedIndices.includes(i)) {
              background = "marked";
            } else if ((i + row) % 2 == 0) {
              background = "white";
            } else {
              background = "black";
            }

            console.log(i)

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
    );
  });

  return (
    <div>
      {rows}
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: this.initPieces(),
      }],
      player1IsNext: true,
      turnCount: 0,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.turnCount];
    const winner = calculateWinner(current.squares, this.props.board_size);

    let status;
    if (winner && winner.winner) {
      status = 'Winner: ' + winner.winner;
    } else if (winner && winner.draw) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + this.playerString();
    }

    let marked_indices;
    if (winner && winner.indices) {
      marked_indices = winner.indices;
      console.log(marked_indices)
    } else {
      marked_indices = [];
    }

    const moves = history
    .filter((step, move) => move < history.length - 1)
    .map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            size={this.props.board_size}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            markedIndices={marked_indices}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  initPieces() {
    const board_size = this.props.board_size;
    return Array(board_size*board_size).fill(null).map((_,idx) => {
      const row = Math.floor(idx / board_size);
      const col = idx % board_size;

      console.log(row)

      const pieces = ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'];

      if (col == 0) { return BLACK[pieces[row]]; }
      if (col == 1) { return BLACK.PAWN; }
      if (col == 6) { return WHITE.PAWN; }
      if (col == 7) { return WHITE[pieces.reverse()[row]]; }

      return null;
    });
  }

  playerString() {
    return this.state.player1IsNext ? 'X' : 'O';
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.turnCount + 1);
    const current = history[history.length - 1];

    if (calculateWinner(current.squares, this.props.board_size) || current.squares[i]) {
      return;
    }

    const squares = current.squares.slice();
    squares[i] = this.playerString();
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      player1IsNext: !this.state.player1IsNext,
      turnCount: history.length,
    });
  }
}

function calculateWinner(squares, board_size) {
  // generate all possible index lists
  const rows_indices = [...Array(board_size).keys()]
  .map(x => [...Array(board_size).keys()].map(y => y + board_size*x));

  const columns_indices = [...Array(board_size).keys()]
  .map(x => [...Array(board_size*board_size).keys()].filter((_,i) => i % board_size === x));

  const top_left = [...Array(board_size).keys()]
  .map(x => x*board_size+x);

  const top_right = [...Array(board_size).keys()]
  .map(x => (x+1)*board_size - 1 - x)

  // concat all possible index lists
  const indices = rows_indices.concat(columns_indices, [top_left, top_right]);

  // check if for any of them all elements in square are the same and not null
  const matching_index = indices
  .map(indices => indices
    .map(x => squares[x])
    .every((elem,_,all) => elem && elem === all[0]))
  .indexOf(true);

  // return winner and indices if found
  if (matching_index > -1) {
    const matching_indices = indices[matching_index];
    return {indices: matching_indices, winner: squares[matching_indices[0]]}
  }

  // check for draw
  const draw = squares.every(x => x);
  if (draw) {
    return {draw: true}
  }

  return null;
}

// ========================================

ReactDOM.render(
  <React.StrictMode>
  <Game
    board_size={8}
  />
  </React.StrictMode>,
  document.getElementById('root')
);

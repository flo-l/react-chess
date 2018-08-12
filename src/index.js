import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BLACK, WHITE} from './pieces.js';
import {possibleMoves, getIndex, getRow, getCol, getColor} from './chess_helpers.js';

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
        playerState: [this.initPlayerState(), this.initPlayerState()],
      }],
      whiteIsNext: true,
      turnCount: 0,
      selected: null,
      possibleMoves: [],
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.turnCount];
    const winner = calculateWinner(current.squares, this.props.board_size);
    const selected = this.state.selected;
    const possible_moves = this.state.possibleMoves;

    let status;
    if (winner && winner.winner) {
      status = 'Winner: ' + winner.winner;
    } else if (winner && winner.draw) {
      status = 'Draw';
    } else {
      status = 'Next player: ' + this.playerString();
    }

    let marked_indices = {};
    if (winner && winner.indices) {
      marked_indices = winner.indices;
    } else if (selected !== null) {
      marked_indices[selected] = "selected";
      possible_moves.forEach(move => {
        marked_indices[move] = "possible_move"
      });
    }

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
        </div>
      </div>
    );
  }

  initPieces() {
    const board_size = this.props.board_size;
    return Array(board_size*board_size).fill(null).map((_,idx) => {
      const row = getRow(idx);
      const col = getCol(idx);
      const pieces = ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'];

      if (col === 0) { return BLACK[pieces[row]]; }
      if (col === 1) { return BLACK.PAWN; }
      if (col === 6) { return WHITE.PAWN; }
      if (col === 7) { return WHITE[pieces.reverse()[row]]; }

      return null;
    });
  }

  initPlayerState() {
    return {
      kingMoved: false,
      leftRookMoved: false,
      rightRookMoved: false,
    }
  }

  playerColor() {
    return this.state.whiteIsNext ? WHITE : BLACK;
  }

  playerString() {
    return this.playerColor() === WHITE ? 'White' : 'Black';
  }

  handleClick(i) {
    const board_size = this.props.board_size
    const history = this.state.history.slice(0, this.state.turnCount + 1);
    const current = history[history.length - 1];

    // ignore invalid clicks
    if (calculateWinner(current.squares, board_size)) { return; }

    if (this.state.selected !== null && this.state.possibleMoves.includes(i)) {
      // make the move
      // TODO change player state

      const playerState = current.playerState.slice();
      const squares = current.squares.slice();
      squares[i] = squares[this.state.selected];
      squares[this.state.selected] = null;
      this.setState({
        history: history.concat([{
          squares: squares,
          playerState: playerState,
        }]),
        whiteIsNext: !this.state.whiteIsNext,
        turnCount: history.length,
        selected: null,
        possibleMoves: [],
      });
    } else {
      if (this.playerColor() !== getColor(current.squares[i])) { return; }

      const playerState = this.playerColor() === WHITE ? current.playerState[0] : current.playerState[1];
      const gameState = {
        ...playerState,
        squares: current.squares,
        playerColor: this.playerColor()
      };
      const possible_moves = possibleMoves(gameState, i);

      // mark piece
      this.setState({selected: i, possibleMoves: possible_moves});
    }
  }
}

function calculateWinner(squares, board_size) {
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

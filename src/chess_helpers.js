import {BLACK, WHITE} from './pieces.js';

export function getIndex(row, col) {
  if (row >= 0 && row < 8 && col >= 0 && col < 8) {
    return row * 8 + col;
  }
}

export function getRow(idx) {
  const row = Math.floor(idx / 8);
  if (row >= 0 && row < 8) { return row; }
}

export function getCol(idx) {
  const col = idx % 8;
  if (col >= 0 && col < 8) { return col; }
}

export function getColor(piece) {
  if (Object.values(WHITE).includes(piece)) { return WHITE; }
  if (Object.values(BLACK).includes(piece)) { return BLACK; }
}

function invertColor(color) {
  if (color === WHITE) {
    return BLACK;
  } else if (color === BLACK) {
    return WHITE;
  }
}

export class ChessState {
  constructor(props) {
    this.squares = ChessState.initPieces();
    this.playerState = [ChessState.initPlayerState(), ChessState.initPlayerState()];
    this.whiteIsNext = true;
    this.turnCount = 0;
    this.possibleMoves = {};

    Object.assign(this, props);
  }

  static initPieces() {
    const board_size = 8;
    const squares = Array(board_size*board_size).fill(null).map((_,idx) => {
      const row = getRow(idx);
      const col = getCol(idx);
      const pieces = ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'];

      if (col === 0) { return BLACK[pieces.reverse()[row]]; }
      if (col === 1) { return BLACK.PAWN; }
      if (col === 6) { return WHITE.PAWN; }
      if (col === 7) { return WHITE[pieces[row]]; }

      return null;
    });

    return squares;
  }

  static initPlayerState() {
    return {
      kingMoved: false,
      row0RookMoved: false,
      row7RookMoved: false,
      pawnMoved: null,
    }
  }

  getPossibleMoves(i) {
    if (!this.possibleMoves.hasOwnProperty(i)) {
      this.possibleMoves[i] = possibleMoves(this, i);
    }

    return this.possibleMoves[i];
  }

  playerColor() {
    return this.whiteIsNext ? WHITE : BLACK;
  }

  playerString() {
    return this.whiteIsNext ? 'white' : 'black';
  }

  currentPlayerNumber() {
    return this.whiteIsNext ? 0 : 1;
  }

  otherPlayerNumber() {
    return this.whiteIsNext ? 1 : 0;
  }

  currentPlayerState() {
    return this.playerState[this.currentPlayerNumber()];
  }

  otherPlayerState() {
    return this.playerState[this.otherPlayerNumber()];
  }

  belongsToCurrentPlayer(i) {
    return Object.values(this.playerColor()).includes(this.squares[i]);
  }

  // this returns a new chess state with the move made
  makeMove(from, to) {
    console.assert(this.getPossibleMoves(from).includes(to));

    const new_squares = this.squares.slice();
    new_squares[to] = this.squares[from];
    new_squares[from] = null;

    const new_player_state = JSON.parse(JSON.stringify(this.playerState)); // well, it's a hack for deep copying..

    // update playerState
    const row = getRow(from);
    const col = getCol(from);
    const current_player_state = new_player_state[this.currentPlayerNumber()];
    if (this.squares[from] === WHITE.ROOK || this.squares[from] === BLACK.ROOK) {
      const first_col = this.playerColor() === WHITE ? 7 : 0;

      if (row === 0 && col === first_col)
      {
        current_player_state.row0RookMoved = true;
      } else if (row === 7 && col === first_col) {
        current_player_state.row7RookMoved = true;
      }
    }

    if ((this.squares[from] === WHITE.PAWN && col === 6) || (this.squares[from] === BLACK.PAWN && col === 1)) {
      current_player_state.pawnMoved = row;
    } else {
      current_player_state.pawnMoved = null;
    }

    current_player_state.kingMoved = current_player_state.kingMoved || this.squares[from] === WHITE.KING || this.squares[from] === BLACK.KING;

    // handle en passant
    if (this.squares[from] === this.playerColor().PAWN && freeField(this.squares, to) && getRow(from) !== getRow(to))
    {
      new_squares[getIndex(getRow(to), getCol(from))] = null;
    }

    // handle castling
    const delta_row = getRow(from) - getRow(to);
    if (this.squares[from] === this.playerColor().KING && Math.abs(delta_row) === 2) {
      if (delta_row < 0) {
        current_player_state.row7RookMoved = true;
        new_squares[getIndex(7, col)] = null;
        new_squares[getIndex(row + 1, col)] = this.playerColor().ROOK;
      } else {
        current_player_state.row0RookMoved = true;
        new_squares[getIndex(0, col)] = null;
        new_squares[getIndex(row - 1, col)] = this.playerColor().ROOK;
      }
    }

    const new_props = {
      squares: new_squares,
      whiteIsNext: !this.whiteIsNext,
      playerState: new_player_state,
      turnCount: this.turnCount + 1,
      possibleMoves: {}
    }

    return new ChessState(new_props);
  }

  calculateWinner() {
    return false;
  }
}

// returns the possible moves for a piece by a player
function possibleMoves(chessState, idx) {
  const possible_pieces = chessState.playerColor();
  const squares = chessState.squares;
  const piece = squares[idx];

  if (Object.values(possible_pieces).includes(piece))
  {
    return moveCheck[piece](chessState, idx);
  }

  return [];
}

const moveCheck = {
  // black
  '♚': kingPossibleMoves,
  '♛': queenPossibleMoves,
  '♜': rookPossibleMoves,
  '♝': bishopPossibleMoves,
  '♞': knightPossibleMoves,
  '♟': pawnPossibleMoves,

  // white
  '♔': kingPossibleMoves,
  '♕': queenPossibleMoves,
  '♖': rookPossibleMoves,
  '♗': bishopPossibleMoves,
  '♘': knightPossibleMoves,
  '♙': pawnPossibleMoves,
}

function pawnPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const row = getRow(idx);
  const col = getCol(idx);
  const playerColor = getColor(squares[idx]);

  let direction;
  if   (playerColor === WHITE) { direction = -1; }
  else                         { direction =  1; }

  let possible_moves = [];

  // normal movement
  const i = getIndex(row,col+direction);
  if (i && freeField(squares, i)) {
    possible_moves.push(getIndex(row,col+direction));
  }

  // double move @ start
  if ((direction ===  -1 && col === 6) || (direction === 1 && col === 1)) {
    const i = getIndex(row,col + direction*2);
    if (i && freeField(squares, i)) {
      possible_moves.push(i);
    }
  }

  // check if pawn can attack another piece
  const attack_fields = [-1, 1]
  .map(n => getIndex(row + n, col + direction))
  .filter(idx => enemyPiece(squares, idx, playerColor));

  possible_moves.push(...attack_fields);

  // en passant
  const pawn_moved = chessState.otherPlayerState().pawnMoved;
  const en_passant_col = chessState.playerColor() === WHITE ? 3 : 4;
  if ((pawn_moved === row + 1 || pawn_moved === row - 1) && col === en_passant_col) {
    possible_moves.push(getIndex(pawn_moved, en_passant_col + direction));
  }

  return possible_moves;
}

function knightPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const row = getRow(idx);
  const col = getCol(idx);
  const playerColor = getColor(squares[idx]);

  return [[1, 2], [2, 1]].map(deltas => {
    const delta_row = deltas[0];
    const delta_col = deltas[1];
    return [
      getIndex(row + delta_row, col + delta_col),
      getIndex(row - delta_row, col + delta_col),
      getIndex(row + delta_row, col - delta_col),
      getIndex(row - delta_row, col - delta_col),
    ];
  })
  .reduce((acc, val) => acc.concat(val), [])
  .filter(idx => idx && !ownPiece(squares, idx, playerColor));
}

function bishopPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const possible_moves = [];

  possible_moves.push(...withDeltas(squares, idx,  1,  1));
  possible_moves.push(...withDeltas(squares, idx, -1,  1));
  possible_moves.push(...withDeltas(squares, idx,  1, -1));
  possible_moves.push(...withDeltas(squares, idx, -1, -1));

  return possible_moves;
}

function rookPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const possible_moves = [];

  possible_moves.push(...withDeltas(squares, idx,  1,  0));
  possible_moves.push(...withDeltas(squares, idx, -1,  0));
  possible_moves.push(...withDeltas(squares, idx,  0,  1));
  possible_moves.push(...withDeltas(squares, idx,  0, -1));

  return possible_moves;
}

function queenPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const possible_moves = [];

  possible_moves.push(...withDeltas(squares, idx,  1,  1));
  possible_moves.push(...withDeltas(squares, idx, -1,  1));
  possible_moves.push(...withDeltas(squares, idx,  1, -1));
  possible_moves.push(...withDeltas(squares, idx, -1, -1));

  possible_moves.push(...withDeltas(squares, idx,  1,  0));
  possible_moves.push(...withDeltas(squares, idx, -1,  0));
  possible_moves.push(...withDeltas(squares, idx,  0,  1));
  possible_moves.push(...withDeltas(squares, idx,  0, -1));

  return possible_moves;
}

function kingPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const row = getRow(idx);
  const col = getCol(idx);
  const playerColor = getColor(squares[idx]);
  const playerState = chessState.currentPlayerState();

  const moves = [
    getIndex(row + 0, col + 1),
    getIndex(row + 1, col + 1),
    getIndex(row + 1, col + 0),
    getIndex(row + 1, col - 1),
    getIndex(row + 0, col - 1),
    getIndex(row - 1, col - 1),
    getIndex(row - 1, col + 0),
    getIndex(row - 1, col + 1),
  ].filter(idx => idx && !ownPiece(squares, idx, playerColor));

  // castling
  if (!playerState.kingMoved && !playerState.row0RookMoved) {
    const fields_free = ![...Array(row - 1).keys()].some(i => !freeField(squares, getIndex(i + 1, col)));
    if (fields_free) {
      moves.push(getIndex(row - 2, col));
    }
  }

  if (!playerState.kingMoved && !playerState.row7RookMoved) {
    const fields_free = ![...Array(8 - row - 2).keys()].some(i => !freeField(squares, getIndex(i + row + 1, col)));
    if (fields_free) {
      moves.push(getIndex(row + 2, col));
    }
  }

  return moves;
}

function withDeltas(squares, idx, row_dir, col_dir) {
  const row = getRow(idx);
  const col = getCol(idx);
  const playerColor = getColor(squares[idx]);
  const possible_moves = [];

  for (let x = 1; x < 8; x++) {
    const i = getIndex(row + x * row_dir, col + x * col_dir);
    if (!i || ownPiece(squares, i, playerColor)) { break; }
    possible_moves.push(i);
    if (enemyPiece(squares, i, playerColor)) { break; }
  }

  return possible_moves;
}

function enemyPiece(squares, idx, ownColor) {
  return getColor(squares[idx]) === invertColor(ownColor);
}

function ownPiece(squares, idx, ownColor) {
  return getColor(squares[idx]) === ownColor;
}

function freeField(squares, idx) {
  return squares[idx] === null;
}

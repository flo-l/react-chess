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

// returns the possible moves for a piece by a player
export function possibleMoves(squares, playerWhite, idx) {
  const possible_pieces = playerWhite ? WHITE : BLACK;
  const piece = squares[idx];

  if (Object.values(possible_pieces).includes(piece))
  {
    return moveCheck[piece](squares, idx);
  }

  return [];
}

const moveCheck = {
  // black
  '♚': null,
  '♛': null,
  '♜': null,
  '♝': null,
  '♞': null,
  '♟': pawnPossibleMoves,

  // white
  '♔': null,
  '♕': null,
  '♖': null,
  '♗': null,
  '♘': null,
  '♙': pawnPossibleMoves,
}

function pawnPossibleMoves(squares, idx) {
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

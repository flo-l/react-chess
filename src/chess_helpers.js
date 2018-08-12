import {BLACK, WHITE} from './pieces.js';

export function getIndex(row, col) {
  return row * 8 + col;
}

export function getRow(idx) {
  return Math.floor(idx / 8);
}

export function getCol(idx) {
  return idx % 8;
}

export function getColor(squares, idx) {
  const piece = squares[idx];
  if (Object.values(WHITE).includes(piece)) { return WHITE; }
  if (Object.values(BLACK).includes(piece)) { return BLACK; }
}

// returns the possible moves for a piece by a player
export function possibleMoves(squares, playerWhite, idx) {
  const possible_pieces = playerWhite ? WHITE : BLACK;
  const piece = squares[idx];

  if (Object.values(possible_pieces).includes(piece))
  {
    return [0];
  }

  return [];
}

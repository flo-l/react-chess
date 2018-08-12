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

// returns the possible moves for a piece by a player
export function possibleMoves(squares, playerWhite, row, col) {
  const possiblePieces = playerWhite ? WHITE : BLACK;
  const i = getIndex(row, col);
  const piece = squares[i];

  //if (possiblePieces.properties)

  return [];
}

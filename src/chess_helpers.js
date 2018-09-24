import {BLACK, WHITE, FEN} from './pieces.js';

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

export function getFieldName(row, col) {
  return String.fromCharCode(7 - row + "a".charCodeAt(0)) + col.toString();
}

export function getIndexFromFieldName(field_name) {
  const row = "a".charCodeAt(0) - field_name.charCodeAt(0) + 7;
  const col = parseInt(field_name[1], 10);

  return getIndex(row, col);
}

export function getFrom(move_string) {
  return getIndexFromFieldName(move_string.slice(0, 2));
}

export function getTo(move_string) {
  return getIndexFromFieldName(move_string.slice(2));
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
      const pieces = ['ROOK', 'KNIGHT', 'BISHOP', 'KING', 'QUEEN', 'BISHOP', 'KNIGHT', 'ROOK'];

      if (col === 0) { return BLACK[pieces[row]]; }
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

  enemyColor() {
    return !this.whiteIsNext ? WHITE : BLACK;
  }

  playerString() {
    return this.whiteIsNext ? 'white' : 'black';
  }

  enemyString() {
    return this.whiteIsNext ? 'black' : 'white';
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

  fen() {
    // positions
    const pos = Array(8).fill().map((_,col) => {
      return Array(8).fill().map((_,row) => {
        const idx = getIndex(7-row, col);
        const piece = this.squares[idx];
        if (piece) {
          return FEN[piece];
        } else {
          return null;
        }
      }).reduce((acc, elem) => {
        if (elem === null) {
          if (!acc.str.endsWith(acc.count.toString())) {
            acc.str = acc.str + acc.count.toString();
          }
          acc.count += 1;
          acc.str = acc.str.slice(0, -1) + acc.count.toString();
        } else {
          acc.count = 0;
          acc.str = acc.str + elem;
        }

        return acc;
      }, {count: 0, str: ""}).str;
    }).join("/");

    // active color
    const active = this.whiteIsNext ? 'w' : 'b';

    // castling
    let castling = [
      this.playerState[0].row0RookMoved ? null: 'K',
      this.playerState[0].row7RookMoved ? null: 'Q',
      this.playerState[1].row0RookMoved ? null: 'k',
      this.playerState[1].row7RookMoved ? null: 'q',
    ].join("");

    if (castling === "") { castling = "-" }

    // en passant
    let en_passant;
    if (this.otherPlayerState().pawnMoved !== null) {
      const col = this.whiteIsNext ? 6 : 3;
      en_passant = getFieldName(this.otherPlayerState().pawnMoved, col);
    } else {
      en_passant = "-";
    }

    // halfmoves
    const halfmoves = 0; // TODO this is not implemented

    // fullmoves
    const fullmoves = Math.floor(this.turnCount / 2);

    return [pos, active, castling, en_passant, halfmoves, fullmoves].join(" ");
  }

  // by enemy of ownColor
  isUnderAttack(i, ownColor = this.playerColor()) {
    const fictionalSquares = this.squares.slice();
    fictionalSquares[i] = ownColor.PAWN;
    const fictionalState = this.setNextPlayer({squares: fictionalSquares});

    return fictionalState.squares
      .map((_, idx) => idx)
      .filter(idx => enemyPiece(fictionalState.squares, idx, ownColor))
      .map(idx => possibleMovesWithoutCheck(fictionalState, idx))
      .reduce((acc, ids) => acc.concat(ids), [])
      .some(x => x === i);
  }

  // king of ownColor is being attacked
  isCheck(ownColor = this.playerColor()) {
    const king = ownColor.KING;

    return this.squares
      .map((x,i) => [x,i])
      .filter(x => x[0] === king)
      .some(x => this.isUnderAttack(x[1], ownColor));
  }

  // make a move in algebraic notation (an)
  makeMoveAn(an) {
    return this.makeMove(getFrom(an), getTo(an));
  }

  // this returns a new chess state with the move made
  makeMove(from, to) {
    const new_squares = this.squares.slice();
    const row = getRow(from);
    const col = getCol(from);

    // move pieces
    new_squares[to] = this.squares[from];
    new_squares[from] = null;

    // create new player state
    const new_player_state = JSON.parse(JSON.stringify(this.playerState)); // well, it's a hack for deep copying..

    // update playerState
    // 1. check if rooks or the king were moved or captured
    new_player_state[0].row0RookMoved = new_player_state[0].row0RookMoved || new_squares[getIndex(0,7)] !== WHITE.ROOK;
    new_player_state[0].row7RookMoved = new_player_state[0].row7RookMoved || new_squares[getIndex(7,7)] !== WHITE.ROOK;
    new_player_state[0].kingMoved     = new_player_state[0].kingMoved     || new_squares[getIndex(3,7)] !== WHITE.KING;

    new_player_state[1].row0RookMoved = new_player_state[1].row0RookMoved || new_squares[getIndex(0,0)] !== BLACK.ROOK;
    new_player_state[1].row7RookMoved = new_player_state[1].row7RookMoved || new_squares[getIndex(7,0)] !== BLACK.ROOK;
    new_player_state[1].kingMoved     = new_player_state[1].kingMoved     || new_squares[getIndex(3,0)] !== BLACK.KING;

    // 2. save if pawn was moved
    const current_player_state = new_player_state[this.currentPlayerNumber()];
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
      playerState: new_player_state,
    }

    return this.setNextPlayer(new_props);
  }

  // returns undefined if no promotion is pending, the index of the field where the promotion happens otherwise
  promotionPending() {
    const promotion_col = this.whiteIsNext ? 7 : 0;
    const promotion_index = [...Array(8).keys()]
      .map(row => getIndex(row, promotion_col))
      .find(i => this.squares[i] === this.enemyColor().PAWN);

    return promotion_index;
  }

  // returns a new chess state with the promotion executed
  executePromotion(piece) {
    const promotion_index = this.promotionPending();
    console.assert(promotion_index !== undefined);
    const new_squares = this.squares.slice();
    new_squares[promotion_index] = piece;

    const new_props = {
      squares: new_squares,
      possibleMoves: {}
    }

    return new ChessState(Object.assign({}, this, new_props));
  }

  calculateWinner() {
    const squares = this.squares;
    const ownColor = this.playerColor();

    const move_possible = this.squares
      .map((_, i) => i)
      .filter(i => ownPiece(squares, i, ownColor))
      .map(i => this.getPossibleMoves(i))
      .some(moves => moves.length > 0);

    if (this.isCheck() && !move_possible) {
      return this.enemyColor();
    } else if (!move_possible)  {
      return 'DRAW';
    } else {
      return null;
    }
  }

  // sets next player without making any move
  setNextPlayer(props) {
    const new_props = {
      squares: this.squares.slice(),
      whiteIsNext: !this.whiteIsNext,
      playerState: JSON.parse(JSON.stringify(this.playerState)),
      turnCount: this.turnCount + 1,
      possibleMoves: {}
    }

    return new ChessState(Object.assign({}, new_props, props));
  }
}

// returns the possible moves for a piece
function possibleMoves(chessState, idx) {
  const row = getRow(idx);
  const col = getCol(idx);
  const squares = chessState.squares;
  const playerState = chessState.currentPlayerState();

  const possible_moves = possibleMovesWithoutCheck(chessState, idx);

  // castling
  if (squares[idx] === WHITE.KING || squares[idx] === BLACK.KING) {
    if (!playerState.kingMoved && !playerState.row0RookMoved && !chessState.isCheck()) {
      const fields_free = ![...Array(row - 1).keys()].some(i => !freeField(squares, getIndex(i + 1, col)));
      if (fields_free && !chessState.isUnderAttack(getIndex(row - 1, col))) {
        possible_moves.push(getIndex(row - 2, col));
      }
    }

    if (!playerState.kingMoved && !playerState.row7RookMoved && !chessState.isCheck()) {
      const fields_free = ![...Array(8 - row - 2).keys()].some(i => !freeField(squares, getIndex(i + row + 1, col)));
      if (fields_free && !chessState.isUnderAttack(getIndex(row + 1, col))) {
        possible_moves.push(getIndex(row + 2, col));
      }
    }
  }

  return possible_moves
    .filter(move => !chessState.makeMove(idx, move).isCheck(chessState.playerColor()));
}

// without check check (haha) and castling
function possibleMovesWithoutCheck(chessState, idx) {
  const piece = chessState.squares[idx];
  if (piece) {
    return moveCheck[piece](chessState, idx);
  } else {
    return [];
  }
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
  if (i !== undefined && freeField(squares, i)) {
    possible_moves.push(getIndex(row,col+direction));
  }

  // double move @ start
  if ((direction ===  -1 && col === 6) || (direction === 1 && col === 1)) {
    const between_index = getIndex(row,col+direction);
    const i = getIndex(row,col + direction*2);
    if (i !== undefined && between_index !== undefined && freeField(squares, between_index) && freeField(squares, i)) {
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
  .filter(idx => idx !== undefined && !ownPiece(squares, idx, playerColor));
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

// without castling
function kingPossibleMoves(chessState, idx) {
  const squares = chessState.squares;
  const row = getRow(idx);
  const col = getCol(idx);
  const playerColor = getColor(squares[idx]);

  return [
    getIndex(row + 0, col + 1),
    getIndex(row + 1, col + 1),
    getIndex(row + 1, col + 0),
    getIndex(row + 1, col - 1),
    getIndex(row + 0, col - 1),
    getIndex(row - 1, col - 1),
    getIndex(row - 1, col + 0),
    getIndex(row - 1, col + 1),
  ].filter(idx => idx !== undefined && !ownPiece(squares, idx, playerColor));
}

function withDeltas(squares, idx, row_dir, col_dir) {
  const row = getRow(idx);
  const col = getCol(idx);
  const playerColor = getColor(squares[idx]);
  const possible_moves = [];

  for (let x = 1; x < 8; x++) {
    const i = getIndex(row + x * row_dir, col + x * col_dir);
    if (i === undefined || ownPiece(squares, i, playerColor)) { break; }
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

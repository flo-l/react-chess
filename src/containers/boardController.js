import { connect } from 'react-redux'
import Board from '../components/board'
import { clickSquare } from '../actions'

const mapStateToProps = state => {
  let marked = Array(64).fill(null);
  if (state.clickSquareReducer.idx !== null) {
    marked[state.clickSquareReducer.idx] = 'selected'
  }

  return {
    markedIndices: marked,
    squares: Array(64).fill(null)
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (idx) => dispatch(clickSquare(idx))
  };
}

const BoardController = connect(
  mapStateToProps,
  mapDispatchToProps
)(Board)

export default BoardController;

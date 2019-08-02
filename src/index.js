import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => {
        console.debug("square(parent) received click event");
        // noinspection JSUnresolvedFunction
        this.props.onClick();
      }}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  MARK_X = "X";
  MARK_O = "O";

  constructor(props) {
    super(props);
    this.state = {
      square: Array(9).fill(null)
    };
    this.turns = 0;
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.square[i]}
        onClick={() => {
          console.debug("board(parent) received click event");
          this.handleClick(i);
        }}
      />
    );
  }

  get_mark_of_current_turn() {
    let result;
    if (this.turns % 2 === 0) {
      result = this.MARK_X;
    } else {
      result = this.MARK_O;
    }
    this.turns += 1;
    return result;
  }

  handleClick(i) {
    let s = this.state.square.slice();
    s[i] = this.get_mark_of_current_turn();
    this.setState({
      square: s
    });
  }

  render() {
    const status = (() => {
      let cur, next;
      if (this.turns % 2 === 0) {
        [cur, next] = [this.MARK_X, this.MARK_O];
      } else {
        [cur, next] = [this.MARK_O, this.MARK_X];
      }
      return <div>
        Curr: <span className="cur-turn-player">{cur}</span>
        <br/>
        Next: <span className="next-turn-player">{next}</span>
      </div>;
      // return "Current: " + cur + ", Next Player: " + next;
    })();

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board/>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game/>,
  document.getElementById('root'),
  () => {
    console.debug("on page render completed.");
  }
);

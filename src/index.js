import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  // noinspection JSUnresolvedVariable
  return (
    /*
     <button className="squares" onClick={() => {
     console.debug("squares(parent) received click event");
     props.onClick();
     }}>
     */
    // without another function wrapper
    // Warning: use this way will misplace the `this` arguments inside the function body of handler
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     turns: 0
  //   };
  // }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => {
          // noinspection JSUnresolvedFunction
          this.props.onClick(i);
        }}
      />
    );
  }


  render() {
    return (
      <div>
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
  MARK_X = "X";
  MARK_O = "O";

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      turns: 0
    };
  }

  static calculate_game_winner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0, n = lines.length; i < n; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  get_mark_of_current_turn() {
    let result;
    if (this.state.turns % 2 === 0) {
      result = this.MARK_X;
    } else {
      result = this.MARK_O;
    }
    this.setState({
      turns: this.state.turns + 1
    });
    return result;
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];

    let s = current.squares.slice();
    // ignoring a click if
    // 1. a Square is already filled
    // 2. all squares are filled(nobody win)
    // 3. someone has won the game
    if (s[i] || this.state.turns >= current.squares.length || Game.calculate_game_winner(current.squares)) {
      return;
    }
    s[i] = this.get_mark_of_current_turn();
    this.setState({
      history: history.concat([{
        squares: s
      }])
    });
  }

  resetGameStatistics() {
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      turns: 0
    });
  }

  render() {
    const history = this.state.history
      , current = history[history.length - 1]
      , is_all_filled = this.state.turns >= current.squares.length
      , winner = Game.calculate_game_winner(current.squares)
      , is_game_end = is_all_filled || winner;

    const status = (() => {
      if (is_all_filled) {
        return "Game over, nobody win";
      }
      if (winner) {
        return <div>Winner: <span className="game-winner">{winner}</span></div>;
      } else {
        let cur, next;
        if (this.state.turns % 2 === 0) {
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
      }
    })();

    return (
      <div className="game">
        <div className={"game-board" + (is_game_end ? " game-end" : "")}>
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{<div className="status">{status}</div>}</div>
          <ol>{/* TODO */}</ol>
        </div>
        <hr/>
        <div className="game-reset">
          <button onClick={() => {
            this.resetGameStatistics();
          }} disabled={this.state.turns === 0}>
            Reset Game
          </button>
        </div>
      </div>
    );
  }
}

// ========================================


ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

const user_name = "Boyce Gao";
const element = (
  <span>Welcome {user_name} </span>
);

ReactDOM.render(
  element,
  document.getElementById('welcome-text')
);

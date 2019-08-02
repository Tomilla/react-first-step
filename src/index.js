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
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  MARK_X = "X";
  MARK_O = "O";

  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      turns: 0
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => {
          console.debug("board(parent) received click event");
          this.handleClick(i);
        }}
      />
    );
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
    let s = this.state.squares.slice();
    // ignoring a click if
    // 1. a Square is already filled
    // 2. all squares are filled(nobody win)
    // 3. someone has won the game
    if (s[i] || this.state.turns >= this.state.squares.length || calculate_game_winner(this.state.squares)) {
      return;
    }
    s[i] = this.get_mark_of_current_turn();
    this.setState({
      squares: s
    });
  }

  render() {
    const status = (() => {
      const is_all_filled = this.state.turns >= this.state.squares.length;
      const winner = calculate_game_winner(this.state.squares);
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
function calculate_game_winner(squares) {
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
  // lines.forEach(function (e) {
  //   const [a, b, c] = e;
  //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
  //     return squares[a];
  //   }
  // });
  return null;
}


ReactDOM.render(
  <Game/>,
  document.getElementById('root'),
  () => {
    console.debug("on page render completed.");
  }
);

const user_name = "Boyce Gao";
const element = (
  <span>Welcome {user_name} </span>
);

ReactDOM.render(
  element,
  document.getElementById('welcome-text')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './react-grid-layout.css';
import './react-resizable.css';
import _ from "lodash"
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

class NoDraggingLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    isDraggable: false,
    isResizable: false,
    items: 50,
    cols: 12,
    rowHeight: 30,
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}



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
      <div className={this.props.className ? this.props.className : ""}>
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
    const history = this.state.history.slice(0, this.state.turns + 1)
    , current = history[history.length - 1];

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

  jumpTo(step) {
  	this.setState({
      turns: step
  	});
  }

  render() {
    const history = this.state.history
      , current = history[this.state.turns]
      , is_all_filled = this.state.turns >= current.squares.length
      , winner = Game.calculate_game_winner(current.squares)
      , is_game_end = is_all_filled || winner
      , moves = history.map((step, move) => {
      	const desc = move
      	? "Goto move #" + move
      	: "Goto game start";

        return (
        	<li key={move}>
        	  <button onClick={() => {this.jumpTo(move)}}>{desc}</button>
        	</li>
        );
      });

    const status = (() => {

      if (winner) {
        return <div>Winner: <span className="game-winner">{winner}</span></div>;
      } else {
        if (is_all_filled) {
          return "Game over, nobody win";
        }
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
        <div className={"game-board reactui-row" + (is_game_end ? " game-end" : "")}>
          <Board
            className="game-board-center"
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="reactui-row reactui-col-space15">
          <div className="game-info reactui-col-sm4">
            <div>{<div className="status">{status}</div>}</div>
          </div>
          <div className="game-progress reactui-col-sm8">
            <ol>
            <li key="reset"><button onClick={() => {
              this.resetGameStatistics();
            }} disabled={this.state.turns === 0}>
              Reset Game
            </button></li>
            {moves}
            </ol>
          </div>
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
  <blockquote>Welcome {user_name} </blockquote>
);

ReactDOM.render(
  element,
  document.getElementById('welcome-text')
);
// require("./test_hook.jsx")(NoDraggingLayout);

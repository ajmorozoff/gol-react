/* eslint-disable react/button-has-type */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/react-in-jsx-scope */
const { Component } = React;
const { render } = ReactDOM;

//TODO: move timeLength into state

class Game extends Component {
    constructor({width, height}) {
        super();
        this.state = {
            width,
            height,
            board: [],
        }
        this.playInterval = null;
        this.timeLength = 500;
    }

    componentDidMount() {
        this.setState({ board: this.makeBoard() });
    }

    makeBoard() {
        return Array(this.state.height).fill(0).map(row => Array(this.state.width).fill(0));
    }

    cellClick = (row, col) => {
        const { board } = this.state;
        let newBoard = board;
        newBoard[row][col] = board[row][col] ? 0 : 1;
        this.setState({ board: newBoard });
    }

    getCell = (row, col) => {
        if (row < 0 || row > (this.height - 1)) {
            throw(`Invalid row @method getCell: row = ${row}`);
        }
        if (col < 0 || col > (this.width - 1)) {
            throw(`Invalid column @method getCell: column = ${col}`);
        }
        return this.state.board[row][col];
    }

    tick = () => {
        const { board } = this.state;
        const newBoard = this.makeBoard();

        board.forEach((row, rowIdx) => {
          row.forEach((col, colIdx) => {
            if (this.getCell(rowIdx, colIdx) && this.livingNeighbors(rowIdx, colIdx) < 2) {
              newBoard[rowIdx][colIdx] = 0;
            }
            else if (this.getCell(rowIdx, colIdx) && this.livingNeighbors(rowIdx, colIdx) > 3) {
              newBoard[rowIdx][colIdx] = 0;
            }
            else if (!this.getCell(rowIdx, colIdx) && this.livingNeighbors(rowIdx, colIdx) === 3) {
              newBoard[rowIdx][colIdx] = 1;
            }
            else if (this.getCell(rowIdx, colIdx)) {
              newBoard[rowIdx][colIdx] = 1;
            }
          })
        })

        this.setState({ board: newBoard });
    }

    livingNeighbors(row, col) {
        let livingCount = 0;
        for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, this.state.height - 1); i++) {
          for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, this.state.width - 1); j++) {
            if (i === row && j === col) {
              continue;
            }
              livingCount += this.getCell(i, j);
          }
        }
        return livingCount;
    }

    playPause = (ev) => {
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
            ev.target.innerHTML = 'Play';
          }
          else {
            this.playInterval = setInterval(this.tick, this.timeLength);
            ev.target.innerHTML = 'Pause';
          }
    }

    randomize = () => {
        let newBoard = this.makeBoard();
        newBoard.forEach((row, rIdx) => {
            row.forEach((col, cIdx) => {
                 newBoard[rIdx][cIdx] = Math.round(Math.random());
              })
        })
        this.setState({board: newBoard});
    }

    clear = () => {
        let newBoard = this.makeBoard();
        this.setState({board: newBoard});
    }

    speedUp = () => {
        if (this.timeLength > 100) {
            this.timeLength -= 100;
            clearInterval(this.playInterval);
            this.playInterval = setInterval(this.tick, this.timeLength);
          }
    }

    speedDown = () => {
        if (this.timeLength < 2000) {
            this.timeLength += 100;
            clearInterval(this.playInterval);
            this.playInterval = setInterval(this.tick, this.timeLength);
          }
    }

    render() {
        const { board } = this.state;
        if (!board.length) {
            return <div>Loading...</div>
        }
        return (
            <div id="container">
                <h1>React Game of Life</h1>
                <table id="board">
                    <Board board={this.state.board} cellClick={this.cellClick} />
                </table>
                <div id="control-panel">
                    <button id="step-btn" onClick={this.tick}>Step</button>
                    <button id="play-btn" onClick={(ev) => {this.playPause(ev)}}>Play</button>
                    <button id="random-btn" onClick={this.randomize}>Randomize Board</button>
                    <button id="clear-btn" onClick={this.clear}>Clear</button>
                    <button id="speed-up" disabled={this.timeLength < 200 || !this.playInterval} onClick={this.speedUp}>Faster</button>
                    <button id="speed-down" disabled={this.timeLength > 1000 || !this.playInterval} onClick={this.speedDown}>Slower</button>
                </div>
            </div>
        )
    }
}

class Board extends Component {
    constructor(props) {
        super();
    }

    render() {
        const { board, cellClick } = this.props;
        return (
            <tbody id="table-body">
                {
                    board.map((row, rIdx) => {
                        return (
                            <tr key={rIdx}>
                            {row.map((col, cIdx) => <Cell key={`${rIdx},${cIdx}`} onClick={() => cellClick(rIdx, cIdx)} isAlive={board[rIdx][cIdx]} />)}
                            </tr>
                        )
                    })
                }
            </tbody>
        )
    }
}

const Cell = (props) => {
    return (
        <td className={props.isAlive ? 'alive' : ''} onClick={props.onClick} />
    )
}

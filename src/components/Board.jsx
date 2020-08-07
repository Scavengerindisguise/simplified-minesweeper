import React, { Component } from 'react';
import Cell from './Cell';

class Board extends Component {
    state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameStatus: "Game in progress",
        mineCount: this.props.mines
    }

    /** Initiate all Board data 
     * @param{number} - get columns
     * @param{number} - get rows
     * @param{number} - get mines
     */
    initBoardData(height, width, mines) {
        let data = this.createEmptyArray(height, width);
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        return data;
    }

    /** Plane Mines on the Board Data 
     * @param{Array} - All row and column blocks with properties
     * @param{number} - get columns
     * @param{number} - get rows
     * @param{number} - get mines
     */
    plantMines(data, height, width, mines) {
        debugger
        console.log(data);
        let randomx, randomy, minesPlanted = 0;
        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(height);
            randomy = this.getRandomNumber(width);
            console.log(randomx,randomy);
            console.log(data[randomx][randomy]);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }
        return data;
    }


    /** Get Random row or column to plant mines */
    getRandomNumber(dimension) {
        let x = Math.random() * 1000;
        console.log(x);
        return Math.floor(x + 1) % dimension;
    }


    /** Get number of mines surrounding the block and update the neighbours property with the value
     * @param{array} - All row and column blocks with properties
     * @param{number} - get columns
     * @param{number} - get rows
     */
    getNeighbours(data, height, width) {
        let updatedData = data;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }

            }
        }
        return updatedData;
    }

    /** Get All the Surrounding Blocks of the clicked event
     * @param{number} - The X position of the current selected block
     * @param{number} - The Y position of the current selected block
     * @param{array} - All row and column blocks with properties
     * 
     */
    traverseBoard(x, y, data) {
        const el = [];
        //up
        if (x > 0) {
            el.push(data[x - 1][y]);
        }
        //down
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
        }
        //left
        if (y > 0) {
            el.push(data[x][y - 1]);
        }
        //right
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }
        // top left
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }
        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }
        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }
        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }
        return el;
    }

    /** Create and empty array with x and y values less than the rows and columns entered
     * @param{number} - rows entered
     * @param{number} - columns entered
     */
    createEmptyArray(height, width) {
        let data = [];
        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false
                };
            }
        }
        return data;
    }

    /** Handle Right Click by Setting the block as flagged
     * @param{object} The event object of the current event required to prevent the default behaviour
     * @param{number} Current X position 
     * @param{number} Current Y position 
     */
    handleContextMenu(event, x, y) {
        event.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;
        let win = false;
        if (updatedData[x][y].isRevealed) return;
        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines++;
        } else {
            updatedData[x][y].isFlagged = true;
            mines--;
        }
        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                this.revealBoard();
                alert("You Win");
            }
        }
        this.setState({
            boardData: updatedData,
            mineCount: mines,
            gameWon: win,
        });

    }

    /** Get All the Mines in the Current Board
     * @param{array} - The Current board data
     */
    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    /** Get All the Flags in the current board
     * @param{array} - The Current Array of Board Data
     */
    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    /** Render the board with the boardData provided in state
     * @param{array} - All row and column blocks with properties
     */
    renderBoard(data) {
        return data.map(row => {
            return row.map(item => {
                return (
                    <div key={item.x * row.length + item.y}>
                        <Cell
                            value={item}
                            onClick={() => this.handleCellClick(item.x, item.y)}
                            cMenu={(e) => this.handleContextMenu(e, item.x, item.y)}
                        />
                        {(row[row.length - 1] === item) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        });
    }

    /** Handle Click Event on Cell block - reveal board if you win or lose and reveal empty block
     * @param{number} - X position of the block clicked
     * @param{number} - Y position of the block clicked
     */
    handleCellClick(x, y) {
        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged) return null;
        // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
            this.setState({ gameStatus: "You Lost." });
            this.revealBoard();
            alert("game over");
        }
        let updatedData = this.state.boardData;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }
        if (this.getHidden(updatedData).length === this.props.mines) {
            this.setState({ gameStatus: "You Win." });
            this.revealBoard();
            alert("You Win");
        }
        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
        });
    }

    /** Get hidden data from block if its not already revealed
     * @param{array} - All row and column blocks with properties
      */
    getHidden(data) {
        let mineArray = [];
        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    /** Reveal board and reveal empty block if value is empty till value is found
     * @param{number} - X position of the block clicked
     * @param{number} - Y position of the block clicked
     * @param{array} - All row and column blocks with properties
     * 
     */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;
    }

    /** Reveal All items on the board after winning or losing */
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }


    render() {
        return (
            <React.Fragment>
                <div className="game-info">
                    <span className="info">
                        Mines: {this.state.mineCount}
                    </span>
                    <br />
                    <span className="info">
                        {this.state.gameStatus}
                    </span>
                </div>
                <div className="board" style={{ gridTemplateColumns: `repeat(${this.props.width},auto)`, maxWidth: this.props.width < 5 ? "200px" : "400px" }}>
                    {this.renderBoard(this.state.boardData)}
                </div>
            </React.Fragment>
        );
    }
}

export default Board;
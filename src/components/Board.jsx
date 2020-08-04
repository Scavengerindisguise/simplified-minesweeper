import React, { Component } from 'react';
import Cell from './Cell';

class Board extends Component {
    state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameStatus: "Game in progress",
        mineCount: this.props.mines
    }

    initBoardData(height, width, mines) {
        let data = this.createEmptyArray(height, width);
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        console.log(data);
        return data;
    }

    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;
        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }
        return data;
    }

    getRandomNumber(dimension) {
        // console.log(Math.floor(Math.random()*1000), Math.floor((Math.random() * 1000) + 1) % dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

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

    traverseBoard(x, y, data) {
        // console.log(x, y, data);
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
        // console.log(el);
        return el;
    }

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
                    isEmpty: false
                };
            }
        }
        // console.log(data);
        return data;
    }


    renderBoard(data) {
        return data.map(row => {
            return row.map(item => {
                // console.log(item);
                return (
                    <div key={item.x * row.length + item.y}>
                        <Cell value={item} onClick={() => this.handleCellClick(item.x, item.y)}/>
                        {(row[row.length - 1] === item) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        });
    }

    handleCellClick(x, y) {
        console.log(x,y);
        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed) return null;
      // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
          this.setState({gameStatus: "You Lost."});
          this.revealBoard();
          alert("game over");
        }
        let updatedData = this.state.boardData;
        updatedData[x][y].isRevealed = true;
        
        if (updatedData[x][y].isEmpty) {
         updatedData = this.revealEmpty(x, y, updatedData);
        }
      if (this.getHidden(updatedData).length === this.props.mines) {
         this.setState({gameStatus: "You Win."});
         this.revealBoard();
         alert("You Win");
        }
        this.setState({
         boardData: updatedData,
         mineCount: this.props.mines,
        });
      }

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

      revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
          if (!value.isRevealed && (value.isEmpty || !value.isMine)) {
            data[value.x][value.y].isRevealed = true;
            if (value.isEmpty) {
              this.revealEmpty(value.x, value.y, data);
            }
          }
        });
        return data;
      }

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
                <div className="board">

                    {this.renderBoard(this.state.boardData)}
                </div>
            </React.Fragment>
        );
    }
}

export default Board;
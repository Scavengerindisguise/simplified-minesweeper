import React, { Component } from 'react';

class Cell extends Component {
    getValue() {
        const {value} = this.props;

        if (this.props.value.isFlagged) {
          return <i className="fa fa-flag" aria-hidden="true"></i>;
        }
        if (value.isMine) {
          return <i className="fa fa-bomb" aria-hidden="true"></i>;
        }
        if (value.neighbour === 0) {
          return null;
        }
        return value.neighbour;
      }

    render() {
        let className = "cell" + (this.props.value.isRevealed ? "" : " hidden") + (this.props.value.isMine && this.props.value.isRevealed ? " is-mine" : "") + 
        (this.props.value.isFlagged ? " is-flag" : "");
        return (
            <div onClick={this.props.onClick} onContextMenu={this.props.cMenu} className={className}>
                {this.getValue()}
            </div>
        );
    }
}

export default Cell;
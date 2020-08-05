import React, { Component } from 'react';
import Board from './Board';
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, Button } from 'reactstrap';

class Game extends Component {
    state = {
        rows: '',
        columns: '',
        height: '',
        width: '',
        mines: 10,
        isModalOpen: true
    }

    handleRowChange = (e) => {
        console.log(e.target.value);
        const value = e.target.value;
        this.setState({ rows: value });
        e.preventDefault();
    }

    handleColumnChange = (e) => {
        console.log(e.target.value);
        const value = e.target.value;
        this.setState({ columns: value });
        e.preventDefault();

    }

    toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            height: this.state.rows,
            width: this.state.columns,
            mines: Math.floor((1/3)*this.state.rows*this.state.columns)
        });
    }


    render() {
        const { height, width, mines } = this.state;
        return (
            <>
                <div>
                    <div className="text-center"><h2>Mine Sweeper</h2></div>
                    <div className="game">
                        {this.state.width !== '' && this.state.height !== '' ? <Board height={height} width={width} mines={mines} /> : 'Enter Number of Rows And Columns'}
                    </div>
                </div>
                <Modal isOpen={this.state.isModalOpen}>
                    <ModalHeader>Login</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="rows">Enter No Of Rows</Label>
                                <Input type="number" onChange={this.handleRowChange} id="rows" name="rows" value={this.state.rows} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="columns">Enter No Of Columns</Label>
                                <Input type="number" onChange={this.handleColumnChange} id="columns" name="columns" value={this.state.columns} />
                            </FormGroup>
                            <Button type="button" onClick={this.toggleModal} color="primary">Start</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default Game;
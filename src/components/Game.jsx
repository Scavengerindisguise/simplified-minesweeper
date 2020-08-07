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
        isModalOpen: true,
        disableStartButton: true
    }

    /** handleRowChange - Update State with number of rows
     * @param{object} - onChange event 
     */
    handleRowChange = (e) => {
        const value = e.target.value;
        this.setState({ rows: value });
        e.preventDefault();
    }

    /** handleRowChange - Update State with number of columns
     * @param{object} - onChange event
     */
    handleColumnChange = (e) => {
        const value = e.target.value;
        this.setState({ columns: value });
        e.preventDefault();

    }

    /** toggleModal - Close Modal on click of start button*/
    toggleModal = () => {
        if((this.state.rows || this.state.columns) > 14){
            this.setState({
                errorMessage: 'Maximum Number of rows and columns exceeded'
            })} else if (this.state.rows > 1 && this.state.columns > 1) {
            this.setState({
                isModalOpen: !this.state.isModalOpen,
                height: this.state.rows,
                width: this.state.columns,
                mines: Math.floor((1 / 3) * this.state.rows * this.state.columns)
            });
        } else {
            this.setState({
                errorMessage: 'Please Select More than 1 row and column'
            });
        }
    }

    getStatus(){
        if(this.state.rows === ''){
            return true;
        } else if(this.state.columns === ''){
            return true;
        }
    }


    render() {
        const { height, width, mines } = this.state;
        return (
            <>
                <div>
                    <div className="text-center"><h2>Mine Sweeper</h2></div>
                    <div className="game text-white">
                        {this.state.width !== '' && this.state.height !== '' ? <Board height={height} width={width} mines={mines} /> : 'Enter Number of Rows And Columns'}
                    </div>
                </div>
                <Modal isOpen={this.state.isModalOpen}>
                    <ModalHeader>Game Data</ModalHeader>
                    <ModalBody>
                        <div className='row justify-content-center'>
                            <div className='col-sm-7'>
                                <Form>
                                    <FormGroup>
                                        <Label htmlFor="rows">Enter No of Rows</Label>
                                        <Input type="number" bsSize="sm" onChange={this.handleRowChange} id="rows" name="rows" value={this.state.rows} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="columns">Enter No of Columns</Label>
                                        <Input type="number" bsSize="sm" onChange={this.handleColumnChange} id="columns" name="columns" value={this.state.columns} />
                                    </FormGroup>
                                </Form>
                                <small className="form-text text-muted">
                                    {this.state.errorMessage}
                                </small>
                                <p></p>
                                <div className='row justify-content-end mr-1'>
                                    <Button type="button" disabled={this.getStatus()} size='sm' onClick={this.toggleModal} color="primary">Start</Button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default Game;
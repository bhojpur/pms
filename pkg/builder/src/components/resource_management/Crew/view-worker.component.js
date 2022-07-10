// Copyright (c) 2018 Bhojpur Consulting Private Limited, India. All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, { Component } from 'react';
import { Modal } from "react-bootstrap";
import DeleteIcon from '@material-ui/icons/Delete';
import cogoToast from "cogo-toast";

import WorkersDataService from "./../../../services/worker.service";

class ViewWorker extends Component {
  constructor(props) {
    super(props);
    this.deleteWorker = this.deleteWorker.bind(this);
    this.state = {
      //crews: [],
      //workers: [],
      //currentIndex: -1,
      //content: "",
      wId: this.props.id,
      fristName: this.props.fName,
      lastName: this.props.lName,
      mobile: this.props.mobile
    };
  }

  deleteWorker() {
    WorkersDataService.delete(this.state.wId)
      .then(response => {
        cogoToast.success("Worker Deleted successfully!");
        console.log(response.data);
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { wId, fristName, lastName, mobile } = this.state;
    //console.log(wId)
    return (
      <div>
        <Modal.Header closeButton>
          <h5>Edit Worker Details</h5>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label htmlFor=""><b>Id:</b> {wId}</label>
            <label htmlFor=""><b>First Name:</b> {fristName}</label>
            <label htmlFor=""><b>Last Name:</b> {lastName}</label>
            <label htmlFor=""><b>Mobile:</b> {mobile}</label>
          </div>
        </Modal.Body>
        <Modal.Footer>

          <button
            type="button"
            className="btn btn-danger"
            data-toggle="modal"
            data-target="#viewWorker"
            onClick={this.deleteWorker}>
            Delete
            <DeleteIcon />
          </button>

          {/* <button 
                type="button" 
                className="btn btn-success">
                  Check Worked Hours
              </button> */}

        </Modal.Footer>
      </div >
    );
  }
}

export default ViewWorker;
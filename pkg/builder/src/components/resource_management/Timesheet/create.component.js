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

import TimesheetDataService from "./../../../services/timesheet.service";

import cogoToast from "cogo-toast";

class CreateTimesheet extends Component {
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeCode = this.onChangeCode.bind(this);
    this.saveTimesheet = this.saveTimesheet.bind(this);
    this.state = {
      crews: [],
      workers: [],
      currentIndex: -1,
      content: "",
      date: "",
      status: "Pending",
      id: this.props.projectId
    };
  }

  //create timesheet
  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }

  onChangeCode(e) {
    this.setState({
      code: e.target.value
    });
  }

  saveTimesheet() {
    var data = {
      date: this.state.date,
      status: "Pending",
      projectId: this.props.projectId,
    };

    TimesheetDataService.create(data)
      .then(response => {
        this.setState({
          date: response.data.date,
          status: response.data.status,
          projectId: response.data.projectId,


        });
        console.log(response.data);
        window.location.reload();
        cogoToast.success("New Timesheet created!");

      })
      .catch(e => {
        console.log(e);
        cogoToast.error("Error!");
      });
  }

  render() {
    // const { crews, currentIndex, id, workers } = this.state;
    var today = new Date().toISOString().split('T')[0];
    //console.log(workers)
    return (
      <div>
        {/*------------------------------------ Add Emp Starts------------------------------------------------------------------ */}

        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">New Timesheet</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body" align="left">

              <div class="container">
                <div class="row">
                  <div className="col-auto">

                    <div className="col-auto">
                      <label>Select Date</label>
                    </div>
                    <div className="col-auto">
                      <input
                        className="form-control"
                        type="date"
                        id="date"
                        name="date"
                        value={this.state.date}
                        min={today}
                        onChange={this.onChangeDate}
                      />
                    </div>
                    <br />

                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={this.saveTimesheet}>
                Create
              </button>
            </div>
          </div>
        </div>
        {/*-------------------------------------------------------- Add Emp Ends----------------------------------------------------------------------*/}
      </div>
    );
  }
}

export default CreateTimesheet;

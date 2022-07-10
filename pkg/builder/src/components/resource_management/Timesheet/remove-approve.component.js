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
import TimesheetDataService from "../../../services/timesheet.service";
import cogoToast from "cogo-toast";

class Approve extends Component {
  constructor(props) {
    super(props);
    this.updateTimesheet = this.updateTimesheet.bind(this);

    this.state = {
      currentStatus: {
        code: this.props.timesheetId,
        status: "Pending",
        aprrovedId: null
      }
    };
  }

  updateTimesheet() {
    var data = {
      status: this.state.currentStatus.status,
      aprrovedId: this.state.currentStatus.aprrovedId,
    };

    TimesheetDataService.update(this.props.timesheetId, data)
      .then(response => {
        this.setState(prevState => ({
          currentStatus: {
            ...prevState.currentStatus,
          }
        }));
        console.log(response.data);
        window.location.reload();
        cogoToast.success("Approval removed!");
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>

        <div className="modal-dialog modal modal-dialog-centered" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">Timesheet</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body text-center">
              <p>Are you sure you want to remove the aproval?</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={this.updateTimesheet}>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Approve;





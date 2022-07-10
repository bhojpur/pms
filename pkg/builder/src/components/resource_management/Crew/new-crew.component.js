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
import cogoToast from "cogo-toast";
import Alert from "react-bootstrap/Alert";

import CrewDataService from "./../../../services/crew.service";

class NewCrew extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.saveCrew = this.saveCrew.bind(this);

    this.state = {
      id: null,
      name: "",
      isTitleValid: -1,
      projectId: this.props.projectId,
      submitted: false
    };
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
    CrewDataService.findValid(e.target.value)
      .then(response => {
        this.setState({
          isTitleValid: response.data.length
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  saveCrew() {

    if (this.state.isTitleValid > 0) {
      cogoToast.error('Crew is already added');
    } else {

      var data = {
        name: this.state.name,
        projectId: this.props.projectId
      };

      CrewDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            name: response.data.name,
            projectId: response.data.projectId,

            submitted: true
          });
          console.log(response.data);
          window.location.reload();
          cogoToast.success("Crew Added successfully!");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  render() {
    const { projectId, isTitleValid } = this.state;
    return (
      <div>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">Create New Crew</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

              <div>

                <label htmlFor="">Enter crew Name</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  id="name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                  name="name" />
                <br />
              </div>

              <div className="form-group">
                {this.state.name == "" ? "" : isTitleValid > 0 ?
                  <Alert variant="danger">
                    Crew is already added
                  </Alert> : ""}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.saveCrew}>Add</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default NewCrew;
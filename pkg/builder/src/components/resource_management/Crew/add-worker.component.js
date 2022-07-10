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
import { Link } from "react-router-dom";

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from "cogo-toast";
import Alert from "react-bootstrap/Alert";

import WorkerDataService from "./../../../services/worker.service";
import CrewDataService from "./../../../services/crew.service";

class AddWorker extends Component {
  constructor(props) {
    super(props);
    this.retrieveCrew = this.retrieveCrew.bind(this);
    this.onChangewId = this.onChangewId.bind(this);
    this.onChangefirstName = this.onChangefirstName.bind(this);
    this.onChangelastName = this.onChangelastName.bind(this);
    this.onChangemobile = this.onChangemobile.bind(this);
    this.onChangecrewId = this.onChangecrewId.bind(this);
    this.saveWorker = this.saveWorker.bind(this);

    this.state = {
      wId: "",
      firstName: "",
      lastName: "",
      mobile: "",
      crewId: "",
      crews: [],
      isNICValid: -1,
      isMobileValid: -1,
      //projectId: this.props.match.params.id
      projectId: 1

    };
  }

  componentDidMount() {
    this.retrieveCrew(1);
  }

  retrieveCrew(id) {
    CrewDataService.getAll(id)
      .then(response => {
        this.setState({
          crews: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangewId(e) {
    this.setState({
      wId: e.target.value
    });

    WorkerDataService.findVaildNIC(e.target.value)
      .then(response => {
        this.setState({
          isNICValid: response.data.length
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangefirstName(e) {
    this.setState({
      firstName: e.target.value
    });
  }

  onChangelastName(e) {
    this.setState({
      lastName: e.target.value
    });
  }

  onChangemobile(e) {
    this.setState({
      mobile: e.target.value
    });

    WorkerDataService.findVaildMobile(e.target.value)
      .then(response => {
        this.setState({
          isMobileValid: response.data.length
        });
      })
      .catch(e => {
        console.log(e);
      });

  }

  onChangecrewId(e) {
    this.setState({
      crewId: e.target.value
    });
  }

  saveWorker() {
    if (this.state.isNICValid > 0) {
      cogoToast.error('NIC is already added');
    } else if (this.state.wId.length != 10) {
      cogoToast.error('Invalid NIC number');
    } else if (this.state.mobile.length !== 10) {
      cogoToast.error('Invalid mobile number');
    } else if (this.state.isMobileValid > 0) {
      cogoToast.error('Mobile number is already added');
    } else {

      var data = {
        wId: this.state.wId,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        mobile: this.state.mobile,
        crewId: this.state.crewId,
        projectId: this.props.projectId
      };


      WorkerDataService.create(data)
        .then(response => {
          this.setState({
            wId: response.data.wId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            mobile: response.data.mobile,
            crewId: response.data.crewId,
            projectId: this.state.projectId,

          });
          console.log(response.data);
          this.props.history.push('/crew/1');
          cogoToast.success("Worker added successfully!");
        })
        .catch(e => {
          console.log(e);
        });

    }
  }

  render() {
    const { crews, projectId, isNICValid, isMobileValid } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col" >
            <h2>ADD NEW WORKER</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/" + projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/crew/" + projectId} aria-current="page">
                Crews
              </Link>
              <Link color="textPrimary" to={"/addWorker/" + projectId} aria-current="page">
                Add New Worker
              </Link>
            </Breadcrumbs>
          </div>
        </div>
        <hr />
        <br />

        <div class="container">
          <div class="row">
            <div class="col-6">
              <label htmlFor="">First Name</label>
              <input
                className="form-control"
                type="text"
                required
                id="firstName"
                value={this.state.firstName}
                onChange={this.onChangefirstName}
                name="firstName" />
            </div>

            <div class="col-6">
              <label htmlFor="">Last Name</label>
              <input
                className="form-control"
                type="text"
                required
                id="lastName"
                value={this.state.lastName}
                onChange={this.onChangelastName}
                name="lastName" />
            </div>
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div class="col-6">
              <label htmlFor="">NIC</label>
              <input
                className="form-control"
                type="text"
                required
                id="wId"
                value={this.state.wId}
                onChange={this.onChangewId}
                name="wId" />

              <div className="form-group">
                {this.state.wId.length === 10 || this.state.wId.length === 0 ?
                  (isNICValid > 0) ?
                    <Alert variant="danger">
                      Worker is already added
                    </Alert> : "" :
                  <Alert variant="danger">
                    Invalid NIC number
                  </Alert>}
              </div>

            </div>

            <div class="col-6">
              <label htmlFor="">Mobile Number</label>
              <input
                className="form-control"
                type="number"
                required
                id="mobile"
                value={this.state.mobile}
                onChange={this.onChangemobile}
                name="mobile" />

              <div className="form-group">
                {this.state.mobile.length === 10 || this.state.mobile.length === 0 ?
                  (isMobileValid > 0) ?
                    <Alert variant="danger">
                      Mobile number is already added
                    </Alert> : "" :
                  <Alert variant="danger">
                    Invalid mobile number
                  </Alert>}
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="row">
            <div class="col-6">
              <label htmlFor="">Select crew</label>
              <select
                className="form-control"
                name="crew"
                id="crew"
                value={this.state.crewId}
                onChange={this.onChangecrewId}>
                <option value="--">- - </option>

                {crews && crews.map((crew, index) => (
                  <option value={crew.id}>{crew.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary m-3 pl-3 pr-3"
          onClick={this.saveWorker}>
          Add
        </button>
      </div>

    );
  }
}

export default AddWorker;
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
import Table from 'react-bootstrap/Table'
import { Link } from "react-router-dom";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from "cogo-toast";

import CrewDataService from "../../../services/crew.service";
import WorkersDataService from "../../../services/worker.service";
import WorkedHoursDataService from "./../../../services/worked-hours.service";
import TimesheetDataService from "./../../../services/timesheet.service";

class Workers extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.retrieveCrew = this.retrieveCrew.bind(this);
    this.retrieveWorkers = this.retrieveWorkers.bind(this);
    this.retrieveWorkedHours = this.retrieveWorkedHours.bind(this);

    this.setActiveWorker = this.setActiveWorker.bind(this);
    this.addWorker = this.addWorker.bind(this);
    this.state = {
      crews: [],
      workers: [],
      workedHoursID: [],
      currentWorker: "",
      workedHours: "",
      currentIndex: -1,
      content: "",
      searchTitle: "",
      isOpen: false,
      id: this.props.match.params.id,
      code: this.props.match.params.code
    };

  }

  componentDidMount() {
    this.retrieveCrew(this.props.match.params.id);
    this.retrieveWorkers(this.props.match.params.id);
    this.retrieveWorkedHours(this.props.match.params.code);
  }

  retrieveTimesheet(id) {
    TimesheetDataService.get(id)
      .then(response => {
        this.setState({
          timesheet: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveWorkedHours(id) {
    WorkedHoursDataService.getTimesheetDetails(id)
      .then(response => {
        this.setState({
          workedHours: response.data
        });
        console.log("workedHOurs")
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  retrieveWorkers(id) {
    WorkersDataService.getAll(id)
      .then(response => {
        this.setState({
          workers: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  searchTitle() {
    CrewDataService.findByTitle(this.state.searchTitle)
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

  setActiveWorker(worker, index) {
    this.setState({
      currentWorker: worker,
      currentIndex: index
    });
    this.addWorker()
  }

  addWorker(wId) {
    var data = {
      workerId: wId,
      timesheetId: this.state.code,
    };
    console.log(data)

    WorkedHoursDataService.create(data)
      .then(response => {
        this.setState({
          workerId: response.data.workerId,
          timesheetId: response.data.timesheetId,
        });
        console.log(response.data);
        window.location.reload();
        cogoToast.success("Worker Added successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    this.refs.btn.setAttribute("disabled", "disabled");
  }

  render() {
    const { crews, id, workers, searchTitle, code, workedHours, workedHoursID } = this.state;
    workedHours && workedHours.map((workedHour) => (
      workedHoursID.includes(workedHour.workerWId) ? null : workedHoursID.push(workedHour.workerWId)));

    return (
      <div>
        <div className="row">
          <div className="col" >
            <h2>ADD WORKERS</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/" + id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/timesheet/" + id} aria-current="page">
                Timesheet
              </Link>
              <Link color="textPrimary" to={"/viewTimesheet/" + id + "/" + code} aria-current="page">
                Manage Timesheet
              </Link>
              <Link color="textPrimary" to={"/addWorkers/" + id + "/" + code} aria-current="page">
                Add Workers
              </Link>
            </Breadcrumbs>
          </div>
        </div>
        <hr />
        <br />

        <div className="row">
          <div className="col-md-12">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Crew Name"
                value={searchTitle}
                onChange={this.onChangeSearchTitle}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.searchTitle}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />

        <div>
          <h5 className="m-3">Select crew</h5>
          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="status" role="tabpanel" aria-labelledby="allmeetings">

              <div class="accordion" id="accordionExample">

                {crews && crews.map((crew, index) => (
                  <div class="card" key={crew.id}>
                    <div class="card-header" id="headingOne">
                      <h2 class="mb-0">

                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls="collapseOne">{crew.name}</button>

                      </h2>
                    </div>
                    <div id={`collapse${index}`} class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                      <div class="card-body">
                        <div className="">

                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {workers &&
                                workers.map((worker) => (
                                  worker.crewId === crew.id ?
                                    <tr
                                      key={worker.crewId}
                                    >
                                      <td>{worker.wId}</td>
                                      <td>{worker.firstName} {worker.lastName}</td>
                                      <td>
                                        {
                                          workedHoursID.includes(worker.wId) ?
                                            <button
                                              ref="btn"
                                              className="btn btn-primary"
                                              disabled
                                              onClick={() => this.addWorker(worker.wId)}
                                            >
                                              Added
                                            </button> :
                                            <button
                                              ref="btn"
                                              className="btn btn-primary"
                                              onClick={() => this.addWorker(worker.wId)}
                                            >
                                              + Add
                                            </button>
                                        }
                                      </td>
                                    </tr> : ""
                                ))}
                            </tbody>
                            {/*Ends */}
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Link
              className="btn btn-primary mt-3 text-right"
              to={"/viewTimesheet/" + id + "/" + code}>
              Back
            </Link>
          </div>

        </div>
      </div>

    );
  }
}

export default Workers;
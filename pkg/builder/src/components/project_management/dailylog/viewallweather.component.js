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

import React, { Component } from "react";
import { Link } from "react-router-dom";
import DLWeatherService from "../../../services/project_management/dlweather.service";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Table from "react-bootstrap/Table";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CloudOutlinedIcon from '@material-ui/icons/CloudOutlined';

class ViewDWLall extends Component {
  constructor(props) {
    super(props);
    this.retrieveDLall = this.retrieveDLall.bind(this);
    this.deleteWeatherLog = this.deleteWeatherLog.bind(this);
    this.state = {
      projectId: this.props.match.params.id,
      dwlall: [],
    };
  }

  componentDidMount() {
    this.retrieveDLall(this.props.match.params.id);
  }

  retrieveDLall(id) {
    DLWeatherService.getAll(id).then((response) => {
      this.setState({
        dwlall: response.data,
      });
    });
  }

  deleteWeatherLog(weatherid) {
    var data = {
      isDeleted: 1,
    };
    DLWeatherService.update(weatherid, data).then((response) => {
    //   window.location.reload();
    });
  }

  render() {
    const { projectId, dwlall } = this.state;
    return (
      <div>
        <h2>View All Weather Logs</h2>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/projectmanagementhome/" + projectId}>
            App Dashboard
          </Link>
          <Link color="inherit" to={"/dailylogs/" + projectId}>
            Daily Log
          </Link>
          <Link color="inherit" aria-current="page" className="disabledLink">
            View All Weather Logs
          </Link>
        </Breadcrumbs>
        <hr />
        <h5 className="mb-3">
            <CloudOutlinedIcon/> To track the weather of each time on project's location
        </h5>
        <Table striped bordered hover variant="" responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Temperature</th>
              <th>Weather</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dwlall &&
              dwlall.map((da, index) => (
                <tr key={index}>
                  <td>{da.date}</td>
                  <td>{da.time}</td>
                  <td>{da.temperature}</td>
                  <td>{da.weather}</td>
                  <td>
                    <Link to={"/viewweatherlog/" + projectId + "/" + da.id}>
                      <button className="btn btn-success mr-2">
                        {" "}
                        View <VisibilityIcon />
                      </button>
                    </Link>
                    <button
                      className="btn btn-danger mr-2"
                      id="updateBtn"
                      data-target="#deleteaccidentModal"
                      data-toggle="modal"
                    >
                      Delete <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        {/* Delete accident modal Starts */}
        <div
          className="modal fade"
          id="deleteaccidentModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title" id="exampleModalCenterTitle">
                  Are you sure you want to delete?
                </p>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <a
                  className="btn btn-danger pr-3 ml-2 mr-3"
                  onClick={this.deleteWeatherLog(dwlall.id)}
                  data-dismiss="modal"
                >
                  {" "}
                  Yes, Delete
                </a>
                <a
                  className="btn btn-secondary ml-6 mr-6 pl-3"
                  id="deleteModalDismiss"
                  data-dismiss="modal"
                >
                  {" "}
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Delete accident modal Ends */}
      </div>
    );
  }
}

export default ViewDWLall;
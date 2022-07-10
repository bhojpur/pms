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
import DepartmentDataService from "./../../../services/department.service";
import PortfolioDataService from "./../../../services/portfolio.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import { Card } from "@material-ui/core";
import Alert from "react-bootstrap/Alert";
import cogoToast from "cogo-toast";

export default class AddCustomDepartment extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePurpose = this.onChangePurpose.bind(this);
    this.retrieveDepartments = this.retrieveDepartments.bind(this);
    this.saveDepartment = this.saveDepartment.bind(this);
    this.newDepartment = this.newDepartment.bind(this);

    this.state = {
      id: null,
      lastproject: [],
      title: "",
      description: "",
      purpose: "", 
      currentIndex: -1,
      projectId: this.props.match.params.id,
      departments: [],

      submitted: false
    };
  }
  componentDidMount() {
    this.retrieveDepartments(this.props.match.params.id);
  }
  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangePurpose(e) {
    this.setState({
      purpose: e.target.value
    });
  }
  retrieveDepartments(id){
    PortfolioDataService.getAllDep(id)
      .then(response => {
        this.setState({
          departments: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  saveDepartment() {
    cogoToast.success("Department "+ this.state.title+" created successfully");
    var data = {
      title: this.state.title,
      description: this.state.description,
      purpose: this.state.purpose,
      projectId: this.state.projectId
    };
    DepartmentDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          purpose: response.data.purpose,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    this.retrieveDepartments(this.state.projectId);
  }
  newDepartment() {
    this.setState({
      id: null,
      title: "",
      description: "",
      purpose: "",
      published: false,

      submitted: false
    });
  }

  render() {
    const {lastproject, currentIndex, projectId, departments} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
            <center>
                <h4 className="alert alert-success">You add a department successfully</h4>
                <button className="btn btn-success" onClick={this.newDepartment}  style={{ 'text-decoration': 'none' }}>
                Add Another Department
                </button>
                <Link className="btn btn-primary m-2" to={"/projects"}>
                Back Home
                </Link>
            </center>
          </div>
        ) : (
          <div class="container">
          <div className="row">
            <div className="container col-8">
            <h2>Add Custom Department</h2>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">
                  Home
                </Link>
                <Link color="inherit" to={"/admin"}>
                  Core Dashboard
                </Link>
                <Link color="inherit" to={"/projects"}>
                  Project Home
                </Link>
                <Link color="textPrimary" to={"/addcustomdepartment/"+projectId} aria-current="page">
                  Custom Department / Add
                </Link>
            </Breadcrumbs>
            <h5>Step 2 : Define Departments</h5>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Purpose</label>
              <input
                type="text"
                className="form-control"
                id="purpose"
                required
                value={this.state.purpose}
                onChange={this.onChangePurpose}
                name="purpose"
              />
            </div>
            <button onClick={this.saveDepartment} className="btn btn-success">
              Create Department
            </button>
            <hr></hr>
            {/* Show Current Departments */}
            <div>
            <div className="col-md-12">
              <div className="list-group">
              <h4 className="mt-2">Current Departments</h4>
              {departments &&
                departments.map((department, index) => (
                  <Card style={{ width: '40rem'}} className="m-2 shadow-md">
                  <div className="row">
                    <div className="col-9">
                      <br/>
                        <h6><b>Title : {department.title}</b></h6>
                        <h6>Description : {department.description}</h6>
                    </div>
                  </div>
                  </Card>
                ))}
                </div>
            </div>
            </div>
            {/* Show Current Departments ends  */}
            </div>
            <div className="container col-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 1 :</strong>Project Settings</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 2 </strong>Define departments</h5></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3 :</strong>Define milestones</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 4 :</strong>Assign users for the project</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
          </div>
          </div>
        )}
      </div>
    );
  }
}
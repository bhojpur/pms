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
import ProjectDataService from "./../../../services/project.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import Alert from "react-bootstrap/Alert";
import cogoToast from "cogo-toast";

export default class AddProject extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.newProject = this.newProject.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      location: "", 
      published: false,
      startdate: "",
      enddate: "",
      message: "",
      isTitleValid: -1,

      submitted: false,
      lastproject:[],
      currentIndex: -1,
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
    ProjectDataService.findByTitle(e.target.value)
    .then(response => {
      this.setState({
        isTitleValid: response.data.length
      });
    })
    .catch(e => {
      console.log(e);
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeLocation(e) {
    this.setState({
      location: e.target.value
    });
  }
  onChangeStartDate(e) {
    this.setState({
      startdate: e.target.value
    });
  }
  onChangeEndDate(e) {
    this.setState({
      enddate: e.target.value
    });
  }

  saveProject() {
    var date1 = new Date(this.state.startdate);
    var date2 = new Date(this.state.enddate);
    if(date1.getTime() > date2.getTime()){
      // console.log("Error"+date1.getTime()+" "+date2.getTime());
      if(this.state.isTitleValid > 0){
        cogoToast.error('Title is invalid, Dates are invalid');
      }else{
        cogoToast.error('End date should be greater than start date');
      }
    }else{
      // console.log("Duration is fine "+date1.getTime()+" "+date2.getTime());
      if(this.state.isTitleValid > 0){
        cogoToast.error('Title is invalid');
      }else{
      // this.setState({
      //   message: "Duration is Appicable"
      // });
      cogoToast.success('Duration applicable, Successfully validated');
      // backend
      var data = {
        title: this.state.title,
        description: this.state.description,
        location: this.state.location,
        startdate: this.state.startdate,
        enddate: this.state.enddate
      };
  
      ProjectDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            location: response.data.location,
            startdate: response.data.startdate,
            enddate: response.data.enddate,
            published: response.data.published,
  
            submitted: true
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        // end of else
      }
    }
    //this.state.getLastProjectID();
  }

  newProject() {
    this.setState({
      id: null,
      title: "",
      description: "",
      location: "",
      startdate: "",
      enddate: "",
      published: false,

      submitted: false
    });
  }

  getLastProjectID(){
    ProjectDataService.findlastProject()
      .then(response => {
          this.setState({
            lastproject: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
    });
  }

  render() {
    const {lastproject, currentIndex, message, isTitleValid,id} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4 className="alert alert-success">You submitted the project successfully!</h4>
            <button className="btn btn-success m-2" onClick={this.newProject}>Add Another Project</button>
            <Link className="btn btn-primary m-2" to={"/projects"}>Back Home</Link>
            <div>
              <h5>Proceed to Step 02 : Define Departments</h5>
              <Link to={"/adddepartment/"+id} className="btn btn-warning"  style={{ 'text-decoration': 'none' }}>Add Departments</Link>
              {lastproject && lastproject.map((project, index) => (
                <div
                    className={
                      "container col-3" +  (index === currentIndex ? "active" : "")
                    }
                    key={index}
                >
                  {/* unit data */}
                  <Link to={"/adddepartment/"+project.id} className="btn btn-warning"  style={{ 'text-decoration': 'none' }}>Add Departments</Link>
                </div>
              ))}
            </div>
            </center>
          </div>
        ) : (
          <div class="container">
          <div className="row">
            <div className="container col-8">
            <h2>Add New Project</h2>
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
                <Link color="textPrimary" to={"/addProject"} aria-current="page">
                  Add New Project
                </Link>
            </Breadcrumbs>
            {/* <h5>Step 1: Project Settings</h5> */}
            <div className="form-group">
              <label htmlFor="title">Title<b> : should be unique</b></label>
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
            {this.state.title == "" ? "" : isTitleValid > 0 ? 
            <Alert variant="danger">
              Title is already taken
            </Alert> :
            <Alert variant="success">
              Title is avaliable to use
            </Alert> }
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
              <label htmlFor="description">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                required
                value={this.state.location}
                onChange={this.onChangeLocation}
                name="location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="startdate"
                required
                value={this.state.startdate}
                onChange={this.onChangeStartDate}
                name="startDate"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                className="form-control"
                id="enddate"
                required
                value={this.state.enddate}
                onChange={this.onChangeEndDate}
                name="endDate"
              />
            </div>
            {/* {message != "Duration is Appicable" &&
            <Alert variant="danger">
              {this.state.message}
            </Alert>
            }
            {message == "Duration is Appicable" && 
            <Alert variant="success">
              {this.state.message}
            </Alert>
            } */}
            {/* <button onClick={()=>{this.saveProject(); setTimeout(this.setState.bind(this, {position:1}), 3000); this.getLastProjectID()}} className="btn btn-success">
              Create Project
            </button> */}
            <button onClick={this.saveProject} className="btn btn-success">
            Create Project
            </button>
            </div>
            <div className="container col-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1 </strong>Project Settings</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2 :</strong>Define departments</h6></TimelineContent>
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
            <Alert variant="warning">
              <h6>Warning!</h6>
              <b>Start Date should less than the End Date for sucsessful project creation</b><br/>
              E.g. :- 2021-10-20 to 2022-10-20
            </Alert>
            </div>

          </div>
          </div>
        )}
      </div>
    );
  }
}
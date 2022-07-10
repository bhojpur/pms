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
import MilestoneDataService from "../../../services/milestone.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from "cogo-toast";

export default class AddMilestoneGeneral extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.saveMilestone = this.saveMilestone.bind(this);
    this.newMilestone = this.newMilestone.bind(this);

    this.state = {
      id: null,
      lastproject: [],
      title: "",
      description: "",
      duration: "", 
      currentIndex: -1,
      projectId: this.props.match.params.id,

      submitted: false
    };
  }
  componentDidMount() {
    
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
  onChangeDuration(e) {
    this.setState({
      duration: e.target.value
    });
  }
  saveMilestone() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      duration: this.state.duration,
      projectId: this.state.projectId
    };
    cogoToast.success("Milestone "+this.state.title+" created successfully!");
    MilestoneDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          duration: response.data.duration,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  newMilestone() {
    this.setState({
      id: null,
      title: "",
      description: "",
      duration: "",
      published: false,

      submitted: false
    });
  }

  render() {
    const {lastproject, currentIndex, projectId} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
        <center>
          <div>
            <h4>You add a Milestone successfully</h4>
            <button className="btn btn-success" onClick={this.newMilestone}  style={{ 'text-decoration': 'none' }}>
              Add Another Milestone
            </button>
          </div>
          </center>
        ) : (
          <div class="container">
          <div className="row">
            <div className="container col-8">
            <h2>Add Custom Milestone</h2>
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
                <Link color="textPrimary" to={"/addmilestoneproject/"+projectId} aria-current="page">
                  Custom Milestone / Add
                </Link>
            </Breadcrumbs>
            <h5>Step 3 : Define Milestones</h5>
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
              <label htmlFor="description">Duration</label>
              <input
                type="text"
                className="form-control"
                id="duration"
                required
                value={this.state.duration}
                onChange={this.onChangeDuration}
                name="duration"
                list={"dur"}
              />
              <datalist id="dur">
                <option>1 Months</option>
                <option>2 Months</option>
                <option>3 Months</option>
                <option>4 Months</option>
                <option>6 Months</option>
                <option>8 Months</option>
                <option>12 Months</option>
              </datalist>
            </div>
            <button onClick={this.saveMilestone} className="btn btn-success">
              Create Milestone
            </button>
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
                <TimelineContent><h6><strong>Step 2 :</strong>Define departments</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 3 </strong>Define milestones</h5></TimelineContent>
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
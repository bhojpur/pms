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
import DirectoryService from "../../../services/directory.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from "cogo-toast";

export default class AddDirectory extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveDirectory = this.saveDirectory.bind(this);
    this.newDirectory = this.newDirectory.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      projectId: this.props.match.params.id,  
      submitted: false
    };
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

  saveDirectory() {
    if(this.state.title.length >= 6){ 
    var data = {
      title : this.state.title,
      description: this.state.description,
      projectId: this.state.projectId
    };
      cogoToast.success("Directory created successfully");
    DirectoryService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }else{
      cogoToast.error("Add a proper Title with at least 6 ");
    }
  }

  newDirectory() {
    this.setState({
      id: null,
      title: "",
      description: "",
      projectId: this.props.match.params.id,

      submitted: false
    });
  }
  render() {
    const {projectId} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4 className="alert alert-success">You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newDirectory}>
              Add Another Directory
            </button>
            <Link to={"/document/"+projectId} className="btn btn-primary ml-2">Back Home</Link>
          </center>
          </div>
        ) : (
          <div class="container">
          <div className="row">
            <div className="container col-8">
            <h2>Add New Directory</h2>
            <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">
              Home
            </Link>
            <Link color="inherit" to={"/projectmanagementhome/"+projectId}>
              App Dashboard
            </Link>
            <Link color="textPrimary" to={"/document/"+projectId} aria-current="page">
              Document Home
            </Link>
            <Link color="textPrimary" to={"/directory/"+projectId} aria-current="page">
              Add Directory
            </Link>
          </Breadcrumbs>
            <h5>Step 1: Project Settings</h5>
            <div className="form-group">
              <label htmlFor="title">Title :</label>
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
              <label htmlFor="description">Description :</label>
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

            <button onClick={this.saveDirectory} className="btn btn-success">
              Create 
            </button>
            </div>
            <div className="container col-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1 </strong>Directory Details</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2 :</strong>Submit</h6></TimelineContent>
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
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
import DrawingCategoryDataService from "./../../../services/drawing-category.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from "cogo-toast";

export default class AddDrawingCategory extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveDrawingCategory = this.saveDrawingCategory.bind(this);
    this.newDrawingCategory = this.newDrawingCategory.bind(this);

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

  saveDrawingCategory() {
    if(this.state.title.length > 5){ 
    var data = {
      title : this.state.title,
      description: this.state.description,
      projectId: this.state.projectId
    };
    cogoToast.success("Drawing category created successfully!");
    DrawingCategoryDataService.create(data)
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
      cogoToast.error("Add a proper category Title");
    }
  }

  newDrawingCategory() {
    this.setState({
      id: null,
      title: "",
      description: "",
      projectId: this.props.match.params.id,

      submitted: true
    });
  }

  render() {
    const {projectId} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
         <center> 
          <div>
            <h4>Category details successfully submitted!</h4>
            <button className="btn btn-success m-2" onClick={this.newDrawingCategory}>
            Add Another Drawing Category
            </button>
            <Link className="btn btn-primary m-2" to={"/drawing/"+projectId }>
            Back Home
            </Link>
          </div>
        </center>
        ) : (
          <div class="container">
            <h2>Add New Drawing Category</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/drawing/"+projectId} aria-current="page">
                Drawing Home
              </Link>
              <Link color="textPrimary" to={"/adddrawingcategory/"+projectId} aria-current="page">
                Add Category
              </Link>
            </Breadcrumbs>
            <div className="row">
            <div className="col-sm-8">
                <div className="form-group">
                <label htmlFor="name">Title</label>
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
            </div>
            <div className="col-sm-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1 </strong>Category Details</h5> </TimelineContent>
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
            <button onClick={this.saveDrawingCategory} className="btn btn-success">
              Create 
            </button>
          </div>
        )}
      </div>
    );
  }
}
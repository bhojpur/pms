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
import DrawingDataService from "./../../../services/drawing.service";
import DrawingCategoryService from "../../../services/drawing-category.service";
import UploadService from "./../../../services/document.service";
import { Breadcrumbs } from "@material-ui/core";
import Alert from "react-bootstrap/Alert";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import cogoToast from "cogo-toast";

export default class AddDrawing extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.saveDrawing = this.saveDrawing.bind(this);
    this.newDrawing = this.newDrawing.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      // category default value is 1(gallery mode)
      category: 1,
      status: "Not Complete",
      version: 1, 
      projectId: this.props.match.params.id, 
      
      drawingcategories: [],
      currentIndex: -1,
      submitted: false,
      isTitleValid: 0,

      //file
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.retriveDrawingCategory(this.props.match.params.id);
  }
  onChangeName(e) {
    this.setState({
      title: e.target.value
    });
    DrawingDataService.findByTitle(e.target.value)
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
  onChangeType(e) {
    this.setState({
      category: e.target.value
    });
  }
  retriveDrawingCategory(id){
    DrawingCategoryService.getAll(id)
    .then(response => {
        this.setState({
          drawingcategories: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  saveDrawing() {
    if(this.state.title.length != "" && this.state.category != ""){  
    var data = {
      title: this.state.title,
      description: this.state.description,
      category: this.state.category,
      version: this.state.version,
      status: this.state.status,
      projectId: this.state.projectId
    };
    cogoToast.success("Drawing "+this.state.title+" created successfully!");
    DrawingDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          version: response.data.version,
          status: response.data.status,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }else{
      cogoToast.warn("Validation warning!");
      cogoToast.error("Fields cannot be empty!");
    }
  }
  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }
  upload() {
    let currentFile = this.state.selectedFiles[0];
    let fileName = this.state.title+".pdf";
    console.log(currentFile);
    console.log(fileName);
    
    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, fileName, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }
  newDrawing() {
    this.setState({
      id: null,
      title: "",
      description: "",
      category: "",
      projectId: this.props.match.params.id,
      
      submitted: true
    });
  }

  render() {
    const {projectId, currentIndex, drawingcategories,selectedFiles,
      currentFile,
      progress,message,fileInfos,title, isTitleValid} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4>Drawing details successfully submitted!</h4>
            <Link to={"/drawing/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Back Home
            </Link>
            <Link to={"/adddrawing/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Add Drawing
            </Link>
          </center>
          </div>
        ) : (
          <div class="container">
            <h2>Add New Drawing</h2>
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
              <Link color="textPrimary" to={"/adddrawing/"+projectId} aria-current="page">
                Add Drawing
              </Link>
            </Breadcrumbs>
            <div className="row">
            <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="title">Title<b> : should be unique</b></label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeName}
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
              <label htmlFor="category">Drawing Category</label>
              <div className="row">
              <div className="col-9">
              <select 
                className="form-control"
                id="datatype"
                required
                name="category"
                value={this.state.category}
                onChange={this.onChangeType}
              >
                <option value="">Select a Drawing Category ...</option>
                {drawingcategories &&
                drawingcategories.map((drawingcategory, index) => (
                <option
                    value={drawingcategory.id}
                    onChange={this.onChangeType}
                    key={index}
                >
                {/* unit data */}
                {drawingcategory.title}
                </option>
                ))}
              </select>
              </div>
              <div className="col-3">
                <Link to={"/adddrawingcategory/"+projectId} style={{'text-decoration': 'none'}} className="btn btn-primary">
                Add Category
                </Link>
              </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Version</label>
              <input
                type="text"
                className="form-control"
                value="1.0.0"
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Status</label>
              <input
                type="text"
                className="form-control"
                value="Not Complete 🔴"
                disabled
              />
            </div>  
            <div>
              <h5>Upload the Drawing Source</h5>
              <p>File source document : - {title}{".pdf"}</p>
              {/* Div starts */}
              <div>
                {currentFile && (
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-info progress-bar-striped"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: progress + "%" }}
                    >
                      {progress}%
                    </div>
                  </div>
                )}

                <label className="btn btn-default">
                  <input type="file" onChange={this.selectFile} />
                </label>

                <button className="btn btn-success"
                  disabled={!selectedFiles}
                  onClick={this.upload}
                >
                  Upload
                </button>

                <div className="alert alert-light" role="alert">
                  {message}
                </div>
                {/*Ends div here  */}
                </div>
            {/* End the container uploading here */}
            </div> 
            </div>
            <div className="col-sm-4">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1</strong><br/>Drawing Settings</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Upload File</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            </div>
            <button onClick={this.saveDrawing} className="btn btn-success">
              Create 
            </button>
          </div>
        )}
      </div>
    );
  }
}
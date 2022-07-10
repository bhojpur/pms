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
import PhotoFileDataService from "./../../../services/photo.service";
import AlbumService from "../../../services/album.service";
import UploadService from "./../../../services/photoupload.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import Alert from "react-bootstrap/Alert";
import cogoToast from "cogo-toast";
// import CameraCapture from './cameracpature.component';

export default class AddPhoto extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangePath = this.onChangePath.bind(this);
    this.savePhoto = this.savePhoto.bind(this);
    this.newPhoto = this.newPhoto.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      category: "1",
      path: "http://localhost:8080/api/photos/", 
      projectId: this.props.match.params.id, 
      
      albums: [],
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
    this.retriveAlbum(this.props.match.params.id);
  }
  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
    PhotoFileDataService.findByTitle(e.target.value)
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
  onChangePath(e) {
    this.setState({
      path: e.target.value
    });
  }
  retriveAlbum(id){
    AlbumService.getAll(id)
    .then(response => {
        this.setState({
          albums: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  savePhoto() {  
    var data = {
      title: this.state.title,
      description: this.state.description,
      category: this.state.category,
      path: this.state.path,
      projectId: this.state.projectId
    };
    cogoToast.success("Photo "+this.state.title+" created successfully");
    PhotoFileDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          path: response.data.path,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPhoto() {
    this.setState({
      id: null,
      title: "",
      description: "",
      category: "",
      path: "",
      projectId: this.props.match.params.id,
      
      submitted: false
    });
  }
  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }
  upload() {
    let currentFile = this.state.selectedFiles[0];
    let fileName = this.state.title+".png";
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

  render() {
    const {projectId, title,currentIndex, albums,selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,isTitleValid} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
          <center>
            <h4>Photo details successfully submitted!</h4>
            <Link to={"/photos/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Back Home
            </Link>
            <Link to={"/addphoto/"+projectId} className="btn btn-primary mr-2"  style={{ 'text-decoration': 'none' }}>
              Add Photo
            </Link>
          </center>
          </div>
        ) : (
          <div class="container">
            <h2>Add New Photo</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/photos/"+projectId}>
                Photos Home
              </Link>
              <Link color="textPrimary" to={"/addphoto/"+projectId} aria-current="page">
                Add Photo
              </Link>
            </Breadcrumbs>
            <div className="row">
            <div className="col-sm-8">
            <div className="form-group">
              <label htmlFor="name">Image Name<b> : should be unique</b></label>
              <input
                type="text"
                className="form-control"
                id="name"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>
            <div className="form-group">
            {this.state.title == "" ? "" : isTitleValid > 0 ? 
            <Alert variant="danger">
              Image name is already taken
            </Alert> :
            <Alert variant="success">
              Image name is avaliable to use
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
              <label htmlFor="category">Album</label>
              <select 
                className="form-control"
                id="datatype"
                required
                name="category"
                value={this.state.category}
                onChange={this.onChangeType}
              >
                {albums &&
                albums.map((album, index) => (
                <option
                    value={album.id}
                    onChange={this.onChangeType}
                    key={index}
                >
                {/* unit data */}
                {album.title}
                </option>
                ))}
              </select>
            </div>  
            <div>
              <h5>Upload the Image Source</h5>
              <p>Uploaded Image Name : - <b>{title}{".png"}</b></p>
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
                <TimelineContent><h5><strong>Step 1</strong><br/>Document Settings</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Submit</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            <Alert variant="warning">
            <h6>Warning</h6>
            <b>Image extension automatically assigned by the system.</b><br/>
            demophoto.png❌ demophoto ✔️
            <br/>
            
            </Alert>
            </div>
            </div>
            <button onClick={this.savePhoto} className="btn btn-success">
              Create 
            </button>
          </div>
        )}
      </div>
    );
  }
}
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
import cogoToast from "cogo-toast";

export default class UpdateDrawing extends Component {
    constructor(props) {
      super(props);
      this.onChangeTitle = this.onChangeTitle.bind(this);
      this.onChangeDescription = this.onChangeDescription.bind(this);
      this.onChangeCategory = this.onChangeCategory.bind(this);
      this.onChangeVersion = this.onChangeVersion.bind(this);
      this.getDrawing = this.getDrawing.bind(this);
      this.updatePublished = this.updatePublished.bind(this);
      this.updateDrawing = this.updateDrawing.bind(this);
      this.deleteDrawing = this.deleteDrawing.bind(this);
      this.selectFile = this.selectFile.bind(this);
      this.upload = this.upload.bind(this);

      this.state = {
        currentDrawing: {
          id: null,
          title: "",
          description: "",
          category: "",
          status: "",
          version: 0,
          published: false
          
        },
        message: "",
        temp: this.props.match.params.id,
        pid: this.props.match.params.pid,
        url: "http://localhost:8080/api/files/",
        drawingcategories: [],

        //file
        selectedFiles: undefined,
        currentFile: undefined,
        progress: 0,
        message: "",
      };
    }

    componentDidMount() {
      this.getDrawing(this.props.match.params.id);
      this.retriveDrawingCategory(this.props.match.params.pid);
    }

    onChangeTitle(e) {
      const title = e.target.value;

      this.setState(function(prevState) {
        return {
          currentDrawing: {
            ...prevState.currentDrawing,
            title: title
          }
        };
      });
    }

    onChangeDescription(e) {
      const description = e.target.value;
      
      this.setState(prevState => ({
        currentDrawing: {
          ...prevState.currentDrawing,
          description: description
        }
      }));
    }

    onChangeCategory(e) {
      const category = e.target.value;
      
      this.setState(prevState => ({
        currentDrawing: {
          ...prevState.currentDrawing,
          category: category
        }
      }));
    }
    onChangeStatus(e) {
      const status = e.target.value;
      
      this.setState(prevState => ({
        currentDrawing: {
          ...prevState.currentDrawing,
          status: status
        }
      }));
    }

    onChangeVersion(e) {
      const version = e.target.value;
      
      this.setState(prevState => ({
        currentDrawing: {
          ...prevState.currentDrawing,
          version: version
        }
      }));
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

    getDrawing(id) {
      DrawingDataService.get(id)
        .then(response => {
          this.setState({
            currentDrawing: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  updatePublished(status) {
    var data = {
      id: this.state.currentDrawing.id,
      title: this.state.currentDrawing.title,
      description: this.state.currentDrawing.description,
      category: this.state.currentDrawing.category,
      status: status
    };

    DrawingDataService.update(this.state.currentDrawing.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentDrawing: {
            ...prevState.currentDrawing,
            status: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateDrawing() {
    var data = {
      id: this.state.currentDrawing.id,
      title: this.state.currentDrawing.title,
      description: this.state.currentDrawing.description,
      category: this.state.currentDrawing.category,
      status: this.state.currentDrawing.status,
      version: this.state.currentDrawing.version,
    };
    DrawingDataService.update(this.state.currentDrawing.id,data)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The drawing was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

    deleteDrawing() {    
      DrawingDataService.delete(this.state.currentDrawing.id)
        .then(response => {
          console.log(response.data);
          this.props.history.push('/drawings/'+this.state.pid);
        })
        .catch(e => {
          console.log(e);
        });
    }
    selectFile(event) {
      this.setState({
        selectedFiles: event.target.files,
      });
    }
    upload() {
      let currentFile = this.state.selectedFiles[0];
      let fileName = this.state.currentDrawing.title+".pdf";
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
      cogoToast.success("File Source Updated Successfully");
    }

    render() {
      const { currentDrawing, temp, drawingcategories,pid,url,selectedFiles,
        currentFile,progress,message,fileInfos} = this.state;
  
      return (
        <div>
          {currentDrawing ? (
            <div className="container">
              <h2>Update a Drawing</h2>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">
                  Home
                </Link>
                <Link color="inherit" to={"/projectmanagementhome/"+pid}>
                  App Dashboard
                </Link>
                <Link color="inherit" to={"/drawing/"+pid}>
                  Drawing Home
                </Link>
                <Link color="textPrimary" to={"/updatedrawing/"+pid+"/"+temp} aria-current="page">
                  Update Drawing / {temp}
                </Link>
              </Breadcrumbs>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentDrawing.title}
                    onChange={this.onChangeTitle}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentDrawing.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="description">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    value={currentDrawing.category}
                    onChange={this.onChangeCategory}
                  />
                </div> */}
                <div className="form-group">
                <label htmlFor="category">Drawing Category</label>
                <select 
                    className="form-control"
                    id="category"
                    required
                    name="category"
                    value={this.state.category}
                    onChange={this.onChangeCategory}
                >
                    {drawingcategories &&
                    drawingcategories.map((drawingcategory, index) => (
                    <option
                        value={drawingcategory.id}
                        onChange={this.onChangeCategory}
                        key={index}
                    >
                    {/* unit data */}
                    {drawingcategory.title}
                    </option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Version</label>
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    value={currentDrawing.version + 1}
                    onChange={this.onChangeVersion}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>
                    <strong>Status:</strong>
                  </label>
                  {currentDrawing.status}
                </div>
              </form>
              {/* File Uploading */}
              <hr></hr>
              <div>
                <h5>Upload the Drawing Source</h5>
                <a href={url+currentDrawing.title+".pdf"} target="_blank" style={{'text-decoration': 'none'}}>
                Current Source(Click to View)
                </a>
                <p>File source document : - <b>{currentDrawing.title}{".pdf"}</b></p>
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
              <hr></hr>
              {/* End File Uploading */}

              {currentDrawing.status == "Not Complete" ? (
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => this.updatePublished("Pending")}
                >
                  Set Pending
                </button>
              ) : 
              (currentDrawing.status == "Pending" ?
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => this.updatePublished("Complete")}
                >
                  Set Complete
                </button>
              :
              (
                <button
                  className="btn btn-success mr-2"
                  onClick={() => this.updatePublished("Not Complete")}
                >
                  Set Incomplete
                </button>
              ))}
  
              <button
                className="btn btn-danger  mr-2"
                onClick={this.deleteDrawing}
              >
                Delete
              </button>
  
              <button
                type="submit"
                className="btn btn-warning mr-2"
                onClick={this.updateDrawing}
              >
                Update
              </button>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Drawing...</p>
            </div>
          )}
        </div>
      );
  }
}
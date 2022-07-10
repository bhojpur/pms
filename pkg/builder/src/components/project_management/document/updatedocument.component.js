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
import DocumentDataService from "./../../../services/documentfile.service";
import DirectoryCategoryService from "../../../services/directory.service";
import UploadService from "./../../../services/document.service";
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from "cogo-toast";

export default class UpdateDocument extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeVersion = this.onChangeVersion.bind(this);
    this.getDocument = this.getDocument.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      currentDocument: {
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
      drawingcategories: [],

      //file
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
    };
  }

  componentDidMount() {
    this.getDocument(this.props.match.params.id);
    this.retriveDocumentCategory(this.props.match.params.pid);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentDocument: {
          ...prevState.currentDocument,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentDocument: {
        ...prevState.currentDocument,
        description: description
      }
    }));
  }

  onChangeCategory(e) {
    const category = e.target.value;
    
    this.setState(prevState => ({
      currentDocument: {
        ...prevState.currentDocument,
        category: category
      }
    }));
  }
  onChangeStatus(e) {
    const status = e.target.value;
    
    this.setState(prevState => ({
      currentDocument: {
        ...prevState.currentDocument,
        status: status
      }
    }));
  }

  onChangeVersion(e) {
    const version = e.target.value;
    
    this.setState(prevState => ({
      currentDocument: {
        ...prevState.currentDocument,
        version: version
      }
    }));
  }

  retriveDocumentCategory(id){
    DirectoryCategoryService.getAll(id)
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

  getDocument(id) {
    DocumentDataService.get(id)
      .then(response => {
        this.setState({
          currentDocument: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentDocument.id,
      title: this.state.currentDocument.title,
      description: this.state.currentDocument.description,
      category: this.state.currentDocument.category,
      status: status
    };

    DocumentDataService.update(this.state.currentDocument.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentDocument: {
            ...prevState.currentDocument,
            status: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateDocument() {
    var data = {
      id: this.state.currentDocument.id,
      title: this.state.currentDocument.title,
      description: this.state.currentDocument.description,
      category: this.state.currentDocument.category,
      status: this.state.currentDocument.status,
      version: this.state.currentDocument.version,
    };
    cogoToast.success("Document updated successfully!");
    DocumentDataService.update(this.state.currentDocument.id,data)
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

  deleteDocument() {    
    DocumentDataService.delete(this.state.currentDocument.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/projects')
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
    let fileName = this.state.currentDocument.title+".pdf";
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
    cogoToast.success("File uploaded successfully!");
  }

  render() {
    const { pid, currentDocument, temp, drawingcategories,selectedFiles,
      currentFile,progress,message} = this.state;

    return (
      <div>
        {currentDocument ? (
          <div className="container">
            <h2>Update a Document</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+pid}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/document/"+pid}>
                Document Home
              </Link>
              <Link color="textPrimary" to={"/updatedocument/"+pid+"/"+temp} aria-current="page">
                Update Document / {temp}
              </Link>
            </Breadcrumbs>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentDocument.title}
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
                  value={currentDocument.description}
                  onChange={this.onChangeDescription}
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="description">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  value={currentDocument.category}
                  onChange={this.onChangeCategory}
                />
              </div> */}
              <div className="form-group">
              <label htmlFor="category">Document Category</label>
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
              {/* <div className="form-group">
                <label htmlFor="description">Version</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  value={currentDocument.version + 1}
                  onChange={this.onChangeVersion}
                  disabled
                />
              </div> */}
              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentDocument.status}
              </div>
            </form>
            <hr></hr>
            {/* Uploading started */}
            <div>
              <h5>Update the Document source</h5>
              <p>Document name : - {currentDocument.title}{".pdf"}</p>
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
                
                {/*Ends div here  */}
                </div>
            {/* End the container uploading here */}
            </div>   

            {currentDocument.status == "Not Complete" ? (
              <button
                className="btn btn-primary mr-2"
                onClick={() => this.updatePublished("Pending")}
              >
                Set Pending
              </button>
            ) : 
            (currentDocument.status == "Pending" ?
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
              onClick={this.deleteDocument}
            >
              Delete
            </button>

            <button
              type="submit"
              className="btn btn-warning mr-2"
              onClick={this.updateDocument}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Document...</p>
          </div>
        )}
      </div>
    );
  }
}
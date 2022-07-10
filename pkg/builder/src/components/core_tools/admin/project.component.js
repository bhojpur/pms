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
import ProjectDataService from "./../../../services/project.service";
import { Breadcrumbs } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class Project extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.getProject = this.getProject.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);

    this.state = {
      currentProject: {
        id: null,
        title: "",
        description: "",
        location: "",
        published: false
        
      },
      message: "",
      temp: this.props.match.params.id
    };
  }

  componentDidMount() {
    this.getProject(this.props.match.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentProject: {
          ...prevState.currentProject,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentProject: {
        ...prevState.currentProject,
        description: description
      }
    }));
  }

  onChangeLocation(e) {
    const location = e.target.value;
    
    this.setState(prevState => ({
      currentProject: {
        ...prevState.currentProject,
        location: location
      }
    }));
  }

  getProject(id) {
    ProjectDataService.get(id)
      .then(response => {
        this.setState({
          currentProject: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentProject.id,
      title: this.state.currentProject.title,
      description: this.state.currentProject.description,
      location: this.state.currentProject.location,
      published: status
    };

    ProjectDataService.update(this.state.currentProject.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentProject: {
            ...prevState.currentProject,
            published: status
          }
        }));
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateProject() {
    ProjectDataService.update(
      this.state.currentProject.id,
      this.state.currentProject
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The project was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteProject() {    
    ProjectDataService.delete(this.state.currentProject.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/projects')
      })
      .catch(e => {
        console.log(e);
      });
  }

    render() {
      const { currentProject, temp} = this.state;
  
      return (
        <div>
          {currentProject ? (
            <div className="container">
              <h2>Update the Project</h2>
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
                <Link color="textPrimary" to={"/projects/"+temp} aria-current="page">
                  Update Projects / {temp}
                </Link>
              </Breadcrumbs>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentProject.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentProject.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    value={currentProject.location}
                    onChange={this.onChangeLocation}
                  />
                </div>
  
                <div className="form-group">
                  <label>
                    <strong>Status:</strong>
                  </label>
                  {currentProject.published ? "Published" : "Pending"}
                </div>
              </form>
  
              {currentProject.published ? (
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => this.updatePublished(false)}
                >
                  UnPublish
                </button>
              ) : (
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => this.updatePublished(true)}
                >
                  Publish
                </button>
              )}
  
              <button
                className="btn btn-danger mr-2"
                onClick={this.deleteProject}
              >
                Delete
              </button>
  
              <button
                type="submit"
                className="btn btn-success"
                onClick={this.updateProject}
              >
                Update
              </button>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Project...</p>
            </div>
          )}
        </div>
      );
  }
}
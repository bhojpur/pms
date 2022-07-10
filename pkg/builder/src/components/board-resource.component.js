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
import { Routes, Route, Link } from "react-router-dom";
import UserService from "./../services/user.service";
import AuthService from "./../services/auth.service";
import ProjectUserService from "./../services/projectuser.service";
import CircularProgress from '@material-ui/core/CircularProgress';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';

export default class BoardUser extends Component {
  constructor(props) {
    super(props);
    this.retriveUserProjects = this.retriveUserProjects.bind(this);
    this.state = {
      projects: [],
      uprojects: [],
      currentIndex: -1,
      content: "",
      currentUser:  AuthService.getCurrentUser() 
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
    this.retriveUserProjects(this.state.currentUser.id);
  }
  retriveUserProjects(id){
    ProjectUserService.getAll(id)
    .then(response => {
      this.setState({
        uprojects: response.data
      });
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }
  //UI component
  render() {
    const { uprojects,currentIndex } = this.state;
    return (
      <div className="container">
        <Card
          bg={'success'}
          text={'white'}
          //style={{ width: '14rem' }}
          className="mb-2">
                
          <Card.Body>
            <h4>Manage Resources</h4>
          </Card.Body>
        </Card> 

        <div className="col-md-10">
        <h4>My Projects</h4>
        
        <ul className="list-group">
          {uprojects &&
            uprojects.map((project, index) => (
              <li
                className={
                  "list-group-item " +
                  (index === currentIndex ? "active" : "")
                }
                // onClick={() => this.setActiveProject(project, index)}
                key={index}
              >
              <div className="container row">
                <div className="col-7">
                  {/* {this.retriveSingleProject(project.projectuserId)} */}
                  {/* <h5>{uprojects.title}</h5>
                  <h6>Breif : {uprojects.description}</h6>
                  <p>Location : {uprojects.location}</p> */}
                  <h4>Project : {index + 1}</h4>
                  <h6>Working Department : {project.department}</h6>
                  <h6>Position : {project.position}</h6>
                  <Link
                    to={"/resourcemanagementhome/" + project.projectId}
                    className="btn btn-primary"
                  >
                    Manage
                  </Link>
                </div>
                <div className="col-5">
                  <h6>Involved users : 15</h6>
                  <ProgressBar>
                    <ProgressBar  variant="primary" now={35} key={1} />
                    <ProgressBar variant="success" now={20} key={2} />
                    <ProgressBar variant="danger" now={10} key={3} />
                  </ProgressBar>
                  <h6>Progress</h6>
                  <CircularProgress variant="determinate" color="success" value={61} />
                    <p>61%</p>
                </div> 
              </div>
              </li> 
            ))}
        </ul>
        </div>

      </div>
    );
  }
}
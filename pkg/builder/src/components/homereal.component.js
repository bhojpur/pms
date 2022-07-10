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

import UserService from "./../services/user.service";
import ProjectDataService from "./../services/project.service";
import AuthService from "./../services/auth.service";
import Logo from "./../assets/bhojpur.png";

export default class Homereal extends Component {
  constructor(props) {
    super(props);
    this.retrieveProjects = this.retrieveProjects.bind(this);

    this.state = {
      projects: [],
      currentIndex: -1,
      content: "",
      currentUser: AuthService.getCurrentUser()
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
    this.retrieveProjects(this.state.currentUser.id);
  }
  retrieveProjects(id) {
    ProjectDataService.userProjects(id)
      .then(response => {
        this.setState({
          projects: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { projects,currentIndex,currentUser } = this.state;
    return (
      <div className="container">
        {/* <header className="jumbotron"> */}
        <div className="form-row">
            <div className="form-group col-md-6">
                <div></div>
                <h1>Bhojpur PMS</h1>
                <p>Manage your large-scale projects from start to end</p>
            </div>
            <div className="form-group col-md-6">
                <img src={Logo} alt="" />
            </div>    
        </div>
        
        {/* </header> */}
      </div>
    );
  }
}
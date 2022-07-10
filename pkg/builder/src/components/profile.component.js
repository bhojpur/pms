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
import AuthService from "../services/auth.service";
import UserService from "./../services/user.service";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import cogoToast from 'cogo-toast';
import PersonIcon from '@material-ui/icons/Person';
import Card from 'react-bootstrap/Card';
import { Breadcrumbs } from "@material-ui/core";

//css styles
const linkText={
  color: "#FFFFFF",
  textDecoration: "none"
}

const adminCardStyle = {
  backgroundColor: "#273f7d",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#efefef"}
}

const modCardStyle = {
  backgroundColor: "#6B7BA4",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#efefef"}
}

const userCardStyle = {
  backgroundColor: "#6B7BA4",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#efefef"}
}

function makeButtonForRole(name) {
  // return a lassana div
  if(name=='ROLE_ADMIN'){
    return <div className="d-inline-block pt-1 pl-2 pr-3 mt-1 mb-1 rounded" style={adminCardStyle}>
    <h4><PersonIcon className="pb-1" style={{ fontSize:28 }}/> Admin</h4>
    </div>;
  }
  else if(name=='ROLE_MODERATOR'){
    return <div className="d-inline-block pt-1 pl-2 pr-3 mt-1 mb-1 rounded" style={modCardStyle}>
    <h4><PersonIcon className="pb-1" style={{ fontSize:28 }}/> Moderator</h4>
    </div>;
  }
  else if(name=='ROLE_USER'){
    return <div className="d-inline-block pt-1 pl-2 pr-3 mt-1 mb-1 rounded" style={userCardStyle}>
    <h4><PersonIcon className="pb-1" style={{ fontSize:28 }}/> User</h4>
    </div>;
  }
}
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.retrieveProjects = this.retrieveProjects.bind(this);
    this.onChangePrevPassword = this.onChangePrevPassword.bind(this);
    this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.state = {
      currentUser: AuthService.getCurrentUser(),
      projects: [],
      username: "",
      email: "",
      currentIndex: -1,
      prevPassword:"",
      newPassword:"",
      confirmPassword:"",
      content: "",
      updateButton: true,
      pwButton: true
      //currentUserProfile: UserService.userProjects(currentUser.id)
    };
  }
  componentDidMount() {
    this.retrieveProjects(this.state.currentUser.id);
    console.log(this.state);
  }
  retrieveProjects(id) {
    UserService.userProjects(id)
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

  onChangePrevPassword(e) {
    this.setState({
      prevPassword: e.target.value
    });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
      updateButton : false
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
      updateButton : false
    });
  }

  onChangeNewPassword(e) {
    this.setState({
      newPassword: e.target.value
    });
    if(this.state.confirmPassword==e.target.value){
      this.setState({
        pwButton: false
      });
    }else{
      this.setState({
        pwButton: true
      });
    }
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value
    });
    if(this.state.newPassword==e.target.value){
      this.setState({
        pwButton: false
      });
    }else{
      this.setState({
        pwButton: true
      });
    }
    // console.log(this.state.newPassword)
    // console.log(this.state.confirmPassword)
    // console.log(this.state.pwButton)
  }

  checkCurrentPW(){
    console.log(this.state)
  }

  render() {
    const { projects,currentIndex,currentUser } = this.state;
    return (
      <div className="container">
        <h2><AccountBoxIcon/> PROFILE</h2>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/profile"}>
            Profile
          </Link>
        </Breadcrumbs>
        <hr></hr>
        <div className="row">
        <div className="col-12">
          {/* <Card
            bg={'success'}
            text={'white'}
            //style={{ width: '14rem' }}
            className="mb-2">
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
            <div className="row">
            <div className="col-10">
            
            <h6>Username : {currentUser.username}</h6>
            <h6>Email : {currentUser.email}</h6>
             
            <h6>Role  : {currentUser.roles[currentUser.roles.length-1]}</h6> 
            </div>
            <div className="col-2">
            <img
                // src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                src={mainIcon}
                alt="profile-img"
                className="profile-img-card"
                
            />
            </div>
            </div>
            </Card.Text>
          </Card.Body>
        </Card>  */}
        {/* currentUser.roles.length-1 is to get last element  */} 
        </div>
        </div>
        <div className="row">
          <div className="col-6">
          <h3>My Account</h3>
          <p>
            {/* <strong>Token:</strong>{" "} */}
            {/* {currentUser.accessToken.substring(0, 20)} ...{" "}
            {currentUser.accessToken.substr(currentUser.accessToken.length - 20)} */}
          </p>
          <div className="form-group">
              <label htmlFor="startDate"><h6>Username : </h6></label>
              <input
                type="text"
                className="form-control"
                id="startDate"
                //required
                value={this.state.currentUser.username}
                // onChange={this.onChangeLocation}
                name="startDate"
              />
          </div>
          <div className="form-group">
              <label htmlFor="startDate"><h6>Email : </h6></label>
              <input
                type="text"
                className="form-control"
                id="startDate"
                //required
                value={this.state.currentUser.email}
                // onChange={this.onChangeLocation}
                name="startDate"
              />
          </div>
          <button className="btn btn-primary" disabled={this.state.updateButton}>Update Profile</button>
          <hr></hr>
          <h3>Change Password</h3>
          <div className="form-group">
              <label htmlFor="startDate"><h6>Previous Password : </h6></label>
              <input
                type="password"
                className="form-control"
                id="startDate"
                //required
                onChange={this.onChangePrevPassword}
                name="startDate"
              />
          </div>
          <div className="form-group">
              <label htmlFor="startDate"><h6>New Password : </h6></label>
              <input
                type="password"
                className="form-control"
                id="startDate"
                //required
                onChange={this.onChangeNewPassword}
                name="startDate"
              />
          </div>
          <div className="form-group">
              <label htmlFor="startDate"><h6>Confirm Password : </h6></label>
              <input
                type="password"
                className="form-control"
                id="startDate"
                //required
                onChange={this.onChangeConfirmPassword}
                name="startDate"
              />
          </div>
          <button className="btn btn-primary" disabled={this.state.pwButton} onClick={()=>this.checkCurrentPW()}>Change Password</button>
          </div>
          <div className="col-6">
          <h3>My Roles & Permission</h3>
            <div className="form-group">
              {makeButtonForRole(currentUser.roles[currentUser.roles.length-1])}
            </div>
            
          <h6>Permissions:</h6>
          <ul>
            
            <li className="list-group-item"><b>Project Management</b></li>
            {(() => {
              if (this.state.currentUser.roles[currentUser.roles.length-1]=="ROLE_MODERATOR") {
                return (
                  <div>
                     <li className="list-group-item"><b>Finance Management</b></li>
                     <li className="list-group-item"><b>Resource Management</b></li>
                  </div>
                )
              } else if (this.state.currentUser.roles[currentUser.roles.length-1]=="ROLE_ADMIN") {
                return (
                  <div>
                     <li className="list-group-item"><b>Core Tools</b></li>
                     <li className="list-group-item"><b>Resource Management</b></li>
                  </div>
                )
              } 
            })()}
          </ul>
          </div>
        </div>
       
      </div>
    );
  }
}
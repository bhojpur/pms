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
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import mainIcon from "././../assets/logo.png";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Chip from "@material-ui/core/Chip";
import cogoToast from 'cogo-toast';
//import welcomeMail from "../components/email/email.component";
import emailjs from 'emailjs-com';

import EmployeeDataService from "../services/employee.service";
import ProjectUserDataService from "../services/projectuser.service";
import DesignationDataService from "../services/designation.service";
import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePrivilege = this.onChangePrivilege.bind(this);
    // this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    //this.addToRoles=this.addToRoles.bind(this);

    this.state = {
      id: this.props.match.params.id,
      username: "",
      empname: "",
      email: "",
      password: "",
      privilege: "1",
      successful: false,
      message: "",
      rolesSelected: [],
      designations:[],
      rolesColors: [],
      signupDisabled:true
    };

    this.makeRolearray(this.state.id)
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePrivilege(e) {
    this.setState({
      privilege: e.target.value
    });
    console.log(this.state.privilege);
  }

  onChangePassword(e) {
    this.setState({
        password: e.target.value
    });
  }

  //make an array with indexes from state.rolesSelected
  makeDesignations(){
    const des=[]

    this.state.rolesSelected.map((value,index) =>{
      if(value=="secondary"){
        des.push(index+1)
      }
      
    });

    console.log(des)
    return des
  }

  handleRegister(e) {
    //e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.id,
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
        
      );

      //sendemail
      emailjs.send('service_ufoheny','template_gthofqi',{
        empname: this.state.empname,
        username: this.state.username,
        password: this.state.password,
        to_email: this.state.email
    },'user_fvU6SYbToOsc7pAT3U5ZY')
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
        console.log('FAILED...', error);
    });
      //welcomeMail()
      console.log(this.state.successful)
      if(true){
        //UPDATE EMPLOYEE TABLE
        const toupdate=this.makeDesignations()
        console.log(toupdate)
        //let rolesSelected = [...this.state.rolesSelected];
        //let roleSelected = {...rolesSelected[1]};
        toupdate.forEach((item, index)=>{
          let currdes=this.state.designations[item-1]
          var data = {
            employeeid: this.state.id,
            designationid: item,
            designation: currdes.name
          };
      
          console.log(data);
      
          DesignationDataService.AssignDesignations(data)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
            //console.log(data);
          });
        });

        EmployeeDataService.updateAccountStatus(this.state.id)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
            //console.log(data);
          });

        
        //cogoToast.success("Account successfully made for"+this.state.username);
      }
      var data1={
        userId: this.state.id,
        roleId: this.state.privilege
      }
      
      ProjectUserDataService.addProjectRole(data1)
      .then(response => {
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

      window.location.href ="/employees"
    }
    
  }

  //handle frontend input

  makeRolearray(id){
    if(id!="undefined"){

      EmployeeDataService.getOne(id)
      .then(response => {
        this.setState({
          email: response.data.email,
          empname: response.data.name
        });
        
        console.log(this.state.email);
      })
      .catch(e => {
        console.log(e);
      });

      DesignationDataService.getAllDesignations()
      .then(response => {
        this.setState({
          designations: response.data
        });
        
        console.log(this.state.designations);
        this.state.designations.forEach(element => {
          this.state.rolesSelected.push(
            "default"
          )
        });
        
      })
      .catch(e => {
        console.log(e);
      });
    }
    
    console.log(this.state.rolesSelected);
  }

  //Generate Password
  generatePassword(){
    var generator = require('generate-password');

    var password = generator.generate({
	  length: 10,
	  numbers: true
    });

    this.setState({
      password: password,
      signupDisabled: false
    });

    // 'uEyMTw32v9'
    console.log(this.state);
    //this.makeDesignations();
    console.log(this.state.password);
  }

  addToRoles(index){
    //console.log(index)
    if(this.state.rolesSelected[index]=="default"){
      let rolesSelected = [...this.state.rolesSelected];
      let roleSelected = {...rolesSelected[1]};
      roleSelected = 'secondary';
      rolesSelected[index] = roleSelected;
      this.setState({rolesSelected});
    }else{
      //you cant use x[]= in state!
      let rolesSelected = [...this.state.rolesSelected];
      let roleSelected = {...rolesSelected[1]};
      roleSelected = 'default';
      rolesSelected[index] = roleSelected;
      this.setState({rolesSelected});
    }
    //console.log(this.state.color)
    console.log(this.state.rolesSelected[index])
  }

  render() {

    const roles= this.state.designations;

    return (
      <div>
        <h2 className="py-4"><PersonAddIcon/> Create Account</h2>

        <div className="row">
          <div className="col-6 pr-4">

            <Form
              //onSubmit={this.handleRegister}
              ref={c => {
                this.form = c;
              }}
            >
              {!this.state.successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={this.state.username}
                      onChange={this.onChangeUsername}
                      validations={[required, vusername]}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Input
                      type="text"
                      disabled
                      className="form-control"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeEmail}
                      validations={[required, email]}
                    />
                  </div>

                  <div className="form-group">
                    <div className="row">
                      <div className="col">
                        <label htmlFor="password">Password</label>
                      </div>
                      <div className="col">
                        <a className="btn btn-primary" onClick={() =>this.generatePassword()}>Generate Password</a>
                      </div>
                    </div>
                    <h5
                      name="password"
                      onChange={this.onChangePassword}
                      validations={[required, vpassword]}
                    >{this.state.password}</h5>
                  </div>

                  <div className="roles">

                  </div>
                </div>
              )}

              {this.state.message && (
                <div className="form-group">
                  <div
                    className={
                      this.state.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            
          {/* row end down*/}
          </div>
          <div className="col-6">
            <h3 className="pd-3">Select Eligible positions </h3>
            <p>Allocate positions for employee </p>
            <div className="row">
            {roles.map((value,index) => { 
              return(

                <div className="pr-2">
                  <Chip 
                    className="py-1 mb-2 ml-2"
                    label={value.name}
                    onClick={() =>this.addToRoles(index)}
                    clickable={true} color={this.state.rolesSelected[index]} />
                </div>
                )
              })}
            </div>
            <h3 className="mt-4 pd-3">Select Roles for User  </h3>
              <p>Allocate Roles for user: </p>
                <select className="form-control" name="" id="privilege"
                  required
                  value={this.state.privilege}
                  onChange={this.onChangePrivilege}
                  name="privilege 1" required>
              <option  onChange={this.onChangePrivilege} value="1" >User</option>
              <option onChange={this.onChangePrivilege} value="2">Moderator</option>
              <option onChange={this.onChangePrivilege} value="3">Administrator</option>
            </select><br />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" onClick={() =>this.handleRegister()} disabled={this.state.signupDisabled}>Sign Up</button>
          </div>
        
        </div>
      </div>
    );
  }
}
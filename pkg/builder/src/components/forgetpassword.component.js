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
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import mainIcon from "././../assets/logo.png";

import AuthService from "../services/auth.service";
import cogoToast from "cogo-toast";
import emailjs from 'emailjs-com';

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
   
    this.onChangeUserMail = this.onChangeUserMail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeInputCode = this.onChangeInputCode.bind(this);
    this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
    this.onChangeConfirmNewPassword = this.onChangeConfirmNewPassword.bind(this);
    this.showCodeArea = this.showCodeArea.bind(this);
    this.isCodeSuccess = this.isCodeSuccess.bind(this);
    this.ChangeToNewPassword = this.ChangeToNewPassword.bind(this);

    this.state = {
      usermail: "",
      password: "",
      loading: false,
      message: "",
      isCodeSend: false,
      code: 0,
      inputCode: undefined,
      isAuthUser: false,
      newpassword: undefined,
      confirmnewpassword: undefined
    };
  }

  onChangeUserMail(e) {
    this.setState({
      usermail: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeInputCode(e) {
    this.setState({
      inputCode: e.target.value
    });
  }

  onChangeNewPassword(e) {
    this.setState({
      newpassword: e.target.value
    });
  }

  onChangeConfirmNewPassword(e) {
    this.setState({
      confirmnewpassword: e.target.value
    });
  }
  
  showCodeArea(){
    if(this.state.usermail != ""){
      const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.com$');
      
      if (validEmail.test(this.state.usermail)){
        console.log("Valid");
        const min = 100000;
        const max = 900000;
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        //
        console.log(rand);
        this.setState({
          isCodeSend: true,
          code: rand
        });
        //sendmail
        emailjs.send('service_ufoheny','template_eb701x4',{
          empname: "Forget Password",
          username: "By Bhojpur PMS Admin",
          password: this.state.code,
          to_email: this.state.useremail
        },'user_fvU6SYbToOsc7pAT3U5ZY')
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });
      }else{
        cogoToast.error("Input a correct email!");
      }
      
    }else{
      cogoToast.error("Email cannot be empty or incorrect");
    }
  }

  isCodeSuccess(){
    if(this.state.inputCode == this.state.code){
        console.log("code is success");
        this.setState({
            isAuthUser: true
        });
    }else{
        console.log("code is unsuccess");
    }
  }
  ChangeToNewPassword(){
    if(this.state.newpassword == this.state.confirmnewpassword){
      console.log("Password has changed");
      cogoToast.success("Successfully chnaged the password!, Go back to Login");
  }else{
      console.log("two passwords mismatched");
      cogoToast.warn("two passwords mismatched");
  }
  }

  render() {
    const {isCodeSend,isAuthUser} = this.state;
    return (
    <div>
    {isAuthUser == false ? 
    // User is not authenticate to change the password 
    <div className="col-md-12">
        <div className="card card-container" id="card">
          <img
            // src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            src={mainIcon}
            alt="profile-img"
            className="profile-img-card"
            id="img"
          />
         
          <div className="form-group">
                <label htmlFor="projectID">Current Email</label>
                <input
                    type="email"
                    className="form-control"
                    id="usermail"
                    required
                    onChange={this.onChangeUserMail}
                    name="usermail"
                    value = {this.state.usermail}
                />
          </div>
          {!isCodeSend && 
          <div className="form group">
           <button className="btn btn-primary btn-block" onClick={this.showCodeArea}>
                Send Code
            </button>
          </div>
          }
          {isCodeSend && 
          <div>
          <div className="form-group">
                <label htmlFor="projectID">Code</label>
                <input
                    type="password"
                    className="form-control"
                    id="code"
                    // required
                    value={this.state.inputCode}
                    onChange={this.onChangeInputCode}
                    name="code"
                />
          </div>
          <div className="form group">
           <button className="btn btn-primary btn-block" onClick={this.isCodeSuccess}>
               Change Password
            </button>
          </div>
          <div className="form group">
           <button className="btn btn-primary btn-block mt-2" onClick={this.showCodeArea}>
               Resend Code
            </button>
          </div>
          </div>
          
          } 
        </div>
    </div>
    :
    // User is authenticate to change the password
    <div className="col-md-12">
        <div className="card card-container" id="card">
          <img
            // src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            src={mainIcon}
            alt="profile-img"
            className="profile-img-card"
            id="img"
          />
          <center><h6>Change Password</h6></center>
         
          <div className="form-group">
                <label htmlFor="projectID">New Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="newpassword"
                    required
                    value={this.state.newpassword}
                    onChange={this.onChangeNewPassword}
                    name="newpassword"
                />
          </div>
          <div className="form-group">
                <label htmlFor="projectID">Confirm Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="code"
                    // required
                    value={this.state.confirmnewpassword}
                    onChange={this.onChangeConfirmNewPassword}
                    name="confirmnewpassword"
                />
          </div>
          
          <div className="form group">
           <button className="btn btn-primary btn-block" onClick={this.ChangeToNewPassword}>
               Change Password
            </button>
          </div>
          
        </div>
    </div>
    } 
    </div> 
    );
  }
}
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

import React, { Component} from "react";
import {Link } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Breadcrumbs } from "@material-ui/core";
import EmployeeDataService from "./../../../services/employee.service";

class AddEmployee extends Component {
  constructor(props) {
      super(props);
      this.onChangeID = this.onChangeID.bind(this);
      this.onChangeName = this.onChangeName.bind(this);
      this.onChangeRole = this.onChangeRole.bind(this);
      this.onChangeEmail = this.onChangeEmail.bind(this);
      this.onChangeMobile = this.onChangeMobile.bind(this);
      this.onChangeOther = this.onChangeOther.bind(this);
      this.saveEmployee = this.saveEmployee.bind(this);
      this.newEmployee = this.newEmployee.bind(this);
      //this.retriveVendors = this.retrieveVendors.bind(this);
      this.state = {
        name: "",
        role:"Civil Engineer",
        email:"",
        mobile:"",
        projCount:0,
        hasAccount:"",
        username:"",
        other:"",

        submitted: false,
        lastEmployee:[],
        lastEmployeeID:undefined,
        currentIndex: -1,
        id: undefined,
        isSuccess: false
      };
    }
  
  componentDidMount() {
    this.getLastEmployee();
  }

    //onChange functions
  onChangeID(e) {
    this.setState({
      id: e.target.value
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeRole(e) {
    this.setState({
      role: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangeOther(e) {
    this.setState({
      other: e.target.value
    });
  }

  onChangeMobile(e) {
    this.setState({
      mobile: e.target.value
    });
  }

  saveEmployee() {
    
    var data = {
      id: this.state.lastEmployeeID+1,
      name: this.state.name,
      mobile: this.state.mobile,
      role: this.state.role,
      projCount:this.state.projCount,
      email:this.state.email,
      username:"",
      hasAccount:0,
      other: this.state.other
    };

    console.log(data);

    EmployeeDataService.create(data)
    .then(response => {
      this.setState({
        id: response.data.id,
        name: response.data.name,
        role: response.data.role,
        mobile: response.data.mobile,
        email: response.data.email,
        projCount: response.data.projCount,
        username:"",
        hasAccount:0,
        other: response.data.other,
        
      });
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
      //console.log(data);
    });
    
    this.getLastEmployee();
    this.setState({
      isSuccess: true
    })
      
  }

  newEmployee() {
    this.setState({
      id: null,
      name: "",
      role: "",
      mobile:"",
      email:"",
      username:"",
      projCount:0,
      hasAccount:"",
      other: "",

      submitted: false
    });
  }

  getLastEmployee(){
    EmployeeDataService.findlastEmployee()
      .then(response => {
          this.setState({
            lastEmployeeID: response.data[0].id
          });
          //console.log(response.data[0].id);
          console.log(this.state.lastEmployeeID);
          //return response.data[0].id;
        })
        .catch(e => {
          console.log(e);
        });
  }

  displayResult(){
    //this.state.isSuccess
    if(true){
      cogoToast.success(
        <div>
          <div>Employee <b>{this.state.name}</b>added Successfully</div>
        </div>
      );
    }else{
      cogoToast.error(
        <div>
          <div>Failed to add Employee <b>{this.state.name}</b></div>
        </div>
      );
      
    }
    

    setTimeout(() => {
      window.location.href="/employees"
    }, 1000);
  }

  render() {

    return (
      <div className="container">
        <h2><AddCircleOutlineIcon/> NEW EMPLOYEE</h2><hr/>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/admin"}>
            Core Dashboard
          </Link>
          <Link color="inherit" to={"/employees"}>
            Employees
          </Link>
          <Link color="inherit">
            Add Employee
          </Link>
        </Breadcrumbs>

        <div className="mt-2">
          <h5>Enter Employee details</h5>

          <label htmlFor="" hidden>Id</label>
          <input className="form-control" type="number" hidden/>
          <br/>

          <label htmlFor="">Name</label>
          <input className="form-control" type="text" id="name"
            required
            value={this.state.name}
            onChange={this.onChangeName}
            name="name" required/>
          <br/>

          <label htmlFor=""> Main Role</label>

          <select className="form-control" name="" id="role"
          required
          value={this.state.role}
          onChange={this.onChangeRole}
          name="role" required>
            <option value="Civil Engineer" >Civil engineer</option>
            <option value="Project Manager">Project manager</option>
            <option value="Site supervisor" selected>Site supervisor</option>
          </select><br />

          <label htmlFor="">Email</label>
          <input className="form-control" type="email"  id="email"
            required
            value={this.state.email}
            onChange={this.onChangeEmail}
            name="email" required/>
          <br/>

          <label htmlFor="">Mobile</label>
          <input className="form-control" type="text"  id="mobile"
            required
            value={this.state.mobile}
            onChange={this.onChangeMobile}
            name="mobile" required/>
          <br/>

          <label htmlFor="">Other notes: </label>
          <input className="form-control" type="text"  id="other"
            required
            value={this.state.other}
            onChange={this.onChangeOther}
            name="other" required/>
          <br/>

          <div className="row">
            <div className="pr-2"> 
              <a onClick={()=>{this.saveEmployee(); setTimeout(this.setState.bind(this, {position:1}), 3000); this.getLastEmployee();this.displayResult();}} className="btn btn-success">Add</a>
            </div>
            <div className="pr-4"> 
              <a className="btn btn-secondary" type="reset">Cancel</a>
            </div>
          </div>
          <div>
          
          </div>
        </div>
      
      </div>
    );
  }
  
}

export default AddEmployee;
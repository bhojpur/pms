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
import { Modal, Button, Form } from "react-bootstrap";
import EmployeeDataService from "./../../../services/employee.service";
import { Link } from "react-router-dom";
import cogoToast from 'cogo-toast';
import { Breadcrumbs } from "@material-ui/core";
import {Edit,Delete} from '@material-ui/icons';

class EditUser extends Component {

  constructor(props) {
    super(props);
    this.displayUpdateSuccess=this.displayUpdateSuccess.bind(this);
    this.displayDeleteSuccess=this.displayDeleteSuccess.bind(this);
    console.log(this.props.match.params);
    this.state = {
      id: this.props.match.params.id,
      name: "",
      role:"",
      email:"",
      mobile:"",
      projCount:0,
      other:"",
      updateSuccess: false,
      deleteSuccess: false,
      disableButton:true
    };

    this.getEmployee(this.props.match.params.id);
  }

  componentDidMount() {
    
  }
  
  onChangeName(e) {
    this.setState({
      name: e,
      disableButton:false
    });
  }

  onChangeRole(e) {
    this.setState({
      role: e,
      disableButton:false
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e,
      disableButton:false
    });
  }

  onChangeOther(e) {
    this.setState({
      other:e,
     disableButton:false
    });
  }

  onChangeMobile(e) {
    this.setState({
      mobile: e,
      disableButton:false
    });
  }

  displayDeleteSuccess(name){
    //this.state.deleteSuccess
    if(true){
      cogoToast.success(
        <div>
          <div>Employee <b>{name}</b> deleted Successfully</div>
        </div>
      );
    }else{
      cogoToast.danger(
        <div>
          <div>Employee <b>{name}</b>could not be deleted</div>
        </div>
      );
    }
    this.setState({
      deleteSuccess: false
    });
  }

  displayUpdateSuccess(name){

    console.log("stateupd")
    console.log(this.state.updateSuccess)
    //this.state.updateSuccess
    if(true){
      cogoToast.success(
        <div>
          <div>Employee <b>{name}</b> updated Successfully!</div>
        </div>
      );
    }else{
      cogoToast.warn(
        <div>
          <div>Employee <b>{name}</b> could not be updated</div>
        </div>
      );
    }
    this.setState({
      updateSuccess: false
    });
  }

  getEmployee(id){
    EmployeeDataService.getOne(id)
    .then(response => {
      this.setState({
        
        name: response.data.name,
        role: response.data.role,
        mobile: response.data.mobile,
        email: response.data.email,
        projCount: response.data.projCount,
        other: response.data.other,
        //submitted: true
      });
      console.log(response.data);
      //this.getLastEmployee();
    })
    .catch(e => {
      console.log(e);
      //console.log(data);
    });
  }

  updateEmployee(id){
    var data={
    name: this.state.name,
    role:this.state.role,
    mobile:this.state.mobile,
    email: this.state.email,
    other: this.state.other
    }

    EmployeeDataService.update(id,data)
    .then(response => {
      console.log(response.data);
      //this.getLastEmployee();
    })
    .catch(e => {
      console.log(e);
      //console.log(data);
    });

    this.setState({
     updateSuccess: true
    });
    console.log("stateupd")
    console.log(this.state.updateSuccess)

    this.displayUpdateSuccess(this.state.name);
  }

  deleteEmployee(id){

    EmployeeDataService.delete(id)
    .then(response => {
      console.log(response.data);
      //this.getLastEmployee();
    })
    .catch(e => {
      console.log(e);
      //console.log(data);
    });
    
    this.setState({
      deleteSuccess: true
    });
    
    this.displayDeleteSuccess(this.state.name);
    //window.location.href="/employees";
  }

  render() {
    //const {cid}= this.state;
    const {id,name} = this.state;

    return (
      <div className="col-auto">
        <h2><Edit/> EDIT EMPLOYEE DETAILS</h2><hr/>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/admin"}>
            Core Dashboard
          </Link>
          <Link color="inherit" to={"/employee"}>
            Employees
          </Link>
          <Link color="inherit">
            Edit: {this.state.id}
          </Link>
        </Breadcrumbs>
        <div className="mt-2">
          <div className="row pl-3" >
            <p>Employee ID:</p>
            <b className="pl-3">{id}</b>
          </div>

          <label htmlFor="">Name</label>
          <input className="form-control" size="20" type="text" value={this.state.name} 
          onChange={e => this.onChangeName(e.target.value)}
          required/>
          <br/>
          <label htmlFor="">Role</label>

          <select className="form-control" name="role" id="role" value={this.state.role}
          onChange={e => this.onChangeRole(e.target.value)}
          >
            <option value="Civil engineer">Civil engineer</option>
            <option value="Project manager">Project manager</option>
            <option value="Site supervisor">Site supervisor</option>
          </select><br />

          <label htmlFor="">Email</label>
          <input className="form-control" type="text" value={this.state.email}
          onChange={e => this.onChangeEmail(e.target.value)}
          required/>
          <br/>

          <label htmlFor="">Mobile</label>
          <input className="form-control" type="text" value={this.state.mobile}
          onChange={e => this.onChangeMobile(e.target.value)}
          required/>
          <br/>

          <label htmlFor="">Other Notes</label>
          <input className="form-control" type="text" value={this.state.other}
          onChange={e => this.onChangeOther(e.target.value)}
          required/>
          <br/>

          <div className="row">
            <div>
            <button className="btn btn-success" disabled={this.state.disableButton} id="updateBtn" data-target="#promptModal" data-toggle="modal" >Update</button>
            </div>
            <div className="mx-3">
            <a href="/employee" className="btn btn-success">Cancel</a>
            </div>
            <div >
            <button className="btn btn-danger" id="updateBtn" data-target="#deleteModal" data-toggle="modal" ><Delete style={{ fontSize:15 }}/> Delete</button>
            </div>
          </div>
          
        </div>

       {/* Update modal Starts */}
       <div className="modal fade" id="promptModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title" id="exampleModalCenterTitle" style={{ fontSize:20 }}>Are you sure you want to update details of Mr.<b>{this.state.name}?</b> </p>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <a onClick={() =>{this.updateEmployee(id)}} className="btn btn-primary pr-3 ml-2 mr-3" data-dismiss="modal"> Yes, Update</a>
                  <a className="btn btn-secondary ml-6 mr-6 pl-3" data-dismiss="modal"> Cancel</a>
                </div>
              </div>
            </div>
          </div>
          {/* Update modal Ends */}

          {/* Delete modal Starts */}
       <div className="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title" id="exampleModalCenterTitle" style={{ fontSize:20 }}> 
                    Are you sure you want to delete Mr.<b>{this.state.name}</b> as an employee?</p>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <a  className="btn btn-danger pr-3 ml-2 mr-3" onClick={() =>{this.deleteEmployee(id)} } data-dismiss="modal"> Yes, Delete</a>
                  <a className="btn btn-secondary ml-6 mr-6 pl-3" id ="deleteModalDismiss" data-dismiss="modal"> Cancel</a>
                </div>
              </div>
            </div>
          </div>
          {/* Delete modal Ends */}  

      </div>

      
    );
  }
  
}

export default EditUser;
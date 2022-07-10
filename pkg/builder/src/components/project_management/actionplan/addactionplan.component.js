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
import ActionPlanDataService from "./../../../services/project_management/actionplan.service";
import ActionPlanTypeDataService from "../../../services/project_management/actionplantype.service";
import ProjectUserDataService from "../../../services/projectuser.service.js";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Alert from "react-bootstrap/Alert";
import cogoToast from 'cogo-toast';

export default class AddActionPlan extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeActionType = this.onChangeActionType.bind(this);
    this.onChangePlanManager = this.onChangePlanManager.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.saveActionPlan = this.saveActionPlan.bind(this);

    this.state = {
      id: null,
      title: "",
      planmanager: "",
      actiontype: "",
      location: "",
      description: "",
      isApproved: false,
      projectId: this.props.match.params.id, 
      
      actionplantypes: [],
      users: [],
      currentIndex: -1,
      submitted: false,

    };
  }
  componentDidMount() {
    this.retrieveActionPlanTypes(this.props.match.params.id);
    this.retrieveUsers(this.props.match.params.id)
  }

  retrieveActionPlanTypes(id){
    ActionPlanTypeDataService.getAll(id)
    .then(response => {
        this.setState({
          actionplantypes: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveUsers(id){
    ProjectUserDataService.searchUserDetails(id, "Project Manager")
    .then(response => {
        this.setState({
            users: response.data
        });
      console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
  }

  onChangeName(e) {
    this.setState({
      title: e.target.value
    });
    ActionPlanTypeDataService.findByTitle(e.target.value, this.props.match.params.id)
    .then((response) => {
      this.setState({
        isTitleValid: response.data.length,
      });
    })
    .catch((e) => {
      console.log(e);
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeActionType(e) {
    this.setState({
      actiontype: e.target.value
    });
  }

  onChangePlanManager(e) {
    this.setState({
      planmanager: e.target.value
    });
  }

  onChangeLocation(e) {
    this.setState({
      location: e.target.value
    });
  }
  
  saveActionPlan() {  
    if (this.state.title != "" &&
      this.state.planmanager != "" &&
      this.state.actiontype != "" &&
      this.state.location != "" &&
      this.state.description != ""){
    var data = {
      title: this.state.title,
      planmanager:this.state.planmanager,
      actiontype: this.state.actiontype,
      location: this.state.location,
      description: this.state.description,
      isApproved: this.state.isApproved,
      projectId: this.state.projectId
    };

    ActionPlanDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          actiontype: response.data.actiontype,
          location: response.data.location,
          description: response.data.description,
          isApproved: response.data.isApproved,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
        cogoToast.success("Meeting Saved Successfully!");
        this.props.history.push("/actionplan/"+ this.props.match.params.id);
      })
      .catch(e => {
        console.log(e);
      });
    }else{
      cogoToast.error("Field/s cannot be empty");            
    }
  }

  render() {
    const {projectId, currentIndex, actionplantypes, isTitleValid, users} = this.state;
    return (
      <div className="container">
          <div class="container">
            <h2>Add New Action Plan</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">Home</Link>
              <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
              <Link color="inherit" to={"/actionplan/"+projectId}>Action Plan</Link>
              <Link color="inherit" aria-current="page" className="disabledLink">Add New Action Plan</Link>
            </Breadcrumbs><hr/>
            <div className="">
            {/* <div className="form-row">
                <div className="form-group col-md-12">
                  {this.state.title == "" ? "" : isTitleValid > 0 ? 
                    <Alert variant="danger">Name is already taken</Alert> :
                    <Alert variant="success">Name is avaliable to use</Alert>
                  }
                </div>
              </div> */}
              <div className="form-row">
                <div className="form-group col-md-9">
                  <label htmlFor="title">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    required
                    placeholder="Enter a action plan name"
                    value={this.state.title}
                    onChange={this.onChangeName}
                    name="title"
                  />
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="isApproved">Status</label>
                  <input
                    type="text"
                    className="form-control"
                    value="Not Approved"
                    readOnly
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="planmanager">Plan Manager</label>
                  <select
                    type="text"
                    className="form-control"
                    id="planmanager"
                    required
                    value={this.state.planmanager}
                    onChange={this.onChangePlanManager}
                    name="planmanager"
                  >
                    <option value="">Select an Assignee</option>
                      {users && users.map((u, index) => (
                          <option
                              value={u.username}
                              onChange={this.onChangePlanManager}
                              key={index}
                          >
                              {u.username} - {u.position}
                          </option>
                      ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="type">Action Plan Type</label>
                  <select 
                    className="form-control"
                    id="type"
                    required
                    name="type"
                    value={this.state.actiontype}
                    onChange={this.onChangeActionType}
                  >
                    <option value="">Select an Type</option>
                    {actionplantypes && actionplantypes.map((actionplantype, index) => (
                      <option
                        value={actionplantype.title}
                        onChange={this.onChangeActionType}
                        key={index}
                      >
                      {actionplantype.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    placeholder="Enter the location"
                    required
                    value={this.state.location}
                    onChange={this.onChangeLocation}
                    name="location"
                    list="suggest"
                  />
                  <datalist id="suggest">
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                  </datalist>
                </div>
              </div>
              <div className="form row">
                <div className="form-group col-md-12">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    placeholder="Enter a description about the action plan"
                    required
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    name="description"
                  />
                </div>
              </div>
            </div>
            <button onClick={this.saveActionPlan} className="btn btn-success mr-2">Create Action Plan</button>
            <a href="/actionplan">Cancel</a>
          </div>
      </div>
    );
  }
}
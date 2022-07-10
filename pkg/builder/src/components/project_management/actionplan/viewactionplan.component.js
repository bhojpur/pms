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
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangePlanManager = this.onChangePlanManager.bind(this);
    this.onChangeApproved = this.onChangeApproved.bind(this);
    this.onChangeLocation = this.onChangeLocation.bind(this);
    this.updateActionPlan = this.updateActionPlan.bind(this);
    this.deleteActionPlan = this.deleteActionPlan.bind(this);

    this.state = {
        apitem: {
            id: this.props.match.params.apid,
            name: "",
            planmanager: "",
            actiontype: "",
            location: "",
            description: "",
            isApproved: false,
            projectId: this.props.match.params.id,
        },
        actionplantypes: [],
        users: [],
        currentIndex: -1,
        submitted: false,
    };
  }
  componentDidMount() {
    this.retriveAPItemInfo(this.props.match.params.apid);
    this.retrieveUsers(this.props.match.params.id)
  }

  retriveAPItemInfo(plid){
    ActionPlanDataService.getOne(plid)
    .then(response => {
        this.setState({
            apitem: response.data
        });
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

  onChangeDescription(e) {
    const description= e.target.value
    this.setState(function(prevState){
      return {
        apitem: {
          ...prevState.apitem,
          description: description
        }
      }
    });
  }

  onChangePlanManager(e) {
    const planmanager= e.target.value
    this.setState(function(prevState){
      return {
        apitem: {
          ...prevState.apitem,
          planmanager: planmanager
        }
      }
    });
  }

  onChangeApproved(e) {
    const isApproved= e.target.value
    this.setState(function(prevState){
      return {
        apitem: {
          ...prevState.apitem,
          isApproved: isApproved
        }
      }
    });
  }

  onChangeLocation(e) {
    const location= e.target.value
    this.setState(function(prevState){
      return {
        apitem: {
          ...prevState.apitem,
          location: location
        }
      }
      
    });
  }

  getActionPlanTypes(id){
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

  updateActionPlan(){
    if (this.state.apitem.description != "" &&
      this.state.apitem.planmanager != "" &&
      this.state.apitem.location != "" &&
      this.state.apitem.isApproved != "") {
    var data = {
        description: this.state.apitem.description,
        planmanager: this.state.apitem.planmanager,
        location: this.state.apitem.location,
        isApproved: this.state.apitem.isApproved,
        projectId: this.state.apitem.projectId
    };

    ActionPlanDataService.update(this.props.match.params.apid, data)
    .then(response => {
      this.setState(prevState => ({
        apitem: {
          ...prevState.apitem,
        }
      }));
      cogoToast.success("Action Plan updated Successfully!");
      console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
  } else {
    cogoToast.error("Field/s cannot be empty");
  }
  }

  deleteActionPlan(){
    var data = {
        isDeleted: 1
    }
    ActionPlanDataService.update(this.props.match.params.apid, data)
    .then(response => {
        console.log(response.data);
    })
    .catch(e => {
        console.log(e);
    });
    this.props.history.push("/actionplan/"+ this.props.match.params.id + "/" +this.props.match.params.apid);
    window.location.reload();
    cogoToast.success("Action Plan Deleted Successfully!");
  }

  render() {
    const {users, apitem} = this.state;
    return (
      <div className="container">
        <div class="container">
          <h2>View Action Plan</h2>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">Home</Link>
            <Link color="inherit" to={"/projectmanagementhome/" + apitem.projectId}>App Dashboard</Link>
            <Link color="inherit" to={"/actionplansingle/" + apitem.projectId + "/" + apitem.id}>Action Plan Single Page</Link>
            <Link color="inherit" aria-current="page" className="disabledLink">View Action Plan</Link>
          </Breadcrumbs><hr/>
          <div className="">
            <div className="form-row">
              <div className="form-group col-md-8">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={apitem.title}
                  name="name"
                  readOnly
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="type">Action Plan Type</label>
                <input 
                  className="form-control"
                  id="type"
                  readOnly
                  name="type"
                  value={apitem.actiontype}
                  onChange={this.onChangeActionType}
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
                  value={apitem.planmanager}
                  onChange={this.onChangePlanManager}
                  name="planmanager"
                >
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
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="Enter the location"
                  required
                  value={apitem.location}
                  onChange={this.onChangeLocation}
                  name="location"
                  list="suggest"
                />
                <datalist>
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                </datalist>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="isApproved">Status</label>
                {!apitem.isApproved ?
                  <div>
                    <select
                      type="text"
                      onChange={this.onChangeApproved}
                      className="form-control"
                      required
                    >
                      <option value="0" onChange={this.onChangeApproved}>🔴 Not Approved</option>
                      <option value="1" onChange={this.onChangeApproved}>🟢 Approved</option>
                    </select>
                  </div>
                :
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      value="Approved"
                      readOnly
                    />
                  </div>
                }
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
                  value={apitem.description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div>
            </div>
          </div>
          <button className="btn btn-primary mr-2" id="updateBtn" data-target="#promptModal" data-toggle="modal" >Update</button>
          <button className="btn btn-danger mr-2"  id="updateBtn" data-target="#deleteModal" data-toggle="modal">Delete</button>
          <Link to={"/actionplan/"+apitem.projectId} className="">Cancel</Link>
        </div>
        {/* Update modal Starts */}
        <div className="modal fade" id="promptModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <p className="modal-title" id="exampleModalCenterTitle">Are you sure you want to update</p>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <a onClick={this.updateActionPlan} className="btn btn-primary pr-3 ml-2 mr-3" data-dismiss="modal"> Yes, Update</a>
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
                        <p className="modal-title" id="exampleModalCenterTitle">Are you sure you want to delete?</p>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <a  className="btn btn-danger pr-3 ml-2 mr-3" onClick={this.deleteActionPlan} data-dismiss="modal"> Yes, Delete</a>
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
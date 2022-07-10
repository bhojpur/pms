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
import ActionPlanTypeDataService from "../../../services/project_management/actionplantype.service";
import ActionPlanService from "../../../services/project_management/actionplan.service";
import Card from "react-bootstrap/Card";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Alert from "react-bootstrap/Alert";
import cogoToast from 'cogo-toast';

export default class ActionPlan extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.viewActionPlan = this.viewActionPlan.bind(this);
    this.retrieveAPTypes = this.retrieveAPTypes.bind(this);
    this.retriveActionPlans = this.retriveActionPlans.bind(this);
    this.saveActionPlanCategory = this.saveActionPlanCategory.bind(this);
    this.state = {
      id: null,
      title: "",
      description: "",
      projectId: this.props.match.params.id,
      actionplans: [],
      aptypes: [],
      currentIndex: -1,
      isTitleValid: 0,

      submitted: false,
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.retriveActionPlans(this.props.match.params.id);
    this.retrieveAPTypes(this.props.match.params.id);
  }

  retrieveAPTypes(id){
    ActionPlanTypeDataService.getAll(id)
    .then(response => {
        this.setState({
          aptypes: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retriveActionPlans(id) {
    ActionPlanService.getAll(id)
      .then((response) => {
        this.setState({
          actionplans: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
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
      description: e.target.value,
    });
  }

  saveActionPlanCategory() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      projectId: this.props.match.params.id,
    };

    ActionPlanTypeDataService.create(data)
      .then((response) => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          projectId: response.data.projectId,
          submitted: true,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  viewActionPlan(){
    window.location.reload();
    cogoToast.success("Action Plan Type Saved Successfully!");
  }

  render() {
    const { actionplans, currentIndex, projectId, isTitleValid, aptypes, viewActionPlan } = this.state;
    return (
      <div>
      {this.state.submitted ? (
        viewActionPlan()
      ) : (
      <div>
        <h2>ACTION PLAN HOME</h2>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/projectmanagementhome/" + projectId}>
            App Dashboard
          </Link>
          <Link color="inherit" aria-current="page" className="disabledLink">
            Action Plan
          </Link>
        </Breadcrumbs>
        <hr />
        <div>
          <h4 className="mt-2">Action Plan Types</h4>
          <div className="container">
            <div className="form-row">
              <div className="form-group col-md-3">
                <label htmlFor="">Title</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChangeTitle}
                  required
                />
              </div>
              <div className="form-group col-md-8">
                <label htmlFor="">Description</label>
                <input
                  className="form-control"
                  type="text"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  required
                />
              </div>
              <div className="form-group col-md-1">
                <label htmlFor="">.</label>
                <button
                  className="btn btn-primary"
                  onClick={this.saveActionPlanCategory}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-3">
                {this.state.title == "" ? "" : isTitleValid > 0 ? 
                  <Alert variant="danger">Title is already taken</Alert> :
                  <Alert variant="success">Title is avaliable to use</Alert>
                }
              </div>
            </div>
          </div>
          <div className="container row">
            {aptypes && aptypes.map((apt, index) => (
                <div className={"container col-3" + (index === currentIndex ? "active" : "")} key={index} >
                  <Link
                    to={"/viewactionplantype/" + projectId + "/" + apt.title}
                    style={{ "text-decoration": "none" }}
                  >
                    <Card
                      bg={"light"}
                      text={"dark"}
                      style={{ width: "16rem" }}
                      className="bg-light mb-2"
                      variant="outline"
                    >
                      <Card.Body>
                        <Card.Title>
                          <h4>{apt.title}</h4>
                        </Card.Title>
                        <Card.Text>
                          {apt.description == ""
                            ? "No Description"
                            : apt.description}
                        </Card.Text>
                        <Card.Link variant="primary">Click to view</Card.Link>
                      </Card.Body>
                    </Card>
                  </Link>
                </div>
              ))}
          </div>
          <hr />
          <h4>Action Plans</h4>
          <div>
            <Link
              className="btn btn-primary mb-3"
              to={"/addactionplan/" + projectId}
            >
              + Add Action Plan
            </Link>
          </div>
          <div className="container">
            {actionplans &&
              actionplans.map((api, index) => (
                <div
                  className={
                    "container mb-3" + (index === currentIndex ? "active" : "")
                  }
                  key={index}
                >
                  <Card style={{ height: "10rem" }}>
                    <Card.Header>
                      <div className="row">
                        <div className="col-9">
                          <Link
                            to={"/actionplansingle/" + projectId + "/" + api.id}
                            style={{ "text-decoration": "none" }}
                          >
                            <h5>{api.title}</h5>
                          </Link>
                        </div>
                        <div className="col-3">
                          <Link
                            to={ "/viewactionplantype/" + projectId + "/" + api.actiontype}
                            style={{ "text-decoration": "none" }}
                          >
                            <h6>Action Type: {api.actiontype}</h6>
                          </Link>
                        </div>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <div className="row">
                          <div className="col-6">
                            <p>Description : {api.description} </p>
                            <p>Location : {api.location}</p>
                          </div>
                          <div className="col-6">
                            <p>Plan Manager : {api.planmanager}</p>
                            {api.isApproved == false
                              ? "Not Approved 🔴"
                              : "Approved 🟢"}
                          </div>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      </div>
      )}
      </div>
    );
  }
}
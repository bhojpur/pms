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
import Card from "react-bootstrap/Card";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import PunchListTypesDataService from "./../../../services/project_management/punchlisttypes.service.js";
import PunchlistDataService from "./../../../services/project_management/punchlist.service.js";
import cogoToast from "cogo-toast";

class PunchList extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.savePunchListType = this.savePunchListType.bind(this);
    this.retrievePLT = this.retrievePLT.bind(this);
    this.retrievePL = this.retrievePL.bind(this);
    this.retrievePunchListStatus = this.retrievePunchListStatus.bind(this);

    this.state = {
      id: null,
      title: "",
      description: "",
      projectId: this.props.match.params.id,
      pltypes: [],
      currentIndex: -1,
      punchlistI: 0,
      punchlistRFR: 0,
      punchlistRTCL: 0,
      punchlistWIP: 0,
      submitted: false,
    };
  }

  componentDidMount() {
    this.retrievePLT(this.props.match.params.id);
    this.retrievePL(this.props.match.params.id);
    this.retrievePunchListStatus(this.props.match.params.id);
  }

  retrievePLT(projectId) {
    PunchListTypesDataService.getAll(projectId).then((response) => {
      this.setState({
        pltypes: response.data,
      });
    });
  }

  retrievePL(projectId) {
    PunchlistDataService.getAll(projectId).then((response) => {
      this.setState({
        plis: response.data,
      });
    });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    });
  }

  savePunchListType() {
    var data = {
      title: this.state.title,
      description: this.state.description,
      projectId: this.props.match.params.id,
    };

    PunchListTypesDataService.create(data).then((response) => {
      this.setState({
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        projectId: response.data.projectId,
        submitted: true,
      });
      console.log(response.data);
    });
    this.props.history.push("/punchlist/" + this.props.match.params.id);
    cogoToast.success("Punch List Type Added successfully!");
  }

  retrievePunchListStatus(id) {
    PunchlistDataService.getStatus(id, "Initiated")
    .then((response) => {
        this.setState({
            punchlistI: response.data.length,
        });
    });
    PunchlistDataService.getStatus(id, "WIP")
    .then((response) => {
        this.setState({
            punchlistWIP: response.data.length,
        });
    });
    PunchlistDataService.getStatus(id, "RFR")
    .then((response) => {
        this.setState({
            punchlistRFR: response.data.length,
        });
    });
    PunchlistDataService.getStatus(id, "Completed")
    .then((response) => {
        this.setState({
          punchlistRTCL: response.data.length,
        });
    });
  }

  render() {
    const { projectId, pltypes, plis, currentIndex, punchlistI, punchlistRFR, punchlistRTCL, punchlistWIP } = this.state;
    return (
      <div className="">
        <div>
          <h2>PUNCH LISTS</h2>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">
              Home
            </Link>
            <Link color="inherit" to={"/projectmanagementhome/" + projectId}>
              App Dashboard
            </Link>
            <Link color="inherit" aria-current="page" className="disabledLink">
              Punch List
            </Link>
          </Breadcrumbs>
          <hr />
          <div className="container row">
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm">
                <h1 className="text-center">{punchlistI}</h1>
                <h3 className="h5 nav-heading-title text-center">Initiated</h3>
                </div>
            </div>
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm">
                <h1 className="text-center">{punchlistWIP}</h1>
                <h3 className="h5 nav-heading-title text-center">Work in Progress</h3>
                </div>
            </div>
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm">
                <h1 className="text-center">{punchlistRFR}</h1>
                <h3 className="h5 nav-heading-title text-center">Ready for review</h3>
                </div>
            </div>
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm">
                <h1 className="text-center">{punchlistRTCL}</h1>
                <h3 className="h5 nav-heading-title text-center">Completed</h3>
                </div>
            </div>
          </div>
          <h4 className="mt-2">Punch List Types</h4>
          <hr />
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
                <Link
                  className="btn btn-primary"
                  onClick={this.savePunchListType}
                >
                  Add
                </Link>
              </div>
            </div>
            <div className="container row">
              {pltypes && pltypes.map((plt, index) => (
                  <div className={"container col-3" + (index === currentIndex ? "active" : "")} key={index} >
                    <Link
                      to={"/viewtype/" + plt.id}
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
                            <h4>{plt.title}</h4>
                          </Card.Title>
                          <Card.Text>
                            {plt.description == ""
                              ? "No Description"
                              : plt.description}
                          </Card.Text>
                          <Card.Link variant="primary">Click to view</Card.Link>
                        </Card.Body>
                      </Card>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
          <h4 className="mt-3">Punch Lists Items</h4>
          <hr />
          <Link
            to={"/managepunchlist/create/" + projectId}
            className="btn btn-primary mb-2"
          >
            + Add Punch List Item
          </Link>
          {/* <div className="container md-6"> */}
          <ul className="list-group">
            {plis &&
              plis.map((plti, index) => (
                <li
                  className={
                    "list-group-item" + (index === currentIndex ? "active" : "")
                  }
                  key={index}
                >
                  <div className="container row">
                    <div className="col-9">
                      <Link
                        to={"/view/" + projectId + "/"+ plti.no}
                        style={{ "text-decoration": "none" }}
                      >
                        {plti.no + " - " + plti.title}
                      </Link>
                    </div>
                    <div className="col-3">
                      <h6>
                        {plti.status == "Initiated"
                          ? "Initiated 🟡"
                          : plti.status == "WIP"
                          ? "Work in Progress 🟠"
                          : plti.status == "RFR"
                          ? "Ready to Review 🔵"
                          : plti.status == "WNA"
                          ? "Work not Accepted 🔴"
                          : "All work Completed 🟢"}
                      </h6>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          {/* </div> */}
        </div>
      </div>
    );
  }
}

export default PunchList;
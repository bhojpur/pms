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
import PunchlistDataService from "../../../services/project_management/punchlist.service.js";
import PunchListTypesDataService from "../../../services/project_management/punchlisttypes.service.js";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Table from "react-bootstrap/Table";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";

class PLTView extends Component {
  constructor(props) {
    super(props);
    this.retrievePLT = this.retrievePLT.bind(this);
    this.state = {
      id: this.props.match.params.pltid,
      projectId: "",
      plitems: [],
      title: "",
      description: "",
    };
  }

  componentDidMount() {
    this.retrievePLT(this.props.match.params.pltid);
    this.retriveTypeInfo(this.props.match.params.pltid);
  }

  retriveTypeInfo(pltid) {
    PunchListTypesDataService.getOne(pltid).then((response) => {
      this.setState({
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        projectId: response.data.projectId,
      });
    });
  }

  retrievePLT(pltid) {
    PunchlistDataService.getType(pltid).then((response) => {
      this.setState({
        plitems: response.data,
      });
    });
  }

  render() {
    const { projectId, title, description, plitems } = this.state;
    return (
      <div>
        <h2>Punch List Type - {title}</h2>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">Home</Link>
          <Link color="inherit" to={"/projectmanagementhome/" + projectId}>App Dashboard</Link>
          <Link color="inherit" to={"/punchlist/" + projectId}>Punch List</Link>
          <Link color="inherit" aria-current="page" className="disabledLink">View Punch List Types</Link>
        </Breadcrumbs>
        <hr />
        <h5>{description}</h5>
        <h6>🟡 - Initiated</h6>
        <h6>🟠 - Work in Progress</h6>
        <h6>🔵 - Ready for Review</h6>
        <h6>🔴 - Work not accepted</h6>
        <h6>🟢 - Ready to close</h6>
        <hr />
        <h3 className="mb-3">Punch List Items</h3>
        <Table striped bordered hover variant="" responsive>
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Location</th>
              <th>Due Date</th>
              <th>Assignee</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {plitems &&
              plitems.map((pli, index) => (
                <tr key={index}>
                  <td>{pli.no}</td>
                  <td>{pli.title}</td>
                  <td>{pli.description}</td>
                  <td>{pli.location}</td>
                  <td>{pli.duedate}</td>
                  <td>{pli.assignee}</td>
                  <td>
                    {pli.status == "Initiated"
                      ? "🟡"
                      : pli.status == "WIP"
                      ? "🟠"
                      : pli.status == "RFR"
                      ? "🔵"
                      : pli.status == "WNA"
                      ? "🔴"
                      : "🟢"}
                  </td>
                  <td>
                    <Link to={"/view/" + projectId + "/" + pli.no}>
                      <button className="btn btn-success mr-2">
                        View
                        <VisibilityIcon />
                      </button>
                    </Link>
                    <Link to={"/deletepl/" + pli.no}>
                      <button className="btn btn-danger">
                        Delete
                        <DeleteIcon />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default PLTView;
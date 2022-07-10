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
import ActionPlanSectionDataService from "./../../../services/project_management/actionplansection.service";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Table from "react-bootstrap/Table";
import cogoToast from 'cogo-toast';
import UpdateIcon from '@material-ui/icons/Update';
import DeleteIcon from "@material-ui/icons/Delete";

export default class AddAPSection extends Component {
  constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        // this.onChangeReftype = this.onChangeReftype.bind(this);
        // this.onChangeRefid = this.onChangeRefid.bind(this);
        this.onChangeAcceptance = this.onChangeAcceptance.bind(this);
        this.onChangeDuedate = this.onChangeDuedate.bind(this);
        this.retrieveAPSection = this.retrieveAPSection.bind(this);
        this.saveAPsection = this.saveAPsection.bind(this);

        this.state = {
            id: null,
            title: "",
            // reftype: "",
            // refid: "",
            acceptance: "",
            duedate: "",
            actionplanId: this.props.match.params.apid,
            projectId: this.props.match.params.id,
            actionplansections: [],
            currentIndex: -1,

            submitted: false,
        };
    }

    componentDidMount() {
        this.retrieveAPSection(this.props.match.params.apid);
    }

    retrieveAPSection(id){
        ActionPlanSectionDataService.getAll(id)
        .then(response => {
            this.setState({
                actionplansections: response.data
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }
    
    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeAcceptance(e) {
        this.setState({
            acceptance: e.target.value
        });
    }

    onChangeDuedate(e) {
        this.setState({
            duedate: e.target.value
        });
    }

    // onChangeRefid(e) {
    //     this.setState({
    //         refid: e.target.value
    //     });
    // }

    // onChangeReftype(e) {
    //     this.setState({
    //         reftype: e.target.value
    //     });
    // }
    
    saveAPsection() {  
        if (this.state.acceptance != "" &&
            this.state.duedate != "" &&
            this.state.title != "") {
        var data = {
            // reftype: this.state.reftype,
            // refid: this.state.refid,
            title: this.state.title,
            acceptance: this.state.acceptance,
            duedate: this.state.duedate,
            actionplanId: this.state.actionplanId,
        };

        ActionPlanSectionDataService.create(data)
        .then(response => {
            this.setState({
            id: response.data.title,
            // reftype: response.data.reftype,
            // refid: response.data.refid,
            acceptance: response.data.acceptance,
            duedate: response.data.duedate,
            actionplanId: this.props.match.params.apid,

            submitted: true
        });
            console.log(response.data);
            cogoToast.success("Meeting Saved Successfully!");
            this.props.history.push("/actionplansingle/" + this.props.match.params.id + "/" + this.props.match.params.apid);
        })
    } else {
        cogoToast.error("Field/s cannot be empty");
    }
    }

    deleteWeatherLog(e){
        console.log(e.target.value);
        var data = {
            isDeleted: 1
        }
        ActionPlanSectionDataService.update(e.target.value, data)
        .then(response => {
            console.log(response.data);
        })
        window.location.reload();
        cogoToast.success("Action Plan Section Deleted Successfully!");
    }

    render() {
        const {actionplanId, projectId, actionplansections} = this.state;
        return (
            <div className="container">
                <div class="container">
                    <h2>Add New Action Plan Section</h2>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/home">Home</Link>
                        <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                        <Link color="inherit" to={"/actionplan/" + projectId}>Action Plan</Link>
                        <Link color="inherit" to={"/actionplansingle/" + projectId + "/" + actionplanId}>Action Plan Single Page</Link>
                        <Link color="inherit" aria-current="page" className="disabledLink">Add Action Plan Section</Link>
                    </Breadcrumbs><hr/>
                    <div className="">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    required
                                    placeholder="Enter a title to the section "
                                    value={this.state.title}
                                    onChange={this.onChangeTitle}
                                    name="title"
                                />
                            </div>
                            <div className="form-group col-md-5">
                                <label htmlFor="acceptance">Acceptance</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="acceptance"
                                    required
                                    placeholder="Enter acceptance"
                                    value={this.state.acceptance}
                                    onChange={this.onChangeAcceptance}
                                    name="acceptance"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="duedate">Due Date</label>
                                <input
                                    className="form-control"
                                    name="duedate"
                                    placeholder="Enter due date"
                                    value={this.state.duedate}
                                    onChange={this.onChangeDuedate}
                                    type="date"
                                    min="2021-09-23"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={this.saveAPsection} className="btn btn-primary mr-2">Create Action Plan Section</button>
                    <Link to={"/actionplansingle/" + projectId + "/" + actionplanId}>Cancel</Link>
                    <hr />
                    <h4 className="mb-3">Current Action Plan Sections</h4>
                    <Table striped bordered hover variant="" responsive>
                    <thead>
                        <tr>
                        <th>Title</th>
                        <th>Acceptance</th>
                        <th>Due Date</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {actionplansections && actionplansections.map((aps, index) => (
                            <tr key={index}>
                            <td>{aps.title}</td>
                            <td>{aps.acceptance}</td>
                            <td>{aps.duedate}</td>
                            <td>
                                <Link to={"/viewactionplansection/" + projectId +"/" + aps.id}>
                                    <button className="btn btn-success mr-2">Update <UpdateIcon/></button>
                                </Link>
                                <button className="btn btn-danger" >Delete <DeleteIcon /></button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}
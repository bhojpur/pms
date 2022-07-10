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
import PLAssigneesDataService from "../../../services/project_management/punchlistassignees.service.js";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

class CreateAssignees extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.saveAssignees = this.saveAssignees.bind(this);

        this.state = {
            projectId: this.props.match.params.id,
            punchlistNo: this.props.match.params.plid,
            id: null,
            name: "",
            role: "",
            lastpl: [],
            
            submitted: false
        };
    }

    componentDidMount() {
        this.getLastPunchListID();
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

    saveAssignees() {
        var data = {
            name: this.state.name,
            role: this.state.role,
            punchlistNo: this.state.punchlistNo
        };

        PunchlistDataService.create(data)
        .then(response => {
            this.setState({
                id: response.data.id,
                name: response.data.name,
                role: response.data.role,
                punchlistNo: response.data.punchlistNo,

                submitted: true
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    getLastPunchListID(){
        PunchlistDataService.findlastItem()
        .then(response => {
            this.setState({
                lastpl: response.data,
                punchlistNo: response.data[0].no
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    saveAssignees() {
        var data = {
            name: this.state.name,
            role: this.state.role,
            punchlistNo: this.state.punchlistNo
        };

        PLAssigneesDataService.create(data)
        .then(response => {
            this.setState({
                id: response.data.id,
                name: response.data.name,
                role: response.data.role,
                punchlistNo: response.data.punchlistNo,

                submitted: true
            });
            console.log(response.data);
        })
    }

    render() {
        const {punchlistNo, projectId} = this.state;
        return (
        <div className="">
            {this.state.submitted ? (
                <div>
                    <div>
                        <h4>Punch List Item successfully Created!</h4>
                        <button className="btn btn-success">Go to punch list page</button>
                        {/* <button className="btn btn-primary">Home page</button> */}
                    </div>
                </div>
            ) : (
            <div className="">
                <h2>Add New Punch List Item</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/punchlist/"+projectId}>Punch List</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">Add New Punch List</Link>
                </Breadcrumbs><hr/>
                <div className="row mb-3">
                    <div className="col-sm-8">
                    <h5>Step 3: Add Assignees</h5>
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Name</label>
                                    <input
                                        className="form-control"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.onChangeName}
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Role</label>
                                    <input
                                        className="form-control"
                                        name="role"
                                        value={this.state.role}
                                        onChange={this.onChangeRole}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                            <hr />
                            <button
                            type="button"
                            onClick={this.saveAssignees}
                            className="btn btn-primary mr-2"
                            >Save</button>
                            <a href="/punchlist" className="">Cancel</a>
                        </form>
                    </div>
                    <div className="col-sm-4">
                        <Timeline>
                            <TimelineItem>
                                <TimelineSeparator><TimelineDot /><TimelineConnector /></TimelineSeparator>
                                <TimelineContent><h6><strong>Step 1</strong><br/>Basic Details</h6></TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                            <TimelineSeparator><TimelineDot /><TimelineConnector /></TimelineSeparator>
                                <TimelineContent><h6><strong>Step 2</strong><br/>Link Photos</h6></TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                                <TimelineSeparator><TimelineDot /></TimelineSeparator>
                                <TimelineContent><h5><strong>Step 2</strong><br/>Add Assignees</h5></TimelineContent>
                            </TimelineItem>
                        </Timeline>
                    </div>
                </div>
            </div>
        )}
        </div>
        );
    }
}

export default CreateAssignees;
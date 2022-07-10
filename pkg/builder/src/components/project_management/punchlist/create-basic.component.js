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
import AuthService from "../../../services/auth.service";
import PunchlistDataService from "../../../services/project_management/punchlist.service.js";
import PunchListTypesDataService from "../../../services/project_management/punchlisttypes.service.js";
import ProjectUserDataService from "../../../services/projectuser.service.js";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import cogoToast from 'cogo-toast';
import { TextareaAutosize } from "@material-ui/core";

class CreatePL extends Component {
    constructor(props) {
        super(props);
        this.onChangeDuedate = this.onChangeDuedate.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        // this.onChangePunchmanager = this.onChangePunchmanager.bind(this);
        // this.viewPunchList = this.viewPunchList.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeAssignee = this.onChangeAssignee.bind(this);
        this.savePunchListItem = this.savePunchListItem.bind(this);
        // this.buttonChange = this.buttonChange.bind(this);

        this.state = {
            no: null,
            position: "Engineer",
            status: "Initiated",
            duedate: "",
            title: "",
            location: "",
            assignee: "",
            description: "",
            projectmanager: "",
            projectId: this.props.match.params.id,
            lastpl:"",
            users: [],
            pltypes: [],
            // buttonChanger: undefined,
            currentUser: AuthService.getCurrentUser(),
            submitted: false
        };
    }

    componentDidMount() {
        this.retrievePLT(this.props.match.params.id);
        this.retrieveUsers(this.props.match.params.id);
    }

    retrievePLT(id){
        PunchListTypesDataService.getAll(id)
        .then(response => {
            this.setState({
                pltypes: response.data
            });
        });
    }

    retrieveUsers(id){
        ProjectUserDataService.searchUserDetails(id, "Engineer")
        .then(response => {
            this.setState({
                users: response.data
            });
        console.log(response.data);
        console.log("enineer gaththa");
        })
        .catch(e => {
            console.log(e);
        });
    }

    onChangeDuedate(e) {
        this.setState({
            duedate: e.target.value
        });
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeType(e) {
        this.setState({
            type: e.target.value
        });
    }

    onChangeLocation(e) {
        this.setState({
            location: e.target.value
        });
    }

    onChangeAssignee(e) {
        this.setState({
            assignee: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    savePunchListItem() {
        if(this.state.status != "" &&
        this.state.duedate != "" &&
        this.state.title != "" &&
        this.state.location != "" &&
        this.state.type != "" &&
        this.state.assignee != "" &&
        this.state.description != "" ){
            var data = {
                status: this.state.status,
                duedate: this.state.duedate,
                title: this.state.title,
                type: this.state.type,
                location: this.state.location,
                punchmanager: this.state.punchmanager,
                assignee: this.state.assignee,
                description: this.state.description,
                projectId: this.props.match.params.id
            };
            // this.setState({
            //     buttonChanger: "True"
            // })
            PunchlistDataService.create(data)
            .then(response => {
                this.setState({
                    no: response.data.no,
                    status: response.data.status,
                    duedate: response.data.duedate,
                    title: response.data.title,
                    type: response.data.type,
                    location: response.data.location,
                    punchmanager: response.data.punchmanager,
                    assignee: response.data.assignee,
                    description: response.data.description,
                    projectId: response.data.projectId,

                    submitted: true
                });
                cogoToast.success("Punch List - Basic Details Saved Successfully!");
            });
        }else{
            cogoToast.error("Field/s cannot be empty");
        }
    }

    getLastPunchListID(){
        PunchlistDataService.findlastItem()
        .then(response => {
            this.setState({
                lastpl: response.data.no
            });
        });
    }

    // buttonChange(){
    //     console.log("Yes, Linking Button is succesful");
    // }

    render() {
        const {lastpl, pltypes, projectId, users} = this.state;
        return (
        <div className="">
            <div className="">
                <h2>Add New Punch List Item</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/punchlist/"+projectId}>Punch List</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">Add New Punch List</Link>
                </Breadcrumbs><hr/>
                <div className="">
                    {/* <div className="col-sm-8"> */}
                        {/* <h5>Step 1: Basic Details</h5> */}
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Title</label>
                                    <input
                                        className="form-control"
                                        name="title"
                                        placeholder="Enter a punch list title"
                                        value={this.state.title}
                                        onChange={this.onChangeTitle}
                                        type="text"
                                        list="suggest"
                                        required
                                    />
                                    <datalist id="suggest">
                                        <option value="A/C doesn't work">A/C doesn't work</option>
                                        <option value="Water line blocked">Water line blocked</option>
                                        <option value="Dim Light">Dim Light</option>
                                        <option value="Chipped door frame">Chipped door frame</option>
                                    </datalist>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Status</label>
                                    <input
                                        className="form-control"
                                        name="status"
                                        type="text"
                                        value="Initiated"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Type</label>
                                    <select
                                        className="form-control"
                                        name="type"
                                        value={this.state.type}
                                        onChange={this.onChangeType}
                                        type="text"
                                        required
                                    >
                                        <option value="">Select a type</option>
                                        {pltypes && pltypes.map((pli, index) => (
                                            <option
                                                value={pli.id}
                                                onChange={this.onChangeType}
                                                key={index}
                                            >
                                                {pli.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Location</label>
                                    <input
                                        className="form-control"
                                        name="location"
                                        placeholder="Enter the location"
                                        value={this.state.location}
                                        onChange={this.onChangeLocation}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Assignee</label>
                                    <select
                                        className="form-control"
                                        name="assignee"
                                        value={this.state.assignee}
                                        onChange={this.onChangeAssignee}
                                        type="text"
                                        required
                                    >
                                    <option value="">Select an Assignee</option>
                                    {users && users.map((u, index) => (
                                        <option
                                            value={u.username}
                                            onChange={this.onChangeAssignee}
                                            key={index}
                                        >
                                            {u.username} - {u.position}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="">Due Date</label>
                                    <input
                                        className="form-control"
                                        name="duedate"
                                        min="2021-09-23"
                                        value={this.state.duedate}
                                        onChange={this.onChangeDuedate}
                                        type="date"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="">Description</label>
                                    <TextareaAutosize
                                        className="form-control"
                                        name="description"
                                        placeholder="Enter a description about the punch list"
                                        value={this.state.description}
                                        onChange={this.onChangeDescription}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                            <hr />
                            {/* {!buttonChanger && */}
                                <button
                                type="button"
                                onClick={this.savePunchListItem}
                                className="btn btn-primary mr-2"
                                >Save</button>
                            {/* }{buttonChanger && */}
                                {/* <Link
                                to={"/managepunchlist/createaddphoto/" + projectId + "/" + lastpl}
                                type="button"
                                onClick={this.buttonChange}
                                className="btn btn-primary mr-2"
                                >Next: Link Photos</Link> */}
                            {/* // } */}
                            <Link to={"/punchlist/"+projectId} className="">Cancel</Link>
                        </form>
                    {/* </div> */}
                    {/* <div className="col-sm-4">
                        <Timeline>
                            <TimelineItem>
                                <TimelineSeparator><TimelineDot /><TimelineConnector /></TimelineSeparator>
                                <TimelineContent><h5><strong>Step 1</strong><br/>Basic Details</h5></TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                            <TimelineSeparator><TimelineDot /></TimelineSeparator>
                                <TimelineContent><h6><strong>Step 2</strong><br/>Link Photos</h6></TimelineContent>
                            </TimelineItem> */}
                            {/* <TimelineItem>
                                <TimelineSeparator><TimelineDot /></TimelineSeparator>
                                <TimelineContent><h6><strong>Step 2</strong><br/>Add Assignees</h6></TimelineContent>
                            </TimelineItem> */}
                        {/* </Timeline>
                    </div> */}
                </div>
            </div>
        {/* )} */}
        </div>
        );
    }
}

export default CreatePL;
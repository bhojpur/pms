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
import PLPhotosDataService from "../../../services/project_management/punchlistphotos.service.js";
import { WebcamCapture } from './../photos/webcam.component';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

class CreatePhotos extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.savePhotos = this.savePhotos.bind(this);
        this.buttonChange = this.buttonChange.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.closeCamera = this.closeCamera.bind(this);

        this.state = {
            projectId: this.props.match.params.id,
            punchlistNo: this.props.match.params.plid,
            id: null,
            name: "",
            description: "",
            lastpl: [],
            isCam: 0,

            submitted: false
        };
    }

    componentDidMount() {
        this.getLastPunchListID();
    }

    openCamera() {
        this.setState({
            isCam: 1
        })
    }

    closeCamera() {
        this.setState({
            isCam: 0
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    savePhotos() {
        var data = {
            name: this.state.name,
            description: this.state.description,
            punchlistNo: this.state.punchlistNo
        };

        PunchlistDataService.create(data)
        .then(response => {
            this.setState({
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                punchlistNo: response.data.punchlistNo,

                submitted: true
            });
            console.log(response.data);
        })
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

    savePhotos() {
        var data = {
            name: this.state.name,
            description: this.state.description,
            punchlistNo: this.state.punchlistNo
        };

        this.setState({
            buttonChanger: "True"
        })

        PLPhotosDataService.create(data)
        .then(response => {
            this.setState({
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                punchlistNo: response.data.punchlistNo,

                submitted: true
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    buttonChange(){
        console.log("Yes, Linking Button is succesful");
    }

    render() {
        const {punchlistNo, isCam, buttonChanger, projectId} = this.state;
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
                <div className="row mb-3">
                    <div className="col-sm-8">
                    <h5>Step 2: Link Photos</h5>
                        <form>
                            <div className="form-row">
                                <div className="form-group col-md-4">
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
                                <div className="form-group col-md-8">
                                    <label htmlFor="">Description</label>
                                    <input
                                        className="form-control"
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.onChangeDescription}
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                            {isCam == 0 && (
                                <button className="btn btn-primary" onClick={this.openCamera}>Start Camera</button>
                            )}
                            {isCam == 1 && (
                                <div>
                                    <button className="btn btn-primary" onClick={this.closeCamera}>Stop Camera</button>
                                    <WebcamCapture/>
                                </div>
                            )}
                            </div>
                            <hr />
                            {/* {!buttonChanger && */}
                                <button
                                type="button"
                                onClick={this.savePhotos}
                                className="btn btn-primary mr-2"
                                >Save</button>
                            {/* }{buttonChanger &&
                                <Link
                                to={"/managepunchlist/createaddassignee/" + projectId + "/" + punchlistNo}
                                type="button"
                                onClick={this.buttonChange}
                                className="btn btn-primary mr-2"
                                >Next: Add Assignees</Link>
                            } */}
                            <Link to={"/punchlist"+projectId} className="">Cancel</Link>
                        </form>
                    </div>
                    <div className="col-sm-4">
                        <Timeline>
                            <TimelineItem>
                                <TimelineSeparator><TimelineDot /><TimelineConnector /></TimelineSeparator>
                                <TimelineContent><h6><strong>Step 1</strong><br/>Basic Details</h6></TimelineContent>
                            </TimelineItem>
                            <TimelineItem>
                            <TimelineSeparator><TimelineDot /></TimelineSeparator>
                                <TimelineContent><h5><strong>Step 2</strong><br/>Link Photos</h5></TimelineContent>
                            </TimelineItem>
                            {/* <TimelineItem>
                                <TimelineSeparator><TimelineDot /></TimelineSeparator>
                                <TimelineContent><h6><strong>Step 2</strong><br/>Add Assignees</h6></TimelineContent>
                            </TimelineItem> */}
                        </Timeline>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default CreatePhotos;
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
import MeetingDataService from "../../../services/project_management/meeting.service.js";
import MeetingCategoryDataService from "../../../services/project_management/meetingcategory.service.js";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';
import { TextareaAutosize } from "@material-ui/core";

class CreateFollowupMeetings extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.saveMeeting = this.saveMeeting.bind(this);

        this.state = {
            meetingcategory: {
                id: this.props.match.params.cid,
                overview: "",
                projectId: this.props.match.params.id,
            },
            meeting: [],
            projectId: this.props.match.params.id,
            category: this.props.match.params.cid,
            submitted: false
        };
    }

    componentDidMount() {
        this.retrieveLastMeetinginCategory(this.props.match.params.cid);
        this.retrieveMeetingCategory(this.props.match.params.cid);
    }

    retrieveLastMeetinginCategory(cid) {
        MeetingDataService.getLastCatMeeting(cid)
        .then(response => {
            this.setState({
                meeting: response.data
            })
        })
    }

    retrieveMeetingCategory(cid) {
        MeetingCategoryDataService.get(cid)
        .then(response => {
            this.setState({
                meetingcategory: response.data
            })
        })
    }

    onChangeName(e) {
        const name= e.target.value
        this.setState(function(prevState){
            return {
                meeting: {
                    ...prevState.meeting,
                    name: name
                }
            }
        });
    }

    onChangeDate(e) {
        const date= e.target.value
        this.setState(function(prevState){
            return {
                meeting: {
                    ...prevState.meeting,
                    date: date
                }
            }
        });
    }

    onChangeTime(e) {
        const time= e.target.value
        this.setState(function(prevState){
            return {
                meeting: {
                    ...prevState.meeting,
                    time: time
                }
            }
            
        });
    }

    onChangeLocation(e) {
        const location= e.target.value
        this.setState(function(prevState){
            return {
                meeting: {
                    ...prevState.meeting,
                    location: location
                }
            }
            
        });
    }

    saveMeeting() {
        if (this.state.name != "" &&
        this.state.date != "" &&
        this.state.time != "" &&
        this.state.location != "" ) {
            var data = {
                name: this.state.name,
                category: this.state.category,
                status: this.state.status,
                date: this.state.date,
                time: this.state.time,
                location: this.state.location,
                projectId: this.props.match.params.id
            };

            MeetingDataService.create(data)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    category: response.data.category,
                    status: response.data.status,
                    date: response.data.date,
                    time: response.data.time,
                    location: response.data.location,
                    projectId: response.data.projectId,

                    submitted: true
                });
                this.props.history.push("/meetings/"+ this.props.match.params.id);
                window.location.reload();
                cogoToast.success("Meeting Saved Successfully!");
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        } else {
            cogoToast.error("Field/s cannot be empty");            
        }
    }

    render() {
        const {meeting, meetingcategory} = this.state;
        return (
        <div className="">
            <div className="">
                <h2>Add a Follow-up Meeting</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+meetingcategory.projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/meetings/"+meetingcategory.projectId}>Meetings</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">Add a Follow-up Meetings</Link>
                </Breadcrumbs><hr/>
                <div>
                    <div className="form-row">
                        <div className="form-group col-md-5">
                            <label htmlFor="">Meeting Name</label>
                            <input
                                className="form-control"
                                name="name"
                                value={meeting.name}
                                onChange={this.onChangeName}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">Category</label>
                            <input
                                className="form-control"
                                name="category"
                                value={meetingcategory.overview}
                                type="text"
                                readOnly
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="">Status</label>
                            <input
                                className="form-control"
                                name="status"
                                type="text"
                                value="Scheduled"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="">Date</label>
                            <input
                                className="form-control"
                                name="date"
                                min="2021-09-23"
                                value={meeting.date}
                                onChange={this.onChangeDate}
                                type="date"
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">Time</label>
                            <input
                                className="form-control"
                                name="time"
                                value={meeting.time}
                                onChange={this.onChangeTime}
                                type="time"
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">Location</label>
                            <input
                                className="form-control"
                                name="location"
                                value={meeting.location}
                                onChange={this.onChangeLocation}
                                type="text"
                                list="suggest"
                                required
                            />
                            <datalist id="suggest">
                                <option value="ZOOM">ZOOM</option>
                                <option value="Microsoft Teams">Microsoft Teams</option>
                                <option value="Google Meet">Google Meet</option>
                            </datalist>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="">Description</label>
                            <TextareaAutosize
                                rows="2"
                                className="form-control"
                                name="description"
                                placeholder="Any other information"
                                value={this.state.description}
                                onChange={this.onChangeDescription}
                                type="description"
                                required
                            />
                        </div>
                    </div>
                    <hr />
                    <button
                    type="button"
                    onClick={this.saveMeeting}
                    className="btn btn-primary mr-2"
                    >Save</button>
                    <Link to={"/meeting/"+meeting.projectId} className="">Cancel</Link>
                </div>
            </div>
        </div>
        );
    }
}

export default CreateFollowupMeetings;
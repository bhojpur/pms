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
import ScheduleDataService from "./../../../services/schedule.service";
import MeetingCategoryDataService from "../../../services/project_management/meetingcategory.service.js";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';
import { TextareaAutosize } from "@material-ui/core";

class CreateMeeting extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.saveMeeting = this.saveMeeting.bind(this);
        this.saveSchedule = this.saveSchedule.bind(this);

        this.state = {
            categories: [],
            no: null,
            name: "",
            category: "",
            status: "Scheduled",
            date: "",
            time: "",
            location: "",
            description: "",
            projectId: this.props.match.params.id,
            submitted: false
        };
    }

    componentDidMount() {
        this.retrieveCategories(this.props.match.params.id);
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeCategory(e) {
        this.setState({
            category: e.target.value
        });
    }

    onChangeDate(e) {
        this.setState({
            date: e.target.value
        });
    }

    onChangeTime(e) {
        this.setState({
            time: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeLocation(e) {
        this.setState({
            location: e.target.value
        });
    }

    saveSchedule() {

        var data = {
            title: this.state.name,
            startDate: this.state.date,
            userId: "4"
        };

        ScheduleDataService.create(data)
            .then(response => {
                this.setState({
                    title: response.dataSend.title,
                    startDate: response.dataSend.startDate,
                    userId: response.dataSend.userId,
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    retrieveCategories(id) {
        MeetingCategoryDataService.getAll(id)
            .then(response => {
                this.setState({
                    categories: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }



    saveMeeting() {
        if (this.state.name != "" &&
            this.state.category != "" &&
            this.state.status != "" &&
            this.state.date != "" &&
            this.state.time != "" &&
            this.state.location != "") {
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
                    console.log(response.data);
                    this.props.history.push("/meetings/" + this.props.match.params.id);
                    window.location.reload();
                    cogoToast.success("Meeting Saved Successfully!");
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            cogoToast.error("Field/s cannot be empty");
        }
    }

    retrieveCategories(id) {
        MeetingCategoryDataService.getAll(id)
            .then(response => {
                this.setState({
                    categories: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { categories, projectId } = this.state;
        return (
            <div className="">
                <div className="">
                    <h2>Add New Meeting</h2>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/home">Home</Link>
                        <Link color="inherit" to={"/projectmanagementhome/" + projectId}>App Dashboard</Link>
                        <Link color="inherit" to={"/meetings/" + projectId}>Meetings</Link>
                        <Link color="inherit" aria-current="page" className="disabledLink">Add New Meetings</Link>
                    </Breadcrumbs><hr />
                    {/* <div className="row mb-3"> */}
                    <div>
                        <div className="form-row">
                            <div className="form-group col-md-5">
                                <label htmlFor="">Meeting Name</label>
                                <input
                                    className="form-control"
                                    name="name"
                                    placeholder="Enter a name for the meeting"
                                    value={this.state.name}
                                    onChange={this.onChangeName}
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="">Category</label>
                                <select
                                    className="form-control"
                                    name="category"
                                    value={this.state.category}
                                    onChange={this.onChangeCategory}
                                    type="text"
                                    required
                                >
                                    <option value="">Select a meeting category</option>
                                    {categories && categories.map((cat, index) => (
                                        <option
                                            value={cat.id}
                                            onChange={this.onChangeCategory}
                                            key={index}
                                        >
                                            {cat.overview}
                                        </option>
                                    ))}
                                </select>
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
                                    value={this.state.date}
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
                                    value={this.state.time}
                                    min="07:00"
                                    max="22:00"
                                    onChange={this.onChangeTime}
                                    type="time"
                                    required
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="">Location / Platform</label>
                                <input
                                    className="form-control"
                                    name="location"
                                    placeholder="Enter the location of the meeting"
                                    value={this.state.location}
                                    onChange={this.onChangeLocation}
                                    list="suggest"
                                    type="text"
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
                            onClick={() => { this.saveMeeting(); this.saveSchedule(); }}
                            className="btn btn-primary mr-2"
                        >Save</button>
                        <Link to={"/meeting/" + projectId} className="">Cancel</Link>
                    </div>
                    {/* </div> */}
                </div>
                {/* )} */}
            </div >
        );
    }
}

export default CreateMeeting;
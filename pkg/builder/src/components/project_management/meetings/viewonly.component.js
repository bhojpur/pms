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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { TextareaAutosize } from "@material-ui/core";

class ViewMeeting extends Component {
    constructor(props) {
        super(props);
        this.retrieveMeeting = this.retrieveMeeting.bind(this);
      
      this.state = {
        meetingcategory: [],
        meeting: {
            projectId: this.props.match.params.id,
            no: this.props.match.params.mtid,
            category: "",
            name: "",
            status: "Scheduled",
            date: "",
            time: "",
            location: ""
        },

        submitted: false
      };
    }

    componentDidMount() {
      this.retrieveMeeting(this.props.match.params.mtid);
    }

    retrieveMeeting(mtid){
      MeetingDataService.get(mtid)
      .then(response => {
          this.setState({
            meeting: response.data
          });
          console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }

    render() {
        const {meeting} = this.state;
        return (
        <div className="">
            <div className="">
                <h2>Add New Meeting</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+meeting.projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/meetings/"+ meeting.projectId}>Meetings</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">View Meeting</Link>
                </Breadcrumbs><hr/>
                {/* <div className="row mb-3"> */}
                    <div>
                        <div className="form-row">
                            <div className="form-group col-md-5">
                                <label htmlFor="">Meeting Name</label>
                                <input
                                    className="form-control"
                                    name="name"
                                    value={meeting.name}
                                    type="text"
                                    readOnly
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="">Category</label>
                                <input
                                    className="form-control"
                                    name="category"
                                    value={meeting.category}
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
                                    value={meeting.date}
                                    type="date"
                                    readOnly
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="">Time</label>
                                <input
                                    className="form-control"
                                    name="time"
                                    value={meeting.time}
                                    type="time"
                                    readOnly
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="">Location</label>
                                <input
                                    className="form-control"
                                    name="location"
                                    value={meeting.location}
                                    type="text"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label htmlFor="">Description</label>
                                <TextareaAutosize
                                  className="form-control"
                                  name="text"
                                  value={meeting.description}
                                  type="text"
                                  readOnly
                                />
                            </div>
                        </div>
                        <hr />
                        <Link to={"/meetings/"+meeting.projectId} type="button" className="btn btn-primary mr-2" >Done</Link>
                        <Link to={"/meetings/"+meeting.projectId} className="">Cancel</Link>
                    </div>
                {/* </div> */}
            </div>
        {/* )} */}
        </div>
        );
    }
}

export default ViewMeeting;
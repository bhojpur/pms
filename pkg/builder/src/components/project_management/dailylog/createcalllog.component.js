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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import DLCallService from "../../../services/project_management/dlcall.service.js";
import cogoToast from 'cogo-toast';

class CreateDCL extends Component {
    constructor(props) {
        super(props);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeCallfrom = this.onChangeCallfrom.bind(this);
        this.onChangeCallto = this.onChangeCallto.bind(this);
        this.onChangeStarttime = this.onChangeStarttime.bind(this);
        this.onChangeEndtime = this.onChangeEndtime.bind(this);
        this.onChangeReason = this.onChangeReason.bind(this);
        this.saveCallLog = this.saveCallLog.bind(this);

        this.state = {
            id: null,
            date: "",
            callfrom: "",
            callto: "",
            starttime: "",
            endtime: "",
            reason: "",
            projectId: this.props.match.params.id,
            submitted: false
        };
    }

    onChangeDate(e) {
        this.setState({
            date: e.target.value
        });
    }

    onChangeCallfrom(e) {
        this.setState({
            callfrom: e.target.value
        });
    }

    onChangeCallto(e) {
        this.setState({
            callto: e.target.value
        });
    }

    onChangeStarttime(e) {
        this.setState({
            starttime: e.target.value
        });
    }

    onChangeEndtime(e) {
        this.setState({
            endtime: e.target.value
        });
    }

    onChangeReason(e) {
        this.setState({
            reason: e.target.value
        });
    }

    saveCallLog() {
        if (this.state.date != "" &&
        this.state.callfrom != "" &&
        this.state.callto != "" &&
        this.state.starttime != "" &&
        this.state.endtime != "" &&
        this.state.reason != "") {
        if(this.state.starttime < this.state.endtime){
        var data = {
            date: this.state.date,
            callfrom: this.state.callfrom,
            callto: this.state.callto,
            starttime: this.state.starttime,
            endtime: this.state.endtime,
            reason: this.state.reason,
            projectId: this.props.match.params.id
        };

        DLCallService.create(data)
        .then(response => {
            this.setState({
                no: response.data.no,
                date: response.data.date,
                callfrom: response.data.callfrom,
                callto: response.data.callto,
                starttime: response.data.starttime,
                endtime: response.data.endtime,
                reason: response.data.reason,
                projectId: response.data.projectId,

                submitted: true
            });
            this.props.history.push("/dailylogs/"+ this.props.match.params.id);
            window.location.reload();
            cogoToast.success("Weather Log Saved Successfully!");
        });
        } else {
            cogoToast.error("End time should be greater than after the start time");
        }
        } else {
            cogoToast.error("Field/s cannot be empty");
        }
    }
    
    render() {
        const {projectId} = this.state;
        return (
        <div className="">
            <div className="">
                <h2>Add New Call Log</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/dailylogs/"+projectId}>Daily Log</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">Add New Call Log</Link>
                </Breadcrumbs><hr/>
                <div className="">
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="">Date</label>
                            <input
                                className="form-control"
                                name="title"
                                max="2021-09-23"
                                value={this.state.date}
                                onChange={this.onChangeDate}
                                type="date"
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">Start time</label>
                            <input
                                className="form-control"
                                name="starttime"
                                value={this.state.starttime}
                                onChange={this.onChangeStarttime}
                                type="time"
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">End time</label>
                            <input
                                className="form-control"
                                name="endtime"
                                value={this.state.endtime}
                                onChange={this.onChangeEndtime}
                                type="time"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="">Call from</label>
                            <input
                                className="form-control"
                                name="callfrom"
                                placeholder="Enter the name of callee"
                                type="text"
                                value={this.state.callfrom}
                                onChange={this.onChangeCallfrom}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="">Call to</label>
                            <input
                                className="form-control"
                                name="callto"
                                placeholder="Enter the name of caller"
                                value={this.state.callto}
                                onChange={this.onChangeCallto}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor="">Reason</label>
                            <input
                                className="form-control"
                                name="reason"
                                placeholder="Enter the reason"
                                value={this.state.reason}
                                onChange={this.onChangeReason}
                                type="text"
                                required
                            />
                        </div>                      
                    </div>
                    <hr />
                    <button
                        type="button"
                        onClick={this.saveCallLog}
                        className="btn btn-primary mr-2"
                    >Save</button>
                    <Link to={"/dailylog/"+projectId} className="">Cancel</Link>
                </div>
            </div>
        </div>
        );
    }
}

export default CreateDCL;
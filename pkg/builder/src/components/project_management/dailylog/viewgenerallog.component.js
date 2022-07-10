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
import DLAccidentService from "../../../services/project_management/dlaccident.service";

class CreateDAL extends Component {
    constructor(props) {
        super(props);
        this.retrieveAccidentLog = this.retrieveAccidentLog.bind(this);
        this.saveAccidentLog = this.saveAccidentLog.bind(this);

        this.state = {
            accidentlog: [],
            id: this.props.match.params.dlid,
            projectId: this.props.match.params.id,
            submitted: false
        };
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

    onChangeCrew(e) {
        this.setState({
            crew: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    saveAccidentLog() {
        var data = {
            date: this.state.date,
            time: this.state.time,
            crew: this.state.crew,
            description: this.state.description,
            projectId: this.props.match.params.id
        };

        DLAccidentService.create(data)
        .then(response => {
            this.setState({
                no: response.data.no,
                date: response.data.date,
                time: response.data.time,
                crew: response.data.crew,
                description: response.data.description,
                projectId: response.data.projectId,

                submitted: true
            });
            console.log("save function service ekata enawa");
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }
    
    render() {
        const {projectId} = this.state;
        return (
        <div className="">
            <div className="">
                <h2>Add New Accident Log</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/dailylogs/"+projectId}>Daily Log</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">Add New Accident Log</Link>
                </Breadcrumbs><hr/>
                <div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="">Date</label>
                            <input
                                className="form-control"
                                name="date"
                                value={this.state.date}
                                onChange={this.onChangeDate}
                                type="date"
                                required
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="">Time</label>
                            <input
                                className="form-control"
                                name="time"
                                type="time"
                                value={this.state.time}
                                onChange={this.onChangeTime}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="">Crew</label>
                            <input
                                className="form-control"
                                name="crew"
                                value={this.state.crew}
                                onChange={this.onChangeCrew}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group col-md-12">
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
                    <hr />
                    <button
                        type="button"
                        onClick={this.saveAccidentLog}
                        className="btn btn-primary mr-2"
                    >Save</button>
                    <Link to={"/dailylog/"+projectId} className="card-text-bhojpur">Cancel</Link>
                </div>
            </div>
        </div>
        );
    }
}

export default CreateDAL;
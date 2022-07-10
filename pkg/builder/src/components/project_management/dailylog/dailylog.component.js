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

import React, { Component } from 'react';
import { Link } from "react-router-dom";

import DLAccidentService from "../../../services/project_management/dlaccident.service";
import DLCallService from "../../../services/project_management/dlcall.service";
import DLWeatherService from "../../../services/project_management/dlweather.service";
import DLGeneralService from "../../../services/project_management/dlgeneral.service";
import cogoToast from 'cogo-toast';

import Table from 'react-bootstrap/Table';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLateOutlined';
import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
import CloudOutlinedIcon from '@material-ui/icons/CloudOutlined';
import ClearAllOutlinedIcon from '@material-ui/icons/ClearAllOutlined';

class DailyLogHome extends Component {
    constructor(props) {
        super(props);
        this.retrieveAccidentLog = this.retrieveAccidentLog.bind(this);
        this.retrieveCallLog = this.retrieveCallLog.bind(this);
        this.retrieveWeatherLog = this.retrieveWeatherLog.bind(this);
        this.retrieveGeneralLog = this.retrieveGeneralLog.bind(this);
        this.checkedToday = this.checkedToday.bind(this);
        this.uncheckedToday = this.uncheckedToday.bind(this);
        this.deleteAccidentLog = this.deleteAccidentLog.bind(this);
        // this.deleteWeatherLog = this.deleteWeatherLog.bind(this);
        // this.deleteCallLog = this.deleteCallLog.bind(this);
        this.state = {
            dlaccident: [],
            dlweather: [],
            dlcall: [],
            dlgeneral: [],
            isDeleted: 0,
            isTodaySelected: false,
            projectId: this.props.match.params.id
        };
    }

    componentDidMount() {
        window.scroll(0,0);
        this.retrieveAccidentLog(this.props.match.params.id);
        this.retrieveCallLog(this.props.match.params.id);
        this.retrieveWeatherLog(this.props.match.params.id);
        this.retrieveGeneralLog(this.props.match.params.id);
    }

    retrieveAccidentLog(id){
        DLAccidentService.getAllweek(id)
        .then(response => {
            this.setState({
                dlaccident: response.data
            });
            console.log(response.data);
        });
    }

    retrieveCallLog(id){
        DLCallService.getAllweek(id)
        .then(response => {
            this.setState({
                dlcall: response.data
            });
            console.log(response.data);
        });
    }

    retrieveWeatherLog(id){
        DLWeatherService.getAllweek(id)
        .then(response => {
            this.setState({
                dlweather: response.data
            });
            console.log(response.data);
        });
    }

    retrieveGeneralLog(id){
        DLGeneralService.getAllweek(id)
        .then(response => {
            this.setState({
                dlgeneral: response.data
            });
            console.log(response.data);
        });
    }

    checkedToday(e){
        console.log("checked...");
        this.setState({
            isTodaySelected: true
        })
        DLAccidentService.getToday(e.target.value)
        .then(response => {
            this.setState({
                dlaccident: response.data
            });
        });
        DLCallService.getToday(e.target.value)
        .then(response => {
            this.setState({
                dlcall: response.data
            });
        });
        DLWeatherService.getToday(e.target.value)
        .then(response => {
            this.setState({
                dlweather: response.data
            });
        });
        DLGeneralService.getToday(e.target.value)
        .then(response => {
            this.setState({
                dlgeneral: response.data
            });
        });
    }

    uncheckedToday(e){
        console.log("unchecked...");
        this.setState({
            isTodaySelected: false
        })
        DLAccidentService.getAllweek(e.target.value)
        .then(response => {
            this.setState({
                dlaccident: response.data
            });
            console.log(response.data);
        });

        DLCallService.getAllweek(e.target.value)
        .then(response => {
            this.setState({
                dlcall: response.data
            });
            console.log(response.data);
        });
    
        DLWeatherService.getAllweek(e.target.value)
        .then(response => {
            this.setState({
                dlweather: response.data
            });
            console.log(response.data);
        });
    
        DLGeneralService.getAllweek(e.target.value)
        .then(response => {
            this.setState({
                dlgeneral: response.data
            });
            console.log(response.data);
        });
    }

    deleteAccidentLog(e){
        console.log(e.target.value);
        var data = {
            isDeleted: 1
        }
        DLAccidentService.update(e.target.value, data)
        .then(response => {
            console.log(response.data);
        })
        window.location.reload();
        cogoToast.success("Accident Log Deleted Successfully!");
    }

    deleteCallLog(e){
        console.log(e.target.value);
        var data = {
            isDeleted: 1
        }
        DLCallService.update(e.target.value, data)
        .then(response => {
            console.log(response.data);
        })
        window.location.reload();
        cogoToast.success("Call Log Deleted Successfully!");
    }

    deleteWeatherLog(e){
        console.log(e.target.value);
        var data = {
            isDeleted: 1
        }
        DLWeatherService.update(e.target.value, data)
        .then(response => {
            console.log(response.data);
        })
        window.location.reload();
        cogoToast.success("Weather Log Deleted Successfully!");
    }
    
    render() {
        const { projectId, dlaccident, dlcall, dlgeneral, dlweather, isTodaySelected} = this.state;
        return (
            <div className="">
                <h2>DAILY LOG</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">Daily Logs</Link>
                </Breadcrumbs><hr/>
                <div className="mb-3">
                    <div>
                        <h6><AssignmentLateIcon/> Accident Log - To tracks the party involved in any accidents that occurred onsite</h6>
                        <h6><CloudOutlinedIcon/> Weather Log - To track the weather of each time on project's location</h6>
                        <h6><CallOutlinedIcon/> Call Log - To track calls that have been made, and who was involved on the call</h6>
                        {/* <h6><ClearAllOutlinedIcon/> General Log - To track what happpened onsite</h6> */}
                    </div><hr />
                    <form>
                    <h6>Here you can see the logs of last 7 days</h6>
                        <div className="form-row mt-3">
                            <div className="form-group col-md-4">
                                <input className="form-control" type="text" />
                            </div>
                            <a href="#" className="btn btn-dark mb-3 mr-3">Search</a>
                            <div className="form-group col-md-5"></div>
                            <div className="form-group col-md-2 form-check">
                                {!isTodaySelected && 
                                <div>
                                    <button className="btn btn-success" onClick={this.checkedToday} value={projectId}>View Today</button>
                                </div>
                                }
                                {isTodaySelected &&
                                <div>
                                    <button className="btn btn-success" onClick={this.uncheckedToday} value={projectId}>View Past 7 Days</button>
                                </div>
                                }
                            </div>
                            {/* <div className="form-group col-md-2 form-check">
                                <a className="btn btn-primary" href="">Export PDF</a>
                            </div> */}
                        </div>
                    </form>
                    <div class="accordion" id="accordionExample">
                        <div class="card">
                            <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link card-text-bhojpur" type="button" data-toggle="collapse" data-target="#accidentlog" aria-controls="accidentlog"><AssignmentLateIcon/> <b>Accident</b></button>
                            </h2>
                            </div>
                            <div id="accidentlog" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div class="card-body">
                                    <div class="col-md-12 text-right mb-2">
                                        <Link to={"/viewaccidentall/"+projectId} className="btn btn-success mr-2">View All</Link>
                                        <Link to={"/createaccidentlog/"+projectId} className="btn btn-primary">+ Create Accident Log Item</Link>
                                    </div>
                                    <Table striped bordered hover variant="" responsive>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Crew</th>
                                                <th>Description</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dlaccident && dlaccident.map((dla) => (
                                                <tr key={dla.id}>
                                                    <td>{dla.date}</td>
                                                    <td>{dla.time}</td>
                                                    <td>{dla.crew}</td>
                                                    <td>{dla.description}</td>
                                                    <td>
                                                        <Link to={"/viewaccidentlog/" + projectId + "/" + dla.id}>
                                                            <button className="btn btn-success mr-2">View <VisibilityIcon/></button>
                                                        </Link>
                                                        <button className="btn btn-danger mr-2"  id="updateBtn" value={dla.id} onClick={this.deleteAccidentLog}>Delete <DeleteIcon/></button>
                                                    </td>    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link card-text-bhojpur" type="button" data-toggle="collapse" data-target="#weatherlog" aria-controls="weatherlog"><CloudOutlinedIcon/> <b>Weather</b></button>
                            </h2>
                            </div>
                            <div id="weatherlog" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div class="card-body">
                                    <div class="col-md-12 text-right mb-2">
                                        <Link to={"/viewweatherall/"+projectId} className="btn btn-success mr-2">View All</Link>
                                        <Link to={"/createweatherlog/"+projectId} className="btn btn-primary">+ Create Weather Log Item</Link>
                                    </div>
                                    <Table striped bordered hover variant="" responsive>
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Temperature</th>
                                            <th>Weather</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dlweather && dlweather.map((dlw, index) => (
                                            <tr key={index}>
                                                <td>{dlw.date}</td>
                                                <td>{dlw.time}</td>
                                                <td>{dlw.temperature}</td>
                                                <td>{dlw.weather}</td>
                                                <td>
                                                    <Link to={"/viewweatherlog/" + projectId + "/" + dlw.id}>
                                                        <button className="btn btn-success mr-2">View <VisibilityIcon/></button>
                                                    </Link>
                                                    <button className="btn btn-danger mr-2"  id="updateBtn" value={dlw.id} onClick={this.deleteWeatherLog}>Delete <DeleteIcon/></button>
                                                </td>    
                                            </tr>
                                            ))}
                                        </tbody>
                                    </Table>                                    
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link card-text-bhojpur" type="button" data-toggle="collapse" data-target="#calllog" aria-controls="calllog"><CallOutlinedIcon/> <b>Call</b></button>
                            </h2>
                            </div>
                            <div id="calllog" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div class="card-body">
                                    <div class="col-md-12 text-right mb-2">
                                        <Link to={"/viewcallall/"+projectId} className="btn btn-success mr-2">View All</Link>
                                        <Link to={"/createcalllog/"+projectId} className="btn btn-primary">+ Create Call Log Item</Link>
                                    </div>
                                    <Table striped bordered hover variant="" responsive>
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Call From</th>
                                            <th>Call To</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Reason</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dlcall && dlcall.map((dlc, index) => (
                                            <tr key={index}>
                                                <td>{dlc.date}</td>
                                                <td>{dlc.callfrom}</td>
                                                <td>{dlc.callto}</td>
                                                <td>{dlc.starttime}</td>
                                                <td>{dlc.endtime}</td>
                                                <td>{dlc.reason}</td>
                                                <td>
                                                    <Link to={"/viewcalllog/" + projectId + "/" + dlc.id}>
                                                        <button className="btn btn-success mr-2">View <VisibilityIcon/></button>
                                                    </Link>
                                                    <button className="btn btn-danger mr-2"  id="updateBtn" value={dlc.id} onClick={this.deleteCallLog}>Delete <DeleteIcon/></button>
                                                </td>    
                                            </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                        {/* <div class="card">
                            <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link card-text-bhojpur" type="button" data-toggle="collapse" data-target="#generallog" aria-controls="generallog"><ClearAllOutlinedIcon/> <b>General</b></button>
                            </h2>
                            </div>
                            <div id="generallog" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div class="card-body">
                                    <div class="col-md-12 text-right mb-2">
                                        <Link to={"/viewgeneralall/"+projectId} className="btn btn-success mr-2">View All</Link>
                                        <Link to={"/creategenerallog/"+projectId} className="btn btn-primary">+ Create General Log Item</Link>
                                    </div>
                                    <Table striped bordered hover variant="" responsive>
                                        <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {dlgeneral && dlgeneral.map((dlg, index) => (
                                            <tr key={index}>
                                                <td>{dlg.date}</td>
                                                <td>
                                                    <Link to={"/viewgenerallog/" + projectId + "/" + dlg.id}>
                                                        <button className="btn btn-success mr-2">View <VisibilityIcon/></button>
                                                    </Link>
                                                </td>    
                                            </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div> */}
                    </div>        
                </div>
            </div>
        );
    }

}

export default DailyLogHome;
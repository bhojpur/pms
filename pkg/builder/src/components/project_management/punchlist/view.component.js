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
import PunchlistDataService from "../../../services/project_management/punchlist.service.js";
import cogoToast from 'cogo-toast';
import punchlisttypesService from "../../../services/project_management/punchlisttypes.service.js";

class PLIView extends Component {
    constructor(props) {
        super(props);
        this.onChangeDuedate = this.onChangeDuedate.bind(this);
        // this.onChangeTitle = this.onChangeTitle.bind(this);
        // this.onChangeType = this.onChangeType.bind(this);
        this.onChangeLocation = this.onChangeLocation.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.retrivePLItemInfo = this.retrivePLItemInfo.bind(this);
        // this.retriveType = this.retriveType.bind(this);
        this.updatePunchList = this.updatePunchList.bind(this);
        this.deletePunchList = this.deletePunchList.bind(this);
        this.state = {
            plItem: {
                no: this.props.match.params.pliid,
                title: "",
                description: "",
                location: "",
                status: "",
                duedate: "",
                type: "",
                isDeleted: 0,
                projectId: this.props.match.params.id
            },
        };
    }
  
    componentDidMount() {
        this.retrivePLItemInfo(this.props.match.params.pliid);
    }

    retrivePLItemInfo(plid){
        PunchlistDataService.getOne(plid)
        .then(response => {
            this.setState({
                plItem: response.data
            });
        });
    }

    onChangeStatus(e) {
        const status = e.target.value
        this.setState(function(prevState){
            return {
                plItem: {
                    ...prevState.plItem,
                    status: status
                }
            }
        });
    }

    onChangeStatus(e) {
        const status = e.target.value
        this.setState(function(prevState){
            return {
                plItem: {
                    ...prevState.plItem,
                    status: status
                }
            }
        });
    }
    
    onChangeDuedate(e) {
        const duedate = e.target.value
        this.setState(function(prevState){
            return {
                plItem: {
                    ...prevState.plItem,
                    duedate: duedate
                }
            }
        });
    }

    onChangeLocation(e) {
        const location = e.target.value
        this.setState(function(prevState){
            return {
                plItem: {
                    ...prevState.plItem,
                    location: location
                }
            }
        });
    }

    onChangeDescription(e) {
        const description = e.target.value
        this.setState(function(prevState){
            return {
                plItem: {
                    ...prevState.plItem,
                    description: description
                }
            }
        });
    }

    onChangeStatus(e) {
        const status = e.target.value
        this.setState(function(prevState){
            return {
                plItem: {
                    ...prevState.plItem,
                    status: status
                }
            }
        });
    }

    updatePunchList(){
        if(this.state.plItem.description != "" &&
        this.state.plItem.status != "" &&
        this.state.plItem.duedate != "" &&
        this.state.plItem.location != "" &&
        this.state.plItem.projectId != "" ){
            var data = {
                description: this.state.plItem.description,
                status: this.state.plItem.status,
                duedate: this.state.plItem.duedate,
                location: this.state.plItem.location,
                projectId: this.state.plItem.projectId
            };

            PunchlistDataService.update(this.props.match.params.pliid, data)
            .then(response => {
                this.setState(prevState => ({
                    plItem: {
                        ...prevState.plItem,
                    }
                }));
                console.log(response.data);
                this.props.history.push("/view/"+ this.props.match.params.id + "/" + this.props.match.params.pliid);
                cogoToast.success("Punch List updated Successfully!");
            })
            .catch(e => {
                console.log(e);
            });
        } else {
            cogoToast.error("Field/s cannot be empty");
        }
    }

    deletePunchList(){
        var data = {
            isDeleted: 1
        }
        PunchlistDataService.delete(this.props.match.params.pliid, data)
        .then(response => {
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
        this.props.history.push("/punchlist/"+ this.props.match.params.id);
        window.location.reload();
        cogoToast.success("Punch List Deleted Successfully!");
    }
    
    render() {
        const { plItem } = this.state;
        return (
            <div>
                <h2>Punch List Item - {plItem.title}</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/" + plItem.projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/punchlist/" + plItem.projectId}>Punch List</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">View Punch List</Link>
                </Breadcrumbs><hr />
                <div className="container">
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="">Title</label>
                            <input
                                className="form-control"
                                name="title"
                                value={plItem.title}
                                onChange={this.onChangeStatus}
                                type="text"
                                readOnly
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="">Type</label>
                            <input
                                className="form-control"
                                name="type"
                                value={plItem.type}
                                onChange={this.onChangeStatus}
                                type="text"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="">Status</label>
                            {plItem.status == "Initiated" ?
                                <select
                                className="form-control"
                                name="status"
                                type="text"
                                onChange={this.onChangeStatus}
                                value={plItem.status}
                                required>
                                    <option value="Initiated">Initiated</option>
                                    <option value="WIP">Work in Progress</option>
                                    <option value="RFR">Ready for Review</option>
                                    <option value="RTC">Ready to Close</option>
                                    <option value="WNA">Work not Accepted</option>
                                </select>
                            : plItem.status == "WIP" ?
                                <select
                                className="form-control"
                                name="status"
                                type="text"
                                onChange={this.onChangeStatus}
                                value={plItem.status}
                                required>
                                    <option value="WIP">Work in Progress</option>
                                    <option value="RFR">Ready for Review</option>
                                    <option value="RTC">Ready to Close</option>
                                    <option value="WNA">Work not Accepted</option>
                                </select>
                            : plItem.status == "RFR" ?
                                <select
                                className="form-control"
                                name="status"
                                type="text"
                                onChange={this.onChangeStatus}
                                value={plItem.status}
                                required>
                                    <option value="RFR">Ready for Review</option>
                                    <option value="RTC">Ready to Close</option>
                                    <option value="WNA">Work not Accepted</option>
                                </select>
                            : plItem.status == "RTC" ?
                                <select
                                className="form-control"
                                name="status"
                                type="text"
                                value={plItem.status}
                                required>
                                    <option value="RFR">Ready to Close</option>
                                    <option value="WNA">Work not Accepted</option>
                                </select>
                            : 
                                <select
                                className="form-control"
                                name="status"
                                type="text"
                                value={plItem.status}
                                required>
                                    <option value="Initiated">Initiated</option>
                                    <option value="RFR">Work not Accepted</option>
                                </select>
                            }
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="">Location</label>
                            <input
                                className="form-control"
                                name="location"
                                value={plItem.location}
                                onChange={this.onChangeLocation}
                                type="text"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-9">
                            <label htmlFor="">Description</label>
                            <input
                                className="form-control"
                                name="description"
                                value={plItem.description}
                                onChange={this.onChangeDescription}
                                type="text"
                                required
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="">Due Date</label>
                            <input
                                className="form-control"
                                name="duedate"
                                value={plItem.duedate}
                                onChange={this.onChangeDuedate}
                                type="date"
                                min=""
                                required
                            />
                        </div>
                    </div>
                    <hr />
                    <button className="btn btn-primary mr-2" id="updateBtn" data-target="#promptModal" data-toggle="modal" >Update</button>
                    <button className="btn btn-danger mr-2"  id="updateBtn" data-target="#deleteModal" data-toggle="modal">Delete</button>
                    <Link to={"/punchlist/"+plItem.projectId} className="">Cancel</Link>
                </div>
                {/* Update modal Starts */}
                <div className="modal fade" id="promptModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title" id="exampleModalCenterTitle">Are you sure you want to update</p>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <a onClick={this.updatePunchList} className="btn btn-primary pr-3 ml-2 mr-3" data-dismiss="modal"> Yes, Update</a>
                            <a className="btn btn-secondary ml-6 mr-6 pl-3" data-dismiss="modal"> Cancel</a>
                        </div>
                        </div>
                    </div>
                </div>
                {/* Update modal Ends */}

                {/* Delete modal Starts */}
                <div className="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <p className="modal-title" id="exampleModalCenterTitle">Are you sure you want to delete?</p>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <a  className="btn btn-danger pr-3 ml-2 mr-3" onClick={this.deletePunchList} data-dismiss="modal"> Yes, Delete</a>
                                <a className="btn btn-secondary ml-6 mr-6 pl-3" id ="deleteModalDismiss" data-dismiss="modal"> Cancel</a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Delete modal Ends */}
            </div>
        );
    }
}

export default PLIView;
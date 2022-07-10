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
import ActionPlanItemDataService from "./../../../services/project_management/actionplanitem.service";
import ProjectUserDataService from "../../../services/projectuser.service.js";
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from 'cogo-toast';

export default class ViewAPItem extends Component {
  constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeAssigner = this.onChangeAssigner.bind(this);
        this.updateAPitem = this.updateAPitem.bind(this);
        this.onChangeisCompleted = this.onChangeisCompleted.bind(this);

        this.state = {
            projectId: this.props.match.params.id,
            actionplanId: this.props.match.params.apid,
            
            apItems: [],
            users: [],
            currentIndex: -1,
            submitted: false,
        };
    }

    componentDidMount() {
        this.retrieveActionPlanItems(this.props.match.params.apid);
        this.retrieveUsers(this.props.match.params.id);
    }
    
    retrieveActionPlanItems(id){
        ActionPlanItemDataService.get(id)
        .then(response => {
            this.setState({
                apItems: response.data
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    retrieveUsers(id){
        ProjectUserDataService.searchUserDetails(id, "Engineer")
        .then(response => {
            this.setState({
                users: response.data
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    onChangeTitle(e) {
        const title= e.target.value
        this.setState(function(prevState){
            return {
                apItems: {
                    ...prevState.apItems,
                    title: title
                }
            }
        });
    }

    onChangeDescription(e) {
        const description= e.target.value
        this.setState(function(prevState){
            return {
                apItems: {
                    ...prevState.apItems,
                    description: description
                }
            }
        });
    }

    onChangeAssigner(e) {
        const assigner= e.target.value
        this.setState(function(prevState){
            return {
                apItems: {
                    ...prevState.apItems,
                    assigner: assigner
                }
            }
        });
    }

    onChangeisCompleted(e) {
        const isCompleted= e.target.value
        this.setState(function(prevState){
            return {
                apItems: {
                    ...prevState.apItems,
                    isCompleted: isCompleted
                }
            }
        });
    }
    
    updateAPitem() {  
        if (this.state.apItems.title != "" &&
        this.state.apItems.description != "" &&
        this.state.apItems.assigner != "") {
            var data = {
                title: this.state.apItems.title,
                description: this.state.apItems.description,
                assigner: this.state.apItems.assigner,
                isCompleted: this.state.apItems.isCompleted,
                actionplansectionId: this.state.apItems.actionplansectionId
            };

            ActionPlanItemDataService.update(this.props.match.params.apid, data)
            .then(response => {
                this.setState(prevState => ({
                    apItems: {
                        ...prevState.apItems
                    }
                }));
                console.log(response.data);
                cogoToast.success("Action Plan Item Updated Successfully!");
            })
        } else {
            cogoToast.error("Field/s cannot be empty");
        }
    }

  render() {
    const {actionplanId, projectId, users, apItems} = this.state;
    return (
      <div className="container">
        <div class="container">
            <h3 className="modal-title" id="exampleModalCenterTitle">Add New Action Plan Item</h3>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">Home</Link>
                <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                <Link color="inherit" to={"/actionplan/"+projectId}>Action Plan</Link>
                <Link color="inherit" to={"/actionplansingle/" + projectId + "/" + actionplanId}>Action Plan Single Page</Link>
                <Link color="inherit" aria-current="page" className="disabledLink">Add Action Plan Item</Link>
            </Breadcrumbs>
            <hr/>
            <div className="container">
                <div className="form-row">
                    <div className="form-group col-12">
                        <label htmlFor="title">Title</label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Enter a title for action plan item"
                            required
                            value={apItems.title}
                            onChange={this.onChangeTitle}
                            name="title"
                        />
                    </div>
                </div>
                <div className="form-row">
                <div className="form-group col-4">
                        <label htmlFor="title">Section</label>
                        <input
                            type="text"
                            className="form-control"
                            id="section"
                            value={apItems.actionplansectionId}
                            name="section"
                            readOnly
                        />
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="title">Assignee</label>
                        <select
                            required
                            type="text"
                            className="form-control"
                            id="title"
                            required
                            value={apItems.assigner}
                            onChange={this.onChangeAssigner}
                            name="title"
                        >
                            <option value="">Select an Assignee</option>
                            {users && users.map((u, index) => (
                                <option
                                    value={u.username}
                                    onChange={this.onChangeAssigner}
                                    key={index}
                                >
                                    {u.username} - {u.position}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-4">
                    <label htmlFor="isApproved">Status</label>
                    {!apItems.isCompleted ?
                    <div>
                        <select
                        type="text"
                        onChange={this.onChangeisCompleted}
                        className="form-control"
                        required
                        >
                        <option value="0" onChange={this.onChangeisCompleted}>🔴 Not Completed</option>
                        <option value="1" onChange={this.onChangeisCompleted}>🟢 Completed</option>
                        </select>
                    </div>
                    :
                    <div>
                        <input
                        name="isCompleted"
                        type="text"
                        className="form-control"
                        value="Completed"
                        readOnly
                        />
                    </div>
                    }
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-12">
                        <label htmlFor="description">Description</label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="description"
                            placeholder="Enter a description about the item"
                            required
                            value={apItems.description}
                            onChange={this.onChangeDescription}
                            name="description"
                        />
                    </div>
                </div><hr />
                    <button type="button" className="btn btn-primary mr-2" onClick={this.updateAPitem}>Update Action Plan Item</button>
                    <Link to={"/actionplan/" + projectId}>Cancel</Link>
                </div>
            </div>
        </div>
    );}
}
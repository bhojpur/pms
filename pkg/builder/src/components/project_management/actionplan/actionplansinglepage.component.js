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
import ActionPlanService from "../../../services/project_management/actionplan.service";
import ActionPlanSectionService from "../../../services/project_management/actionplansection.service";
import AddAPItem from './addapitem.component';
import AddAPSection from './addapsection.component';

import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Breadcrumbs } from "@material-ui/core";

export default class ActionPlanSinglePage extends Component {
    constructor(props) {
      super(props);
      this.getActionPlanSections = this.getActionPlanSections.bind(this);
    
      this.state = {
        id: this.props.match.params.apid,
        title: "",
        description: "",
        category: "",
        projectId: this.props.match.params.id,

        currentUser: AuthService.getCurrentUser(),
        actionplansections: [],
        actionplan: [],
      };
    }
    
    componentDidMount() {
        this.getActionPlanSections(this.props.match.params.apid);
        this.getActionPlanDetails(this.props.match.params.apid);
    }

    getActionPlanDetails(id){
        ActionPlanService.getOne(id)
        .then(response => {
            this.setState({
              actionplan: response.data
            });
            console.log(response.data);
        })
            .catch(e => {
        console.log(e);
        });
    }
    
    getActionPlanSections(id){
        ActionPlanSectionService.getAll(id)
        .then(response => {
            this.setState({
                actionplansections: response.data
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }
    
    render() {
        const { projectId, actionplansections, actionplan } = this.state;
        return (
            <div>
                <h2>Action Plan - {actionplan.title}</h2>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" to="/home">Home</Link>
                    <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
                    <Link color="inherit" to={"/actionplan/"+projectId}>Action Plan Home</Link>
                    <Link color="inherit" aria-current="page" className="disabledLink">View Action Plan</Link>
                </Breadcrumbs>
                <hr/>
                <h3>Workflow</h3>
                <div className="row">
                    <div className="col-8">
                        {/* Starts */}
                        <Timeline align="right">
                            {/* First Item starts */}
                            {actionplansections && actionplansections.map((actionplansection, index) => (
                            
                            <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                            <Paper elevation={3} className="container">
                                <Typography variant="h6" component="h1">
                                    <b>{actionplansection.title}</b>
                                </Typography>
                                <Typography>
                                <h6>{actionplansection.acceptance}</h6>
                                <h6>Due Date is {actionplansection.duedate}</h6>
                                {/* <p>Ref type : {actionplansection.reftype} {actionplansection.refid}</p> */}
                                <hr></hr>
                                <Link className="btn btn-success m-2" to={"/viewactionplanitems/"+projectId+"/"+actionplansection.id}>View Items</Link>
                                <Link className="btn btn-primary m-2" to={"/viewactionplansection/"+projectId+"/"+actionplansection.id}>⚙️Manage</Link>
                                </Typography>
                            </Paper>
                            </TimelineContent>
                            </TimelineItem>

                            ))}
                            {/* First Item ends */}
                            <TimelineItem>
                                <TimelineSeparator>
                                <TimelineDot variant="outlined" />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <h5>End</h5>
                                </TimelineContent>
                            </TimelineItem>
                        </Timeline>
                        {/* Ends */}
                    </div>
                    <div className="col-4">
                        <h6>Plan Manager : {actionplan.planmanager}</h6>
                        <h6>Action Type : {actionplan.actiontype}</h6>
                        <h6>Location : {actionplan.location}</h6>
                        <h6>Description : {actionplan.description}</h6>
                        <h6>{actionplan.isApproved == false ? "Not Approved 🔴" : "Approved 🟢" }</h6>
                        <Link href="#" className="btn btn-success mt-2 text-right"  to={"/viewactionplan/" + projectId + "/" + actionplan.id}>Update Plan</Link>
                        <hr></hr>
                        <Link to={"/addactionplansection/" + projectId + "/" + actionplan.id} className="btn btn-primary mr-2" >+ Add Section</Link>
                        <Link to={"/addactionplanitem/" + projectId + "/" + actionplan.id} className="btn btn-primary mr-2" >+ Add Item</Link>
                    </div>
                </div>
            </div>
        );
    }
}
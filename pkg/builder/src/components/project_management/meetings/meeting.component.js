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

import MeetingCategoryDataService from "../../../services/project_management/meetingcategory.service";
import MeetingDataService from "../../../services/project_management/meeting.service";

import Table from 'react-bootstrap/Table';
import cogoToast from 'cogo-toast';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import meetingService from '../../../services/project_management/meeting.service';

class MeetingsHome extends Component {
  constructor(props) {
      super(props);
      this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
      this.searchTitle = this.searchTitle.bind(this);
      this.onChangeOverview = this.onChangeOverview.bind(this);
      this.onChangeDescription = this.onChangeDescription.bind(this);
      this.saveMeetingCategory = this.saveMeetingCategory.bind(this);
      this.retrieveMeetingCategory = this.retrieveMeetingCategory.bind(this);
      this.retrieveMeeting = this.retrieveMeeting.bind(this);
      this.deleteMeeting = this.deleteMeeting.bind(this);
      // this.setActiveViewMeeting = this.setActiveViewMeeting.bind(this);
      
      this.state = {
        categories: [],
        meeting: [],
        id: null,
        category: "",
        description: "",
        projectId: this.props.match.params.id,
        content: "",
        searchTitle: "",
        currentViewIndex:-1,

        submitted: false
      };
    }

    componentDidMount() {
      this.retrieveMeetingCategory(this.props.match.params.id);
      this.retrieveMeeting(this.props.match.params.id);
    }

    retrieveMeetingCategory(projectId){
      MeetingCategoryDataService.getAll(projectId)
      .then(response => {
          this.setState({
            categories: response.data
          });
      });
    }

    retrieveMeeting(projectId){
      MeetingDataService.getAll(projectId)
      .then(response => {
          this.setState({
            meeting: response.data
          });
      });
    }

    onChangeSearchTitle(e) {
      const searchTitle = e.target.value;
  
      this.setState({
        searchTitle: searchTitle
      });
    }
  
    searchTitle() {
      meetingService.findByTitle(this.state.searchTitle)
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

    onChangeOverview(e) {
      this.setState({
        overview: e.target.value
      });
    }

    onChangeDescription(e) {
      this.setState({
        description: e.target.value
      });
    }

    saveMeetingCategory() { 
      if (this.state.overview != "" &&
      this.state.description != "" ) {
        var data = {
          overview : this.state.overview,
          description: this.state.description,
          projectId: this.props.match.params.id
        };

        MeetingCategoryDataService.create(data)
        .then(response => {
          this.setState({
            id: response.data.id,
            overview: response.data.overview,
            description: response.data.description,

            submitted: true
          });
          cogoToast.success("Meeting Saved Successfully!");
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        window.location.reload();
      } else {
        cogoToast.error("Field/s cannot be empty");
      }
    }

    deleteMeeting(e){
      var data = {
          isDeleted: 1
      }
      MeetingDataService.update(e.target.value, data)
      .then(response => {
          console.log(response.data);
          cogoToast.success("Meeting Deleted Successfully!");
      });
    }

    render() {
      const {categories, meeting, searchTitle, projectId} = this.state;
      return (
        <div className="">
          <h2>MEETING</h2>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">Home</Link>
            <Link color="inherit" to={"/projectmanagementhome/"+projectId}>App Dashboard</Link>
            <Link color="inherit" aria-current="page" className="disabledLink">Meetings</Link>
          </Breadcrumbs><hr/>
          <div className="container">            
            <h4 className="mt-2">Meeting Types</h4>
            <div className="container">
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label htmlFor="">Name</label>
                  <input
                    className="form-control" 
                    type="text"
                    name="overview"
                    placeholder="Enter type name"
                    value={this.state.overview}
                    onChange={this.onChangeOverview}
                    required
                  />
                </div>
                <div className="form-group col-md-8">
                  <label htmlFor="">Description</label>
                  <input 
                    className="form-control" 
                    type="text"
                    name="description"
                    placeholder="Enter description about the type"
                    value={this.state.description}
                    onChange={this.onChangeDescription}
                    required
                  />
                </div>
                <div className="form-group col-md-1">
                  <label htmlFor="">.</label>
                  <button
                      className="btn btn-primary"
                      onClick={this.saveMeetingCategory}
                  >Add</button>
                </div>
              </div>
            </div><hr/>
            <h4 className="mb-3">Meetings</h4>
            <form>
              <div className="form-row mt-3">
                <div class="col-md-12 text-right">
                  <Link to={"/createmeetings/"+projectId} className="btn btn-primary mb-2">+ Create Meeting</Link>
                </div>
                {/* <div className="form-group col-md-4">
                  <input className="form-control" type="text" placeholder="Search a meeting type..." value={searchTitle} onChange={this.onChangeSearchTitle} />
                </div>
                <button href="#" className="btn btn-outline-dark mb-3" onClick={this.searchTitle}>Search</button> */}
              </div>
            </form>
            <div class="accordion" id="accordionExample">
              {categories && categories.map((cat, index) => (
                <div class="card" key={cat.id + index}>
                  <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                      <button class="btn btn-link card-text-bhojpur" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls="collapseOne">{cat.overview}</button>
                    </h2>
                  </div>
                  <div id={`collapse${index}`} class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="card-body">
                      <div className="">
                          <div class="col-md-12 text-right mb-2">
                            <Link to={"/createfollowup/" + projectId + "/" + cat.id} className="btn btn-primary">+ Follow-up Meeting</Link>
                          </div>
                        <Table striped bordered hover variant="" responsive>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                              {meeting && meeting.map((mt, index) => ( mt.category == cat.id ?
                                <tr key={mt.id + index}>
                                    <td>{mt.date}</td>
                                    <td>{mt.name}</td>
                                    <td>{mt.time}</td>
                                    <td>{mt.location}</td>
                                    <td>
                                      {mt.status == "Scheduled"
                                        ? "🟢 - Scheduled"
                                        : "🔴 - End"}
                                    </td>
                                    <td>
                                      {mt.status == "Scheduled" ? (
                                        <Link to={"/viewmeeting/" + projectId + "/" + mt.id}>
                                          <button className="btn btn-success mr-2">View <VisibilityIcon/></button>
                                        </Link>
                                      ) : (
                                        <Link to={"/viewonlymeeting/" + projectId + "/" + mt.id}>
                                          <button className="btn btn-success mr-2">View <VisibilityIcon/></button>
                                        </Link>
                                      )}
                                      <button className="btn btn-danger mr-2"  id="updateBtn" value={mt.id} onClick={this.deleteMeeting}>Delete <DeleteIcon/></button>
                                    </td>    
                                </tr> : ""
                              ))}
                            </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
                          <a  className="btn btn-danger pr-3 ml-2 mr-3" onClick={this.deleteMeeting} data-dismiss="modal"> Yes, Delete</a>
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

export default MeetingsHome;
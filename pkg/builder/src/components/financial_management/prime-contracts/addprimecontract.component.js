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
import PrimeContractsDataService from "./../../../services/primecontract.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

export default class CreatePrimeContracts extends Component{
  constructor(props) {
    super(props);
    this.onChangeHash = this.onChangeHash.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
    this.onChangeEngineer = this.onChangeEngineer.bind(this);
    this.onChangeContractor = this.onChangeContractor.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEstimatedCompletionDate = this.onChangeEstimatedCompletionDate.bind(this);
    this.onChangeSignedContractReceivedDate = this.onChangeSignedContractReceivedDate.bind(this);
    this.onChangeActualCompletionDate = this.onChangeActualCompletionDate.bind(this);
    this.onChangeDefaultRetainange = this.onChangeDefaultRetainange.bind(this);
    //this.onChangeExecuted = this.onChangeExecuted.bind(this);
    ////this.onChangeAttachments = this.onChangeAttachments.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeInclusions = this.onChangeInclusions.bind(this);
    this.onChangeExclusions = this.onChangeExclusions.bind(this);
    this.savePrimeContract = this.savePrimeContract.bind(this);
    this.newPrimeContract = this.newPrimeContract.bind(this);

    this.state = {
      id: null,
      hash:"",
      owner: "",
      engineer: "",
      contractor:"",
      title: "",
      status: "", 
      startDate: "",
      estimatedCompletionDate : "",
      signedContractReceivedDate : "",
      actualCompletionDate : "",
      defaultRetainange :"",
      //executed:"",
      description:"",
      inclusions:"",
      exclusions:"",
      //attachments:"",
      projectId: this.props.match.params.id,  
      submitted: false
    };
  }

  onChangeHash(e) {
    this.setState({
      hash: e.target.value
    });
  }
  onChangeOwner(e) {
    this.setState({
      owner: e.target.value
    });
  }

  onChangeEngineer(e) {
    this.setState({
      engineer: e.target.value
    });
  }

  onChangeContractor(e) {
    this.setState({
      contractor: e.target.value
    });
  }
  onChangeTitle (e) {
    this.setState({
      title: e.target.value
    });
  }
  onChangeStatus (e) {
    this.setState({
      status: e.target.value
    });
  }
  onChangeStartDate(e) {
    this.setState({
      startDate: e.target.value
    });
  }onChangeEstimatedCompletionDate(e) {
    this.setState({
      estimatedCompletionDate: e.target.value
    });
  }onChangeSignedContractReceivedDate(e) {
    this.setState({
      signedContractReceivedDate: e.target.value
    });
  }onChangeActualCompletionDate(e) {
    this.setState({
      actualCompletionDate: e.target.value
    });
  }onChangeDefaultRetainange(e) {
    this.setState({
      defaultRetainange: e.target.value
    });
  }/*onChangeExecuted(e) {
    this.setState({
      executed: e.target.value
    });
  }*/onChangeDescription(e) {
    this.setState({
     description: e.target.value
    });
  }onChangeInclusions(e) {
    this.setState({
     inclusions: e.target.value
    });
  }onChangeExclusions(e) {
    this.setState({
      exclusions: e.target.value
    });
  }/*onChangeAttachments(e) {
    this.setState({
      attachments: e.target.value
    });
  } */

  savePrimeContract() {
    console.log("clicked");  
    var data = {
      hash: this.state.hash,
      owner: this.state.owner,
      engineer: this.state.engineer,
      contractor: this.state.contractor,
      title: this.state.title,
      status: this.state.status,
      startDate: this.state.startDate,
      estimatedCompletionDate: this.state.estimatedCompletionDate,
      signedContractReceivedDate: this.state.signedContractReceivedDate,
      actualCompletionDate:this.state.actualCompletionDate,
      defaultRetainange:this.state.defaultRetainange,
      //executed:this.state.executed,
      description:this.state.description,
      inclusions:this.state.inclusions,
      exclusions:this.state.exclusions,
      //attachments:this.state.attachments,
      projectId: this.state.projectId
    };

    PrimeContractsDataService.create(data)
      .then(response => {
        this.setState({
          hash: response.data.hash,
      owner: response.data.owner,
      engineer: response.data.engineer,
      contractor: response.data.contractor,
      title: response.data.title,
      status:response.data.status,
      startDate:response.data.startDate,
      estimatedCompletionDate: response.data.estimatedCompletionDate,
      signedContractReceivedDate: response.data.signedContractReceivedDate,
      actualCompletionDate:response.data.actualCompletionDate,
      defaultRetainange:response.data.defaultRetainange,
      //executed:response.data.executed,
      description:response.data.description,
      inclusions:response.data.inclusions,
      exclusions:response.data.exclusions,
      //attachments:response.data.attachments,
          projectId: response.data.projectId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPrimeContract() {
    this.setState({
      id: null,
      hash:"",
      owner: "",
      engineer: "",
      contractor: "",
      title: "",
      status: "", 
      startDate: "",
      estimatedCompletionDate : "",
      signedContractReceivedDate : "",
      actualCompletionDate : "",
      defaultRetainange :"",
      //executed:"",
      description:"",
      inclusions:"",
      exclusions:"",
      //attachments:"",
      projectId: this.props.match.params.id,  
      submitted: false
    });
  }

  render() {
    const {projectId} = this.state;
    return (
      <div className="container">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newPrimeContract}>
             Create Another Prime Contract
            </button>&nbsp;&nbsp;
            <Link  to={"/primecontract/"+projectId} className="btn btn-success">View Prime Contracts</Link>
          </div>
        ) : (
            <div class="container">
       <h2>Create New Prime Contract </h2><hr/>
       <div className="row">
       <div className="col-sm-6">
          <div className="form-group">
         
                <label htmlFor="hash"># :</label> 
             
  
              <input
                type="text"
                className="form-control"
                id="hash"
                required
                value={this.state.hash}
                onChange={this.onChangeHash}
                name="hash"
              />
              </div>
              <div className="form-group">
              <label htmlFor="">Owner/Client:</label>
              <input
                type="text"
                className="form-control"
                id="owner"
                required
                value={this.state.owner}
                onChange={this.onChangeOwner}
                name="owner"
              />
              </div>
              <div className="form-group">
              <label htmlFor="">Contractor:</label>
              <input
                type="text"
                className="form-control"
                value={this.state.contractor}
                onChange={this.onChangeContractor}
                name="contractor"
              />
              </div>
              <div className="form-group">
              <label htmlFor="">Architect/Engineer:</label>
              <input
                type="text"
                className="form-control"
                id="engineer"
                required
                value={this.state.engineer}
                onChange={this.onChangeEngineer}
                name="engineer"
              />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title :</label>
    
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
              </div>
            <div className="form-group">
                <label htmlFor="status">Status :</label>
            
              <input
                type="text"
                className="form-control"
                id="status"
                required
                value={this.state.status}
                onChange={this.onChangeStatus}
                name="status"
              />
              </div>
           
           {/*<div className="form-group">
                <label htmlFor="executed">Executed</label>
         
              <input
                type="checkbox"
                className="form-control"
                id="executed"
                required
                value={this.state.executed}
                onChange={this.onChangeExecuted}
                name="executed"
              />
        </div>*/}
         
              <div className="form-group">
                <label htmlFor="defaultRetainage">Default Retainage % :</label>
                <input
                type="text"
                className="form-control"
                id="defaultRetainage"
                required
                value={this.state.defaultRetainage}
                onChange={this.onChangeDefaultRetainage}
                name="defaultRetainage"
              />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description :</label>
 
              <input
                type="textarea"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
              </div> 
          {/* <div className="form-group">
                <label htmlFor="attachments">Attachments</label>
            
              <input
                type="file"
                className="form-control"
                id="attachments"
                required
                value={this.state.attachments}
                onChange={this.onChangeAttachments}
                name="attachments"
              />
              </div>*/}
              <div className="form-group">
                <label htmlFor="startDate">Start Date :</label>
            
              <input
                type="date"
                className="form-control"
                id="startDate"
                required
                value={this.state.startDate}
                onChange={this.onChangeStartDate}
                name="startDate"
              />
              </div> 
              <div className="form-group">
                <label htmlFor="estimatedCompletionDate">Estimated Completion Date :</label>

              <input
                type="date"
                className="form-control"
                id="estimatedCompletionDate"
                required
                value={this.state.estimatedCompletionDate}
                onChange={this.onChangeEstimatedCompletionDate}
                name="estimatedCompletionDate"
              />
              </div>
             
            <div className="form-group">
                <label htmlFor="actualCompletionDate">Actual Completion Date :</label>
 
              <input
                type="date"
                className="form-control"
                id="actualCompletionDate"
             
                value={this.state.actualCompletionDate}
                onChange={this.onChangeActualCompletionDate}
                name="actualCompletionDate"
              />
              </div>
              <div className="form-group">
                <label htmlFor="signedContractReceivedDate">Signed Contract Received Date :</label>
 
              <input
                type="date"
                className="form-control"
                id="signedContractReceivedDate"
                
                value={this.state.signedContractReceivedDate}
                onChange={this.onChangeSignedContractReceivedDate}
                name="signedContractReceivedDate"
              />
              </div>
             
            
            <div className="form-group">
                <label htmlFor="">Inclusions :</label>

              <input
                type="textarea"
                className="form-control"
                id="inclusions"
              
                value={this.state.inclusions}
                onChange={this.onChangeInclusions}
                name="inclusions"
              />
              </div>
            
            <div className="form-group">
                <label htmlFor="">Exclusions :</label>
              
              <input
                type="textarea"
                className="form-control"
                id="exclusions"
             
                value={this.state.exclusions}
                onChange={this.onChangeExclusions}
                name="exclusions"
              />
   </div></div>
<div className="col-sm-6">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1</strong><br/>Create a Prime Contract</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Add SoV to a Prime Contract</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>

</div>
           
           
           
         
            <button onClick={this.savePrimeContract} className="btn btn-success">
              Save
            </button>&nbsp;&nbsp;
            <button onClick={this.savePrimeContract} className="btn btn-success">
            Cancel
            </button>&nbsp;&nbsp;
           &nbsp;&nbsp;
            <br /><br /><br />
            </div>
        )}
          </div>


    );
  }
}
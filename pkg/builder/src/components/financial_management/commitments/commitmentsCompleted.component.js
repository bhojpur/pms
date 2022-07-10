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
import CommitmentDataService from "./../../../services/commitment.service";
import SovDataService from "./../../../services/sov.service";
import SubDataService from "./../../../services/subcontractor.service";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import CheckIcon from '@material-ui/icons/Check';
import TimerIcon from '@material-ui/icons/Timer';
import DoneIcon from '@material-ui/icons/Done';

export default class Commitments extends Component {
    
    constructor(props) {
      super(props);
     
      this.onChangeSearchContractCompany = this.onChangeSearchContractCompany.bind(this);
      // this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
      // this.retrieveCommitment = this.retrieveCommitment.bind(this);
      this.refreshList = this.refreshList.bind(this);
      this.setActiveCommitment = this.setActiveCommitment.bind(this);
      this.searchContractCompany  = this.searchContractCompany.bind(this);
      // this.searchTitle  = this.searchTitle.bind(this);
      this.getOngoingCount=this.getOngoingCount.bind(this);
      this.getCompletedCount=this.getCompletedCount.bind(this);
      this.deleteCommitment = this.deleteCommitment.bind(this);
      this.calculateTotalSovs=this.calculateTotalSovs.bind(this);   
      this.retrieveSubcontractors = this.retrieveSubcontractors.bind(this);
      this.state = {
        commitments: [],
        subcontractors: [],
        currentCommitment: null,
        currentIndex: -1,
        content: "",
        searchContractCompany : "",
        // searchTitle : "",
        sovTotal:"",
        ongoingCount: 0,
        completedCount: 0,
        id: this.props.match.params.id,
      };
    }
  
    componentDidMount() {
      // this.retrieveCommitment(this.props.match.params.id);
      this.calculateTotalSovs(this.props.match.params.id);
      this.getOngoingCount();
      this.getCompletedCount();
      this.retrieveSubcontractors();
    }

    onChangeSearchContractCompany (e) {
      const searchContractCompany  = e.target.value;
  
      this.setState({
        searchContractCompany : searchContractCompany 
      });
    }

    // onChangeSearchTitle (e) {
    //   const searchTitle  = e.target.value;
  
    //   this.setState({
    //     searchTitle : searchTitle
    //   });
    // }

    // retrieveCommitment(id) {
    //   CommitmentDataService.getAll(id)
    //     .then(response => {
    //       this.setState({
    //         commitments: response.data
    //       });
    //       console.log(response.data);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // }

    retrieveSubcontractors(){
    
      SubDataService.getAll()//passing project id as id
        .then(response => {
          this.setState({
            subcontractors: response.data
          });
        })
        .catch(e => {
          console.log(e);
        });
    }

    calculateTotalSovs(id){
 
      SovDataService.getTotalSovs(id)
      .then((response) => {
        this.setState({
         sovTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }

    refreshList() {
      // this.retrieveCommitment();
      this.getOngoingCount();
      this.retrieveSubcontractors();
      //this.calculateTotalSovs();
      this.setState({
        currentCommitment: null,
        currentIndex: -1,
        //totalSov:"",
      });
    }

    setActiveCommitment(commitment, index) {
      this.setState({
        currentCommitment: commitment,
        currentIndex: index
      });
    }

    searchContractCompany () {
      const completedStatus ="Completed 🟢";
      CommitmentDataService.findByContractCompany (this.state.id, this.state.searchContractCompany,completedStatus  )
        .then(response => {
          this.setState({
            commitments: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

    // searchTitle () {
    //     const completedStatus ="Completed 🟢";
    //   CommitmentDataService.findByTitle(this.state.id, this.state.searchTitle,completedStatus )
    //     .then(response => {
    //       this.setState({
    //         commitments: response.data
    //       });
    //       console.log(response.data);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // }

    getOngoingCount() {
      const ongoingStatus ="Ongoing 🔴";
      CommitmentDataService.findByStatusOngoing(this.state.id,ongoingStatus)
        .then(response => {
          this.setState({
            ongoingCount: response.data.length,
           
          });
          console.log(response.data.length);
        })
        .catch(e => {
          console.log(e);
        });
    }

    getCompletedCount() {
      const completedStatus ="Completed 🟢";
      CommitmentDataService.findByStatusCompleted(this.state.id,completedStatus)
        .then(response => {
          this.setState({
            completedCount: response.data.length,
            commitments: response.data
          });
          console.log(response.data.length);
        })
        .catch(e => {
          console.log(e);
        });
    }


    //not working:/
    deleteCommitment() { 
      //this.getCommitment();
     
      CommitmentDataService.delete(this.state.id)
        .then(response => {
          console.log(response.data);
          //this.props.history.push('/commitment/'+this.state.projectId)
        })
        .catch(e => {
          console.log(e);
        });
    }

    getCommitment(id) {
      CommitmentDataService.get(id)
        .then(response => {
          this.setState({
            currentCommitment: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    
    render() {
        const { searchContractCompany, commitments ,currentIndex,id,sovTotal, ongoingCount,completedCount,subcontractors} = this.state;
        const today = new Date();
        const date1 = new Date(commitments.startdate);
        const date2 = new Date(commitments.estimatedCompletionDate);
        const diffTime = Math.abs(date2 - date1);
        const diffTime2 = Math.abs(date2 - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const remainDays = Math.ceil(diffTime2/(1000 * 60 * 60 * 24));
        console.log(diffTime + " milliseconds");
        console.log(diffDays + " days");
        console.log(remainDays + " remain days");


        return (
            <div>
               <div className="container row">
                <div className="col-12">
              <h3>COMMITMENTS</h3>
                <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/commitment/"+id} aria-current="page">
               Commitments
              </Link>
            </Breadcrumbs>
                <hr />
                </div>
            </div>

            <div className="container row">
            <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Commited Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {sovTotal}</span>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Ongoing Subcontracts</h3>
                <span className="fs-sm fw-normal text-muted">{ongoingCount}</span>
              </div>
            </div>
            <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Completed Subcontracts</h3>
                <span className="fs-sm fw-normal text-muted">{completedCount}</span>
              </div>
            </div>
            </div><br />

            <ul class="nav nav-tabs">  
            <li class="nav-item">
             <Link to={"/commitment/" +id}  class="nav-link"><TimerIcon style={{ color: "red" }} />&nbsp;Ongoing Subcontracts</Link>
            </li>
<li class="nav-item">
                       <Link class="nav-link active" aria-current="page"to={"#"}><DoneIcon style={{ color: "green" }}/>&nbsp;Completed Subcontracts</Link>
            </li>
           

          </ul><br />

            <div className="container">
           
            <div className="row">
            {/* <div className="col  text-left">
                <h4>Subcontracts List</h4></div> */}
                <div className="col text-right">
                <Link className="btn btn-primary mr-2" to={"/addcommitment/"+id}>
                + New Subcontract
                </Link>
            </div>
            </div>
            <div className="form-row mt-3">
                <div className="col-md-4">
                <div className="input-group mb-3">
                <select
              id="contractCompany"
              className="form-control"
              placeholder="Search by Contract Company"
              value={searchContractCompany}
              onChange={this.onChangeSearchContractCompany}
            >
              <option  value="" selected>All Subcontracts</option>
              {subcontractors &&
                subcontractors.map((c, index) => (
                <option
                    value={c.companyName}
                    onChange={this.onChangeSearchContractCompany}
                    key={index}
                >
                {/* unit data */}
                {c.companyName}
                </option>
                ))}
              </select>
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchContractCompany}
              >
                Search
              </button>
            </div>
                      
                      </div></div>
                    </div>
            {/* Commitments List */}
            <ul className="list-group">
            {commitments &&
                commitments.map((commitment, index) => (

                <div
               
                    className={
                    "list-group-item row" +
                    (index === currentIndex ? "active" : "")
                    }
                    class="card-header" id="headingOne"
                    //onClick={() => this.setActiveCommmitment(commitment, index)}
                    key={index}
                >
                <div className="row"  >
                <div className="col-10">
                <Link to={"/editcommitment/"+commitment.id} style={{ 'text-decoration': 'none','color':'#273f7d'}}><h5> #{commitment.id} - {commitment.title}</h5> </Link>
                    <h6>{commitment.contractCompany}</h6> 
                    {/* <h6>Status :  {commitment.status}</h6> */}
                   {/* <div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
 {(( Math.ceil(Math.abs(new Date(commitment.estimatedCompletionDate)-new Date(commitment.startdate))/(1000 * 60 * 60 * 24) ))> 0 ) ? 
              <div className="row"><ReportProblemOutlinedIcon style={{ color: "red" }}/><h3 className="h5 nav-heading-title mb-0">&nbsp;Ongoing</h3></div>:(Math.abs(new Date(commitment.estimatedCompletionDate)-new Date(commitment.startdate)) < 0)?<p>Completed</p>
: <CheckIcon/>  
 }
<br />
</div>*/}
                    {/* Button Group 
                    <Link to={"/viewcommitment/"+commitment.id}>*/}
                    
                 
                   
                    {/* <Button
                        variant="contained"
                        color="primary"
                        className="btn btn-primary"
                        endIcon={<VisibilityIcon/>}
                    >
                        View 
                    </Button>
                    </Link>
                    <Link to={"/editcommitment/"+commitment.id}>
                    <button className="btn btn-success m-2">Edit <UpdateIcon/> </button>
                    </Link>
                   
                    <button className="btn btn-danger" onClick={this.deleteCommitment}>Delete <DeleteIcon/> </button>*/}
                    
                    
                </div>
                {/* <div className="col-2">
                <img src={drawingIcon} alt="" width="50"/>
                </div>     */}
                </div>    
                </div>
                ))}
            </ul>
            </div> 
            </div>
        );
    }
}
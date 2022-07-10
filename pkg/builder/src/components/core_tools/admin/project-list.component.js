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
import CostCodeDataService from "./../../../services/costcode.service";
import ProjectDataService from "./../../../services/project.service";
import { Link } from "react-router-dom";
import { Modal,ListGroup } from "react-bootstrap";
import Chip from "@material-ui/core/Chip";
import BootstrapTable from 'react-bootstrap-table-next';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Breadcrumbs } from "@material-ui/core";

//table for costtcodes
const columns = [{
  dataField: 'id',
  text: 'ID',
  headerStyle: (column, colIndex) => {
      return { width: '7%', textAlign: 'center' };}
}, {
  dataField: 'Date',
  text: 'date',
  headerStyle: (column, colIndex) => {
      return { width: '22%', textAlign: 'center' };}
}, {
  dataField: 'costCode',
  text: 'Cost Code',
  headerStyle: (column, colIndex) => {
      return { width: '18%', textAlign: 'center' };}
}
];

export default class ProjectsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveProjects = this.retrieveProjects.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveProject = this.setActiveProject.bind(this);
    this.removeAllProjects = this.removeAllProjects.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      projects: [],
      currentProject: null,
      currentIndex: -1,
      searchTitle: "",
      currentCostCodes:[]
    };
  }

  componentDidMount() {
    this.retrieveProjects();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveProjects() {
    ProjectDataService.getAll()
      .then(response => {
        this.setState({
          projects: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
    });
  }

  refreshList() {
    this.retrieveProjects();
    this.setState({
      currentProject: null,
      currentIndex: -1
    });
  }

  setActiveProject(project, index) {
    this.setState({
      currentProject: project,
      currentIndex: index
    });
  }

  removeAllProjects() {
    ProjectDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    ProjectDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          projects: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getCostCodesForProjects(id){
    this.setState({
      currentCostCodes: []
    });
    CostCodeDataService.getAll(id)
      .then(response => {
        this.setState({
          currentCostCodes: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
    });
    console.log(id);
    console.log(this.state.currentCostCodes);
  }

  returnCostCodes(){

    var data1=[];
    var temp={};
    // this.state.currentCostCodes && this.state.currentCostCodes.map((value,index) => { 
    //   temp={},
    //   temp.id=value.id,
    //   temp.date= value.date,
    //   temp.costCode=value.costCode,
    //   data1.push(temp)
    // })
    return(
      <div className="pr-2 pb-5">
        <BootstrapTable 
            hover
            keyField='id'
            data={ data1 }
            columns={ columns } 
            cellEdit={ false }

      />
      </div>
  )
        
    
  }

  VisitCostCode(){
    let address="/addCostCode/"+this.state.currentProject.id
    window.open(address)
  }

  render() {
    const { searchTitle, projects, currentProject, currentIndex } = this.state;

    return (
      <div>
      {/* Top */}
      <div>
          <h2>PROJECT DASHBOARD</h2>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">
              Home
            </Link>
            <Link color="inherit" to={"/admin"}>
              Core Dashboard
            </Link>
            <Link color="inherit" to={"/projects/"}>
              Projects
            </Link>
          </Breadcrumbs>
        </div> 
        <div className="mt-1">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      {/* Top ends */}
      <div className="">
        <h3>Projects List</h3>
        <h6>Create new projects to the system</h6>
        
      </div>
      <div className="row"> 
        <div className="col-md-6">
        <Link className="btn btn-primary mb-2" to="/addProject">Add New Project</Link>
          <ListGroup as="ul">
            {projects &&
              projects.map((project, index) => (
                <ListGroup.Item as="li"
                  action
                  onClick={() => this.setActiveProject(project, index)}
                  key={index}
                >
                  <h6>{project.title}</h6>
                </ListGroup.Item>
              ))}
            </ListGroup>

          <button className="btn btn-danger mt-2" onClick={this.removeAllProjects}>
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentProject ? (
            <div>
              <div>
                <label>
                  <h5><strong>Title:</strong></h5>
                </label>{" "}
                <h6>{currentProject.title}</h6>
              </div>
              <div>
                <label>
                  <h5><strong>Description:</strong></h5>
                </label>{" "}
                <h6>{currentProject.description}</h6>
              </div>
              <div>
                <label>
                  <h5><strong>Location:</strong></h5>
                </label>{" "}
                <h6>{currentProject.location}</h6>
              </div>
              <div>
                <label>
                  <h5><strong>Status:</strong></h5>
                </label>{" "}
                <h6>{currentProject.published ? "🔵 Published" : "🟡 Pending"}</h6>
              </div>
              <hr></hr>
              <Link
                to={"/projectmanagementhome/"+ currentProject.id}
                className="m-1 btn btn-sm btn-primary">
                Manage
              </Link>
              <Link
                to={"/addcustomdepartment/"+ currentProject.id}
                className="m-1 btn btn-sm btn-success"
                >
                Department
              </Link>
              <Link
                to={"/addmilestoneproject/"+ currentProject.id}
                className="m-1 btn btn-sm btn-success">
                Milestone
              </Link>
              <Link
                to={"/assignuser/"+ currentProject.id}
                className="m-1 btn btn-sm btn-success">
                Assign Users
              </Link>
              <Link
                to={"/projects/" + currentProject.id}
                className="m-1 btn btn-sm btn-warning"
              >
                Edit
              </Link>
              <Link
                to={"/addCostCode/"+ currentProject.id}
              >
              <a
                className="m-1 btn btn-sm btn-secondary"
              >
                Cost Codes
              </a>
              </Link>
            </div>
          ) : (
            <div>
              <br/>
              <p>Please click on a Project...</p>
            </div>
          )}
        </div>
      </div>

      {/* Costcode modal Starts */}
      <div className="modal fade" id="costcodeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                
                <div className="modal-header">
                  <h4 className="modal-title" style={{ fontSize:20 }}> <AttachMoneyIcon/>Cost Codes</h4>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                
                <div className="modal-body">
                <div className="row">
                {(this.state.currentCostCodes && this.state.currentCostCodes.length)
                  ? 
                        
                  <div className="pr-2">
                    <BootstrapTable 
                      hover
                      keyField='id'
                      data={ this.state.currentCostCodes}
                      columns={ columns } 
                      cellEdit={ false }
                    />
                  </div>

                  : <b className="ml-3 mb-3" style={{ fontSize:20 },{color: 'red'}}> 
                    No Cost Codes Assigned</b>
                }
                </div> 
                  <Link><a  onClick={()=>this.VisitCostCode()} className="btn btn-primary pr-3 ml-2 mr-3" data-dismiss="modal"> + Add Cost code </a></Link>
                  <a className="btn btn-secondary ml-6 mr-6 pl-3" id ="deleteModalDismiss" data-dismiss="modal"> Cancel</a>
                </div>
                </div>
              </div>
            
          </div>
          {/* Costcode modal Ends */}
      </div>
    );
  }
}
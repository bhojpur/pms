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

//import PDF generating
import Report from './report/report.component'

import ProgressBar from 'react-customizable-progressbar';
import { Assessment, HomeWork, LocationOn, Description, SupervisorAccount, Timeline, Build, Visibility } from '@material-ui/icons';

import UserService from "../services/user.service";
import EmployeeDataService from "../services/employee.service";
import VendorDataService from "../services/vendor.service";
import SubDataService from "../services/subcontractor.service";
import CostCodeDataService from "../services/costcode.service";
import ProjectDataService from "../services/project.service";
import ProjectUserDataService from "../services/projectuser.service";
import EquipmentDataService from "../services/equipment.service";

//css styles
const cardStyle = {
  backgroundColor: "#6B7BA4",
  "&:hover": {
    backgroundColor: "#efefef"
  }
}

const linkText = {
  color: "#FFFFFF",
  textDecoration: "none"
}

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.getprojectCount = this.getprojectCount.bind(this);
    this.getVendorCount = this.getVendorCount.bind(this);
    this.getEmployeeCount = this.getEmployeeCount.bind(this);
    this.getprojectDetails = this.getprojectCount.bind(this);
    this.retrieveProjects = this.retrieveProjects.bind(this);
    this.equipCount = this.equipCount.bind(this);
    this.state = {
      projects: [],
      content: "",
      projectCount: 0,
      vendorCount: 0,
      subCount: 0,
      employeeCount: 0,
      equipmentCount: 0,
      currProjectId: 0,
      costCodes: [],
      projectUsers: [],
      id: "this.props.match.params.id"
    };

    //console.log(this.getprojectDetails());
  }

  expand(card) {
    card.classList.toggle('profile--expanded');

    // If card is not expanded after toggle, add 'unexpanded' class
    if (!card.classList.contains('profile--expanded')) card.classList.toggle('profile--unexpanded');
    // Else if card is expanded after toggle and still contains 'unexpanded' class, remove 'unexpanded'
    else if (card.classList.contains('profile--expanded') && card.classList.contains('profile--unexpanded')) card.classList.toggle('profile--unexpanded');
  }

  toggleTheme() {
    let docu = document.querySelector('html');

    docu.classList.toggle('light-theme');
    docu.classList.toggle('dark-theme');
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );

    this.retrieveProjects();
    this.getprojectCount();
    this.getVendorCount();
    this.getEmployeeCount();
    this.getSubCount();
    this.equipCount();
  }

  equipCount() {
    EquipmentDataService.getAll().then(response => {
      this.setState({
        equipmentCount: response.data.length,

      });
      //console.log(this.employeeCount);
    })
      .catch(e => {
        console.log(e);
      });
  }

  getEmployeeCount() {
    //get Employee count
    EmployeeDataService.getAll().then(response => {
      this.setState({
        employeeCount: response.data.length,

      });
      //console.log(this.employeeCount);
    })
      .catch(e => {
        console.log(e);
      });
  }

  getprojectCount() {
    //get Project count
    ProjectDataService.getAll().then(response => {
      this.setState({
        projectCount: response.data.length,

      });
      //console.log(projectDetails);
    })
      .catch(e => {
        console.log(e);
      });
  }

  getVendorCount() {
    //get Project count
    VendorDataService.getAll().then(response => {
      this.setState({
        vendorCount: response.data.length,

      });
      //console.log(projectDetails);
    })
      .catch(e => {
        console.log(e);
      });
  }

  getSubCount() {
    //get Project count
    SubDataService.getAll().then(response => {
      this.setState({
        subCount: response.data.length,

      });
      //console.log(projectDetails);
    })
      .catch(e => {
        console.log(e);
      });
  }
  //private  var projectDetails=[];
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

  generatePDF(project, noUsers) {
    Report.generatePDF(project, noUsers);
  }


  generateProjectReport(projects, a, b, c) {
    Report.generateProjectReport(projects, a.toString(), b.toString(), c.toString());
  }

  createUser(userId) {
    if (typeof userId == 'undefined') {
      window.location = "/register"
    } else {
      window.location = "/register/" + userId
    }
  }

  getProjectUsers(projid) {

    ProjectUserDataService.getProjectUsers(projid)
      .then(response => {
        this.setState({
          projectUsers: response.data.length
        });
        console.log(response.data);
        console.log(this.state.projectUsers);
      })
      .catch(e => {
        console.log(e);
      });
    console.log(this.state);

    // //get employees per project one by one
    // let tempEmp=[];
    // this.state.projectUsers.map(emp =>(
    //   EmployeeDataService.get
    // ))
  }

  getProjectCostCodes(id) {

    CostCodeDataService.getAll(id)
      .then(response => {
        this.setState({
          costCodes: response.data
        })
        console.log(response.data);
        console.log(this.state);
      })
      .catch(e => {
        console.log(e);
      });
    console.log(this.state)
    const temp = [];

    this.state.costCodes.forEach((item, index) => {
      console.log(item.costCode)
      temp.push(item.costCode)
    })

    console.log(temp);
    return temp;
  }

  render() {
    const { projectDetails, projectCount, vendorCount, subCount, employeeCount, projects, equipmentCount } = this.state;

    var elements = {};
    //this.getprojectDetails(elements);
    console.log(projects);
    const items = []

    const today = new Date();

    const progressInDays = (start, end) => {
      let date1 = new Date(start);
      let date2 = new Date(end);
      let diffTime = Math.abs(date2 - date1);
      let diffTime2 = Math.abs(date2 - today);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let remainDays = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
      console.log(diffTime + " milliseconds");
      console.log(diffDays + " days");
      console.log(remainDays + " remain days");

      return remainDays;
    }

    return (
      `
    .card-hover:hover {
      color:red;
      transform: scale(1.001);
      background: #f0c14b;
    }
    `,
      <div className="container">

        <h3> <Timeline /> CORE TOOLS HOME</h3>
        <p>Current statistics of ongoing projects </p>
        <div className="row">
          <div className="col-lg-3 col-sm-6 pb-2" id="employeecard">
            <div className="card card-hover shadow-sm" style={cardStyle}>
              <a className="d-block nav-heading text-center mt-3" style={linkText}> <Link style={linkText} to="/employees">

                <h1 className="nav-heading-title mb-0" style={{ fontSize: 55 }}>{employeeCount}</h1>
                <h5 mb-0> <SupervisorAccount style={{ fontSize: 25 }} />  Employees</h5>
              </Link></a>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6 pb-5" id="projectcard">
            <div className="card card-hover shadow-sm" style={cardStyle}>

              <Link className="d-block nav-heading text-center mt-3" style={linkText} to="/projects">
                <h1 className="nav-heading-title mb-0" style={{ fontSize: 55 }}>{projectCount}</h1>
                <h5> <HomeWork style={{ fontSize: 25 }} />  Projects</h5>
              </Link>

              {/* <Link to={"/projects"}>
          <h1 className="nav-heading-title mb-0" style={{ fontSize:55 }}>{projectCount}</h1>
            <h5> <HomeWork style={{ fontSize:25 }}/>  Projects</h5>

          </Link> */}
            </div>
          </div>

          <div className="col-lg-3 col-sm-6" id="vendorcard">
            <div className="card card-hover shadow-sm" style={cardStyle}>
              <a className="d-block nav-heading text-center mt-3" style={linkText}> <Link to="/vendor" style={linkText}>

                <h1 className="nav-heading-title" style={{ fontSize: 55 }}>{vendorCount + subCount}</h1>
                <h6> <HomeWork style={{ fontSize: 25 }} />  Vendors & Subcontractors</h6>
              </Link></a>
            </div>
          </div>

          <div className="col-lg-3 col-sm-6" id="equipmentcard">
            <div className="card card-hover shadow-sm" style={cardStyle}>
              <a className="d-block nav-heading text-center mt-3" style={linkText}> <Link to="/equipments" style={linkText}>
                <h1 className="nav-heading-title" style={{ fontSize: 55 }}>{equipmentCount}</h1>
                <h6> <Build style={{ fontSize: 25 }} />  Equipments</h6>
              </Link></a>
            </div>
          </div>

          <div className="col-8 mb-4 mr-5">
            <a onClick={() => { this.generateProjectReport(this.state.projects, vendorCount, subCount, employeeCount); }} className="btn btn-primary p-2"><Description style={{ fontSize: 20 }} /> Report of current projects</a>
          </div>
        </div>
        <div classname-="mb-2 pb-4">
          <h3> Ongoing Projects:</h3>
        </div>

        {projects.map(project => (
          <div className="card card-hover shadow-sm card-text-bhojpur my-3">
            <div className="row">
              <div className="col-5 m-2" style={{ textDecoration: 'none' }}>
                <h4>{project.title}</h4>
                <h6>Description : {project.description}</h6>
                <h6>Location: {project.location}</h6>
                <h6>From : {project.startdate} to {project.enddate}</h6>

                <a onClick={() => { this.getProjectUsers(project.id); this.generatePDF(project, this.state.projectUsers.toString()); }} className="btn btn-primary p-2 my-2"><Description style={{ fontSize: 20 }} /> Generate Report</a>
                <Link to={"projectmanagementhome/" + project.id}><a className="btn btn-secondary p-2 ml-4 my-2"><Visibility style={{ fontSize: 20 }} /> View</a></Link>

              </div>
              <div className="col-4 mt-4">
                <center>
                  <h2><b>{progressInDays(project.startdate, project.enddate)}{" "}</b>Days</h2>
                  <h3>Remaining</h3>
                </center>
              </div>
              <div className="col-2">
                <center>
                  <ProgressBar
                    radius={60}
                    progress={project.progressValue}
                    cut={120}
                    rotate={-210}
                    initialAnimation
                    initialAnimationDelay={1}
                    strokeWidth={13}
                    strokeColor="#273f7d"
                    transition="2s ease"
                    trackStrokeWidth={12}
                    trackTransition="1s ease"
                    pointerRadius={3}
                    pointerStrokeWidth={12}
                  />
                  {/* <h6 className="mb-10"><b>66%</b></h6>  */}
                </center>
              </div>
            </div>
          </div>
        ))}


        <div className="row">

          {/* Admin content */}
          <div className="col-10">
            <div className="tab-content" id="nav-tabContent">
              {/*Admin core tools description  */}
              <div className="modal fade pt-4" id="list-admin" role="dialog" aria-labelledby="list-home-list" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered pt-4" role="document">
                  <div className="modal-content">
                    <p>Manage Important dates</p>
                    <div class="col text-center">
                      <a href="/dates" className="btn btn-outline-primary"> Go To Dates</a>
                    </div>
                    <p>Manage Deafults</p>
                    <a href="/defaults" className="btn btn-outline-primary"> Go To Defaults</a>
                    <p>Manage Roles</p>
                    <a href="/roles" className="btn btn-outline-primary"> Go To Roles</a>
                  </div>
                </div>
              </div>
              {/* Admin project description */}
              <div className="tab-pane fade" id="list-home" role="tabpanel" aria-labelledby="list-profile-list">
                {/* This is the pre project creation tab  */}
                <h2>Project Admin</h2>

                <p>Create a new project inside the system</p>
                <a href="/addproject" className="btn btn-outline-primary">+ Add New Project</a>
                <p>List All Project</p>
                <a href="/projects" className="btn btn-outline-primary">Project Home</a>
              </div>
              <div className="tab-pane fade" id="list-directory" role="tabpanel" aria-labelledby="list-messages-list">
                <h5>Directory</h5>
                <p>View Employee Directory</p>
                <a href="/employees" className="btn btn-outline-primary"> Employees</a>
                <p>View Vendor Directory</p>
                <a href="/vendor" className="btn btn-outline-primary"> Vendors</a>
                <p>View Project Directory</p>
                <a href="/projects" className="btn btn-outline-primary"> Projects</a>
              </div>

              <div className="tab-pane fade" id="list-document" role="tabpanel" aria-labelledby="list-settings-list">
                <h5>This is document</h5>
                <p>Manage pre construction level docments</p>
                <a href="/document" className="btn btn-outline-primary"> Go To a Document</a>
              </div>

              <div className="tab-pane fade" id="list-tasks" role="tabpanel" aria-labelledby="list-settings-list">
                <h5>Tasks</h5><hr />
                <a href="/tasksconfiguration" className="btn btn-outline-primary mr-3"> Task Tool Configuration</a>
                <a href="/managetasks" className="btn btn-outline-primary"> Manage Tasks</a>
              </div>
              <div className="tab-pane fade" id="list-report" role="tabpanel" aria-labelledby="list-settings-list">This is report</div>
            </div>
          </div>
          {/*  debug stuff DELETE*/}
          {/* <div><p>sfdsfds</p></div> */}

        </div>
        {/* <Defaults /><Dates /><Roles /> */}
      </div>
    );
  }
}
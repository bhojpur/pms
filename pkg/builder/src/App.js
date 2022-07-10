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
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.js';
// import $ from 'jquery';
// import Popper from 'popper.js';
import "./App.css";
import mainIcon from "././assets/bhojpur.png";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AuthService from "./services/auth.service";
import ProjectUserService from "./services/projectuser.service";

import Login from "./components/login.component";
import ForgetPassword from "./components/forgetpassword.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Homereal from "./components/homereal.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-project.component";
import BoardResource from "./components/board-resource.component";
import BoardModerator from "./components/board-finance.component";
import BoardAdmin from "./components/board-admin.component";
import ErrorPage from "./components/error.component";

import AddProject from './components/core_tools/admin/add-project.component';
import AddDepartment from "./components/core_tools/admin/add-department.component";
import AddCustomDepartment from "./components/core_tools/admin/add-department-custom.component";
import AddMilestone from "./components/core_tools/admin/add-milestone.component";
import AddMilestoneGeneral from "./components/core_tools/admin/add-milestone-custom.component";
import AssignUserProject from "./components/core_tools/admin/add-projectuser.component";
import ProjectsList from './components/core_tools/admin/project-list.component';
import Project from './components/core_tools/admin/project.component';

import DrawingHome from "./components/project_management/drawings/drawings.component";
import AddDrawing from "./components/project_management/drawings/adddrawing.component";
import AddDrawingCategory from "./components/project_management/drawings/adddrawingcategory.component";
import ViewSingleDrawingCategory from "./components/project_management/drawings/drawing-category-singlepage";
import UpdateDrawingCategory from "./components/project_management/drawings/updatedrawing-category.component";
import ViewSingleDrawing from "./components/project_management/drawings/drawing-singlepage.component";
import UpdateDrawing from "./components/project_management/drawings/updatedrawing.component";

import AddPhoto from "./components/project_management/photos/addphoto.component";
import UploadPhotos from "./components/project_management/photos/uploadphoto.component";
import PhotosHome from "./components/project_management/photos/photos.component";
import AddAlbum from "./components/project_management/photos/addalbum.component";
import ViewSingleAlbum from "./components/project_management/photos/album-singlepage.component";
import MoveCapturetoAlbum from "./components/project_management/photos/movecapturestoalbum.component";
import CameraSinglePage from "./components/project_management/photos/camera.component";
import UpdateAlbum from "./components/project_management/photos/updatealbum.component";
import UpdatePhoto from "./components/project_management/photos/updatephoto.component";

import BiddingHome from "./components/project_management/biddings/bidding.component";
import AddBidding from "./components/project_management/biddings/addbidding.component";
import ViewSpec from "./components/project_management/biddings/viewspec.component";

import ViewSingleBidding from "./components/project_management/biddings/viewbidding.component";
import PortfolioHome from "./components/project_management/portfolio/portfolio.component";
import PortfolioStepper from "./components/project_management/portfolio/singleportfolio.component";
import ProjectManagementHome from "./components/project_management/project-manage-home.component";

import Dates from "./components/core_tools/admin/dates.component";
import Defaults from "./components/core_tools/admin/defaults.component";
import Roles from "./components/core_tools/admin/roles.component";

import AddUser from "./components/core_tools/bhojpur-directory/add-emp.component";
import EditUser from "./components/core_tools/bhojpur-directory/edit-emp.component";
import Vendors from "./components/core_tools/bhojpur-directory/vendors.component";
import Employee from "./components/core_tools/bhojpur-directory/employees.component";
import AddVendor from "./components/core_tools/bhojpur-directory/add-vendor.component";
import EditVendor from "./components/core_tools/bhojpur-directory/edit-vendor.component";
import Subcontractors from "./components/core_tools/bhojpur-directory/subcontractors.component";
import AddSub from "./components/core_tools/bhojpur-directory/add-sub.component";
import EditSub from "./components/core_tools/bhojpur-directory/edit-sub.component";
import AddCostCodes from "./components/core_tools/bhojpur-directory/add-costcode.component";

import TaskConfiguration from "./components/core_tools/tasks/configuration.component";
import ManageTasks from "./components/core_tools/tasks/manage.component";
import UpdateTasks from "./components/core_tools/tasks/update.component";
import ViewTasks from "./components/core_tools/tasks/view.component";

import DocumentHome from "./components/project_management/document/document.component";
import AddDirectory from "./components/project_management/document/adddirectory.component";
import ViewDirectory from "./components/project_management/document/viewsingledirectory.component";
import UpdateDirectory from "./components/project_management/document/updatedirectory.component";
import UploadDocFiles from "./components/project_management/document/adddocument.component";
import UploadDocment from "./components/project_management/document/uploaddocument.component";
import ViewSingleDocument from "./components/project_management/document/viewsingledocument.component";
import UpdateDocument from "./components/project_management/document/updatedocument.component";

import MeetingsHome from "./components/project_management/meetings/meeting.component";
import CreateMeetings from "./components/project_management/meetings/createmeeting.component";
import CreateFollowupMeetings from "./components/project_management/meetings/createfollowup.component";
import ViewMeeting from "./components/project_management/meetings/view.component";
import ViewOnlyMeeting from "./components/project_management/meetings/viewonly.component";

import BudgetHome from "./components/financial_management/budget/budget.component";
import PrimeContracts from "./components/financial_management/prime-contracts/primecontracts.component";
import CreatePrimeContracts from "./components/financial_management/prime-contracts/addprimecontract.component";
import DirectCostHome from "./components/financial_management/direct-costs/direct-costs.component";
import InvoiceHome from "./components/financial_management/invoicing/invoices.component";

import rfiHome from "./components/project_management/rfi/rfi.component";
import CreateRFI from "./components/project_management/rfi/create.component";
import EditRFI from "./components/project_management/rfi/edit.component";
import ViewRFI from "./components/project_management/rfi/view.component";

import actionplanHome from "./components/project_management/actionplan/actionplan.component";
import AddActionPlan from "./components/project_management/actionplan/addactionplan.component";
import ViewAPType from "./components/project_management/actionplan/viewactionplantype.component";
import ActionPlanSinglePage from "./components/project_management/actionplan/actionplansinglepage.component";
import AddAPItem from "./components/project_management/actionplan/addapitem.component";
import AddAPSection from "./components/project_management/actionplan/addapsection.component";
import ViewActionPlan from "./components/project_management/actionplan/viewactionplan.component";
import ViewAPSection from "./components/project_management/actionplan/viewactionplansection.component";
import ViewAPItems from "./components/project_management/actionplan/viewactionplanitems.component";
import ViewAPItem from "./components/project_management/actionplan/viewoneapitem.component";

import DailyLogHome from "./components/project_management/dailylog/dailylog.component";
import CreateDCL from "./components/project_management/dailylog/createcalllog.component";
import CreateDAL from "./components/project_management/dailylog/createaccidentlog.component";
import CreateDGL from "./components/project_management/dailylog/creategenerallog.component";
import CreateDWL from "./components/project_management/dailylog/createweatherlog.component";
import ViewDCL from "./components/project_management/dailylog/viewcalllog.component";
import ViewDAL from "./components/project_management/dailylog/viewaccidentlog.component";
import ViewDGL from "./components/project_management/dailylog/viewgenerallog.component";
import ViewDWL from "./components/project_management/dailylog/viewweatherlog.component";
import ViewDCLall from "./components/project_management/dailylog/viewallcall.component";
import ViewDALall from "./components/project_management/dailylog/viewallaccident.component";
import ViewDGLall from "./components/project_management/dailylog/viewallgeneral.component";
import ViewDWLall from "./components/project_management/dailylog/viewallweather.component";

import punchlistHome from "./components/project_management/punchlist/punchlist.component";
import CreatePL from "./components/project_management/punchlist/create-basic.component";
import CreatePhotos from "./components/project_management/punchlist/create-addphoto.component";
import PLTView from "./components/project_management/punchlist/viewtype.component";
import PLIView from "./components/project_management/punchlist/view.component";

import ResourceManagementHome from "./components/resource_management/resource-manage-home.component";
import Timesheet from "./components/resource_management/Timesheet/Timesheet.component";
import Crew from "./components/resource_management/Crew/crew.component";
import NewCrew from "./components/resource_management/Crew/new-crew.component";
import Schedule from "./components/resource_management/Schedule/schedule.component";
import Equipments from "./components/resource_management/Equipment/equipment.component";
import EquipDetails from "./components/resource_management/Equipment/equipmentDetails.component";
import ViewTimesheet from "./components/resource_management/Timesheet/view-timesheet.component";
import AddWorkers from "./components/resource_management/Timesheet/add-workers.component";
import AddWorker from "./components/resource_management/Crew/add-worker.component";
import EquipView from "./components/resource_management/Equipment/equipmentView.component";

import FinancialManagementHome from "./components/financial_management/financial-manage-home.component";
import AddBudget from "./components/financial_management/budget/addbudget.component";
import EditPrimeContracts from "./components/financial_management/prime-contracts/editPrimeContracts.component";
import AddDirectCost from "./components/financial_management/direct-costs/adddirectcost.component";
import CommitmentHome from "./components/financial_management/commitments/commitments.component";
import AddCommitment from "./components/financial_management/commitments/addcommitment.component";
import ViewSingleCommitment from "./components/financial_management/commitments/commitment-singlepage.component";
import AddSov from "./components/financial_management/commitments/addsov.component";

import ViewSingleDirectCost from "./components/financial_management/direct-costs/directcost-singlepage.component";
import SovHome from "./components/financial_management/commitments/sovs.component";

import AddInvoice from "./components/financial_management/invoicing/addinvoice.component";
import AddPayment from "./components/financial_management/commitments/addpayment.component";
import PaymentHome from "./components/financial_management/commitments/payments.component";
import EditSingleCommitment from "./components/financial_management/commitments/commitment-edit.component";
import ViewSingleSov from "./components/financial_management/commitments/sov-singlepage.component";
import ViewSingleBudget from "./components/financial_management/budget/budget-singlepage.component";
import AddEmployee from "./components/core_tools/bhojpur-directory/add-emp.component";
import Report from "./components/report/report.component";

import UploadExcel from "./components/financial_management/direct-costs/excelupload.component";
import EstimateBudget from "./components/financial_management/budget/budgetestimates.component";
import BUploadExcel from "./components/financial_management/budget/bexcelupload.component";
import CommitmentCompletedHome from "./components/financial_management/commitments/commitmentsCompleted.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    this.retriveUserProjects = this.retriveUserProjects.bind(this);
    this.shiftProject = this.shiftProject.bind(this);
    this.onChnagePid = this.onChnagePid.bind(this);
    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      projectname: "",
      projectId: 1,
      uprojects: [],
      projectLength: 0,
      id: "",
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
      this.retriveUserProjects(user.id);
    }

  }
  retriveUserProjects(id) {
    ProjectUserService.getProjectUserProjectDetails(id)
      .then(response => {
        this.setState({
          uprojects: response.data,
          projectLength: response.data.length,
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  shiftProject(e) {
    //console.log("Project Id selected is : "+e.target.value);
    // cogoToast.success("Project Changed Successfully!");
  }
  onChnagePid(e) {
    this.setState({
      projectId: e.target.value
    });
  }
  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard, projectId, uprojects, projectLength } = this.state;

    return (
      <div>
        <link rel="\public\icons\051-dumper truck.png" href=".\public\icons\051-dumper truck.png" type="image/x-icon" />
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/home"} className="navbar-brand">
            <img
              src={mainIcon}
              style={{ 'width': "50px", height: "50px" }}
              alt="profile-img"
              className="mr-1"
            /> Bhojpur PMS
          </Link>

          <div className="navbar-nav mr-auto">
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  <h6>Dashboard</h6>
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              {projectLength > 1 &&
                <li className="nav-item">
                  <select
                    className="form-control"
                    value={this.state.projectId}
                    onChange={this.onChnagePid}
                    style={{ 'font-weight': 'bold' }}
                  >
                    {uprojects &&
                      uprojects.map((project, index) => (
                        <option
                          style={{ 'color': 'black', 'font-weight': 'bold' }}
                          key={index}
                          value={project.projectId}
                          onChange={this.onChangePid}
                        >
                          {project.title}
                        </option>
                      ))}
                  </select>
                </li>
              }
              {projectLength > 1 &&
                <li className="nav-item">
                  <a href={"/projectmanagementhome/" + projectId} style={{ 'text-decoration': 'none' }} className="nav-link mb"
                    onClick={this.shiftProject}>
                    <ArrowForwardIosIcon style={{ 'fontSize': '25px' }} />
                  </a>
                </li>
              }
              {projectLength == 1 &&
                <li className="nav-item">
                  {uprojects &&
                    uprojects.map((project, index) => (
                      <Link className="nav-link"
                        style={{ 'color': 'white', 'font-weight': 'bold' }}
                        key={index}
                        value={project.projectId}
                        onChange={this.onChangePid}
                        to={"/projectmanagementhome/" + project.projectId}
                      >
                        <h6>{project.title}</h6>
                      </Link>
                    ))}
                </li>
              }
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  <h6>Profile</h6>
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  <h6>LogOut</h6>
                </a>
              </li>
            </div>
          ) : (

            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              {/* <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li> */}
            </div>
          )}

        </nav>
        {!currentUser && (
          <Routes>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logincode" component={ForgetPassword} />
            <Route path="/camera" component={CameraSinglePage} />

            <Route component={ErrorPage}/>
          </Routes>
        )}
        {currentUser && (

          <div className="container mt-3">
            <Routes>
              <Route exact path={["/", "/home"]} component={Home} />
              {/* <Route exact path={["/", "/homereal"]} component={Homereal} /> */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/register/:id" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route path="/projectmanagement" component={BoardUser} />
              <Route path="/adddepartment/:id" component={AddDepartment} />
              <Route path={"/addcustomdepartment/:id"} component={AddCustomDepartment} />
              <Route path="/addmilestone/:id" component={AddMilestone} />
              <Route path="/addmilestoneproject/:id" component={AddMilestoneGeneral} />
              <Route path="/assignuser/:id" component={AssignUserProject} />
              <Route path="/projectmanagementhome/:id" component={ProjectManagementHome} />

              <Route path="/resource" component={BoardResource} />
              <Route path="/financialmanagement" component={BoardModerator} />
              <Route path="/admin" component={BoardAdmin} />
              <Route exact path={["/", "/projects"]} component={ProjectsList} />

              <Route path="/addproject" component={AddProject} />
              <Route path="/projects/:id" component={Project} />
              <Route path="/dates" component={Dates} />
              <Route path="/defaults" component={Defaults} />
              <Route path="/roles" component={Roles} />
              {/* Porfolio */}
              <Route path="/portfolio/:id" component={PortfolioHome} />
              <Route path="/portstepper" component={PortfolioStepper} />
              {/* Tasks */}
              <Route path="/tasksconfiguration" component={TaskConfiguration} />
              <Route path="/managetasks" component={ManageTasks} />
              <Route path="/managestasks/update" component={UpdateTasks} />
              <Route path="/managestasks/view" component={ViewTasks} />
              {/* Meeting */}
              <Route path="/meetings/:id" component={MeetingsHome} />
              <Route path="/createmeetings/:id" component={CreateMeetings} />
              <Route path="/createfollowup/:id/:cid" component={CreateFollowupMeetings} />
              <Route path="/viewmeeting/:id/:mtid" component={ViewMeeting} />
              <Route path="/viewonlymeeting/:id/:mtid" component={ViewOnlyMeeting} />
              {/* RFI */}
              <Route path="/rfi" component={rfiHome} />
              <Route path="/managerfi/create" component={CreateRFI} />
              <Route path="/managerfi/edit" component={EditRFI} />
              <Route path="/managerfi/view" component={ViewRFI} />
              {/* Action Plan */}
              <Route path="/actionplan/:id" component={actionplanHome} />
              <Route path="/addactionplan/:id" component={AddActionPlan} />
              <Route path="/actionplansingle/:id/:apid" component={ActionPlanSinglePage} />
              <Route path="/addactionplanitem/:id/:apid" component={AddAPItem} />
              <Route path="/addactionplansection/:id/:apid" component={AddAPSection} />
              <Route path="/viewactionplantype/:id/:apid" component={ViewAPType} />
              <Route path="/viewactionplansection/:id/:apid" component={ViewAPSection} />
              <Route path="/viewactionplanitems/:id/:apid" component={ViewAPItems} />
              <Route path="/viewapitemsingle/:id/:apid" component={ViewAPItem} />
              <Route exact path="/viewactionplan/:id/:apid" component={ViewActionPlan} />
              {/* Punch List */}
              <Route path="/punchlist/:id" component={punchlistHome} />
              <Route path="/managepunchlist/createaddphoto/:id/plid" component={CreatePhotos} />
              <Route path="/managepunchlist/create/:id" component={CreatePL} />
              <Route path="/viewtype/:pltid" component={PLTView} />
              <Route path="/view/:id/:pliid" component={PLIView} />
              {/* Daily Logs */}
              <Route path="/dailylogs/:id" component={DailyLogHome} />
              <Route path="/createaccidentlog/:id" component={CreateDAL} />
              <Route path="/createcalllog/:id" component={CreateDCL} />
              <Route path="/creategenerallog/:id" component={CreateDGL} />
              <Route path="/createweatherlog/:id" component={CreateDWL} />
              <Route path="/viewaccidentlog/:id/:dlid" component={ViewDAL} />
              <Route path="/viewcalllog/:id/:dlid" component={ViewDCL} />
              <Route path="/viewgenerallog/:id/:dlid" component={ViewDGL} />
              <Route path="/viewweatherlog/:id/:dlid" component={ViewDWL} />
              <Route path="/viewaccidentall/:id" component={ViewDALall} />
              <Route path="/viewcallall/:id" component={ViewDCLall} />
              <Route path="/viewgeneralall/:id" component={ViewDGLall} />
              <Route path="/viewweatherall/:id" component={ViewDWLall} />
              
              <Route path="/addCostCode/:id" component={AddCostCodes} />
              <Route path="/addUser" component={AddEmployee} />
              <Route path="/editUser/:id" component={EditUser} />
              <Route path="/vendor" component={Vendors} />
              <Route path="/employees" component={Employee} />
              <Route path="/addVendor" component={AddVendor} />
              <Route path="/editVendor/:id" component={EditVendor} />
              <Route path="/subcontractors" component={Subcontractors} />
              <Route path="/addSub" component={AddSub} />
              <Route path="/editSub/:id" component={EditSub} />
              {/* Document */}
              <Route path="/directory/:id" component={AddDirectory} />
              <Route path="/document/:id" component={DocumentHome} />
              <Route path="/adddocument/:id" component={UploadDocFiles} />
              <Route path="/uploaddocument/:name" component={UploadDocment} />
              <Route exact path="/updatedocument/:pid/:id" component={UpdateDocument} />
              <Route exact path={"/viewdirectory/:pid/:id"} component={ViewDirectory} />
              <Route exact path={"/updatedirectory/:pid/:id"} component={UpdateDirectory} />
              <Route path={"/viewsingledocument/:id"} component={ViewSingleDocument} />
              {/* Drawing Component Routes  */}
              <Route path="/drawing/:id" component={DrawingHome} />
              <Route path="/adddrawingcategory/:id" component={AddDrawingCategory} />
              <Route path="/viewdrawingcategory/:pid/:cat" component={ViewSingleDrawingCategory} />
              <Route exact path={"/updatedrawingcategory/:id/:pid"} component={UpdateDrawingCategory} />
              <Route path="/adddrawing/:id" component={AddDrawing} />
              <Route path="/viewdrawing/:cat/:id" component={ViewSingleDrawing} />
              <Route exact path="/updatedrawing/:id/:pid" component={UpdateDrawing} />
              {/* Photo Component Routes */}
              <Route path="/photos/:id" component={PhotosHome} />
              <Route path="/addphoto/:id" component={AddPhoto} />
              <Route path="/uploadphoto/:name" component={UploadPhotos} />
              <Route path="/camera/:id" component={CameraSinglePage} />
              <Route path="/viewalbum/:id" component={ViewSingleAlbum} />
              <Route path="/addalbum/:id" component={AddAlbum} />
              <Route exact path={"/updatealbum/:pid/:id"} component={UpdateAlbum} />
              <Route exact path={"/updatephoto/:pid/:id"} component={UpdatePhoto} />
              <Route path="/movecapture/:id" component={MoveCapturetoAlbum} />
              {/* Bidding Component Routes  */}
              <Route path="/bidding/:id" component={BiddingHome} />
              <Route path="/addbidding" component={AddBidding} />
              <Route path="/viewbidding" component={ViewSingleBidding} />
              <Route path="/viewspec" component={ViewSpec} />
              <Route path="/budget/:id" component={BudgetHome} />
              <Route path="/addbudget/:id" component={AddBudget} />
              <Route path="/prime-contracts" component={PrimeContracts} />
              <Route path="/addprimecontract/:id" component={CreatePrimeContracts} />
              <Route path="/directcost/:id" component={DirectCostHome} />
              <Route path="/invoice/:id" component={InvoiceHome} />

              <Route path="/primecontract/:id" component={PrimeContracts} />

              {/*resource management */}
              <Route path="/resourcemanagementhome/:id" component={ResourceManagementHome} />
              {/* {/timesheet/} */}
              <Route path="/timesheet/:id" component={Timesheet} />
              <Route path="/viewTimesheet/:id/:code" component={ViewTimesheet} />
              <Route path="/addWorkers/:id/:code" component={AddWorkers} />
              {/* {/crew/} */}
              <Route path="/crew/:id" component={Crew} />
              <Route path="/newCrew/:id" component={NewCrew} />
              <Route path="/addWorker/:id" component={AddWorker} />
              {/* {/schedule/} */}
              <Route path="/schedule/:id" component={Schedule} />
              {/* {/equipment/} */}
              <Route path="/equipments" component={Equipments} />
              <Route path="/equipDetails/:code" component={EquipDetails} />
              <Route path="/equipView/:id" component={EquipView} />

              {/* {/<Route path="/equipDetails/:id/:code" component={EquipDetails} />/} */}

              {/*financial management */}
              <Route path="/financialmanagementhome/:id" component={FinancialManagementHome} />
              <Route path="/editprimecontracts/:id" component={EditPrimeContracts} />
              <Route path="/adddirectcost/:id" component={AddDirectCost} />
              {/* Commitment Component Routes  */}
              <Route path="/commitment/:id" component={CommitmentHome} />
              <Route path="/addcommitment/:id" component={AddCommitment} />
              {/* {/<Route path="/viewdrawing/:id" component={ViewSingleDrawing} />/} */}
              <Route path="/viewcommitment/:id" component={ViewSingleCommitment} />
              <Route exact path="/addsov/:pid/:id" component={AddSov} />
              <Route path="/viewdirectcost/:pid/:id" component={ViewSingleDirectCost} />
              {/* <Route path="/viewsov/:id" component={ViewSingleSov} />*/}
              <Route exact path="/viewsov/:pid/:id" component={SovHome} />

              <Route path="/addinvoice/:id" component={AddInvoice} />
              <Route path="/addpayment/:id" component={AddPayment} />
              <Route path="/viewpayment/:id" component={PaymentHome} />
              <Route path="/editcommitment/:id" component={EditSingleCommitment} />
              <Route path="/viewsinglesov/:pid/:id" component={ViewSingleSov} />
              <Route path="/viewbudget/:id" component={ViewSingleBudget} />
              <Route path="/excelupload/:id" component={UploadExcel} />
              <Route path="/budgetestimates/:id" component={EstimateBudget} />
              <Route path="/bexcelupload/:id" component={BUploadExcel} />
              <Route path="/commitmentCompleted/:id" component={CommitmentCompletedHome} />

              {/*Report and PDF */}
              <Route path="/report/" component={Report} />
              <Route component={ErrorPage} />
            </Routes>
          </div>
        )}
        <div className="mt-50">
          <div style={{ 'height': '150px' }}></div>
          <center>
            <h6>Copyright &copy; 2018 by Bhojpur Consulting Private Limited, India. All rights reserved.</h6>
          </center>
        </div>
      </div>
    );
  }
}
export default App;
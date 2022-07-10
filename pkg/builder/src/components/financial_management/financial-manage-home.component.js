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
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import UserService from "./../../services/user.service";
import ProjectDataService from "./../../services/project.service";

import budgetIcon from "././../../assets/FM/budget.png";
import addbudgetIcon from "././../../assets/FM/estimateBudget.png";
import primecontractsIcon from "././../../assets/FM/primecontract.png";
import costIcon from "././../../assets/FM/cost.png";
import invoiceIcon from "././../../assets/FM/invoice.png";
import commitmentsIcon from "././../../assets/FM/commitments.png";

import Card from 'react-bootstrap/Card';
export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      content: "",
      id: this.props.match.params.id
    };
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
    this.retrieveProjects(this.state.id);
  }
  retrieveProjects(id) {
    ProjectDataService.get(id)
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

  render() {
    const {id,projects} = this.state;
    return (
      <div className="container">
        
          <div className="row">
            <div className="col-12">
            <Card
              bg={'success'}
              text={'white'}
              //style={{ width: '14rem' }}
              className="mb-2"
            >
              
              <Card.Body>
                <Card.Title><h4>{projects.title}</h4></Card.Title>
                <Card.Text>
                <h6>Description : {projects.description}</h6>
                <h6>Location: {projects.location}</h6> 
                </Card.Text>
              </Card.Body>
            </Card> </div></div>
            <h3>Financial Management Tools</h3><br />
        
        <div className="row" style={{alignItems: "center"}} >
          <div className="col-lg-3 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="See the Budget Overview">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/budget/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={budgetIcon} alt="" width="50"/><br />
                <h3 className="h5 nav-heading-title mb-0">Budget Overview</h3>
                {/*<span className="fs-sm fw-normal text-muted">See the Budget Overview</span>*/}
              </Link>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Estimate the Project Budget.">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/budgetestimates/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={addbudgetIcon} alt="" width="50"/><br />
                <h3 className="h5 nav-heading-title mb-0">Budget Estimates</h3>
                {/*<span className="fs-sm fw-normal text-muted">Estimate the Project Budget.</span>*/}
              </Link>
              </div>
            </div>
         {/* <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm">
            <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/primecontract/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={primecontractsIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Prime Contracts</h3>
                <span className="fs-sm fw-normal text-muted">Easily create and manage contracts with the clients.</span>
                </Link>
              </div>
    </div>*/}
          <div className="col-lg-3 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" title="Track all direct costs that are not associated with commitments.">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/directcost/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={costIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Direct Costs</h3>
                {/*<span className="fs-sm fw-normal text-muted">Track all direct costs that are not associated with commitments.</span>*/}
                </Link>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 mb-grid-gutter pb-2">
              <div className="card card-hover shadow-sm" title="See the Status and Schedule of Values of all the Contracts.">
              <Link className="d-block nav-heading text-center mb-2 mt-2" to={"/commitment/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={commitmentsIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Commitments</h3>
                {/*<span className="fs-sm fw-normal text-muted">See the Status and Schedule of Values of all the Contracts.</span>*/}
              </Link>
              </div>
            </div>
         {/* <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm">
              <Link className="d-block nav-heading text-center mt-2 mb-2" to={"/invoice/" + id} style={{ 'text-decoration': 'none' }}>
                <img src={invoiceIcon} alt="" width="50"/>
                <h3 className="h5 nav-heading-title mb-0">Invoicing</h3>
                <span className="fs-sm fw-normal text-muted">View and review the invoice collection of the project.</span>
              </Link>
              </div>
  </div>*/}
          </div>
      </div>
    );
  }
}
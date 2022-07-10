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
import CostCodeDataService from "./../../../services/costcode.service";
import BudgetDataService from "./../../../services/budget.service";
import DirectCostDataService from "./../../../services/directcost.service";
import SovDataService from "./../../../services/sov.service";
import Table from 'react-bootstrap/Table';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CheckIcon from '@material-ui/icons/Check';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default class BudgetList extends Component {
    constructor(props) {
      super(props);
      this.getBudgetOverview  = this.getBudgetOverview.bind(this);
      this.calculateTotalDirectCosts = this.calculateTotalDirectCosts.bind(this);
      this.calculateTotalSovs = this.calculateTotalSovs.bind(this);
      this.calculateTotalEstimatedBudget = this.calculateTotalEstimatedBudget.bind(this);
      this.onChangeSearchCostCode= this.onChangeSearchCostCode.bind(this);
      this.findByCostCode=this.findByCostCode.bind(this);
      this.handleClose=this.handleClose.bind(this);
      this.handleClick=this.handleClick.bind(this);
      // this.myFunction=this.myFunction.bind(this);
      this.state = {
        id: this.props.match.params.id,
        budgets: [],
        projectId: "",
        directCostTotal:"",
        budgetTotal:"",
        sovTotal:"",
        tot:"",
        searchCostCode: "",
        anchorEl:null
      };
    }
  
    componentDidMount() {
      this.getBudgetOverview(this.props.match.params.id);
      this.calculateTotalDirectCosts(this.props.match.params.id);
      this.calculateTotalSovs(this.props.match.params.id);
      this.calculateTotalEstimatedBudget(this.props.match.params.id);
    }

    handleClick(e){
      const anchorEl = e.target.value;
  
      this.setState({
        anchorEl: anchorEl
      });
    }
  
    handleClose(){
      this.setState({
        anchorEl: null
      });
    };

    onChangeSearchCostCode(e) {
      const searchCostCode = e.target.value;
  
      this.setState({
        searchCostCode: searchCostCode
      });
    }

    findByCostCode(id,searchCostCode){
      BudgetDataService.findByCostCode(id,searchCostCode)
        .then((response) => {
          this.setState({
            budgets: response.data
          });
        })
        .catch((e) => {
          console.log(e);
        });
    };

    getBudgetOverview(id) {
      BudgetDataService.getBudgetOverview(id)
        .then(response => {
          this.setState({
            budgets: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

    // myFunction() {
    //   // Declare variables
    
    //   const input = document.getElementById("myInput");
    //   const filter = input.value.toUpperCase();
    //   const table = document.getElementById("myTable");
    //   const tr = table.getElementsByTagName("tr");
    //   const i = 0;
    
    //   // Loop through all table rows, and hide those who don't match the search query
    //   for (i = 0; i < tr.length; i++) {
    //     const td = tr[i].getElementsByTagName("td")[0];
    //     if (td) {
    //       const txtValue = td.textContent || td.innerText;
    //       if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //         tr[i].style.display = "";
    //       } else {
    //         tr[i].style.display = "none";
    //       }
    //     }
    //   }
    // }

    calculateTotalDirectCosts(id){
 
      DirectCostDataService.getTotalDirectCosts(id)
      .then(response => {
        this.setState({
         directCostTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }
  
    calculateTotalSovs(id){
   
      SovDataService.getTotalSovs(id)
      .then(response => {
        this.setState({
         sovTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }
  
    calculateTotalEstimatedBudget(id){
   
      BudgetDataService.getTotalBudget(id)
      .then(response => {
        this.setState({
          budgetTotal: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    
    }

    render() {
        const { id,directCostTotal,budgetTotal,sovTotal,searchCostCode,budgets,currentIndex,anchorEl} = this.state;
        const data = [
          {
            name: "Estimated Budget",
            EB: (parseFloat(budgetTotal).toFixed(2)),
          },
          {
            name: "Total Cost",
            TC : (parseFloat(sovTotal + directCostTotal).toFixed(2))
          }
        ];
        return (
            <div>
              <div className="row">
              <div className="col" >
               <h2>BUDGET OVERVIEW</h2>
               <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/budget/"+id} aria-current="page">
               Budget Overview
              </Link>
            </Breadcrumbs>
</div>
<div className="col" >
<div className="row">
<div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
 {(Number(sovTotal)+Number(directCostTotal)) > budgetTotal ? 
              <div className="row"><ReportProblemOutlinedIcon style={{ color: "red" }}/><h3 className="h5 nav-heading-title mb-0">&nbsp;Over Budget</h3></div>
: (Number(sovTotal)+Number(directCostTotal)) < budgetTotal ? 
<div className="row"><ReportProblemOutlinedIcon style={{ color: "green" }}/><h3 className="h5 nav-heading-title mb-0">&nbsp;Under Budget</h3></div>
:(Number(sovTotal)+Number(directCostTotal) === budgetTotal) ? <div className="row"><CheckIcon  style={{ color: "green" }}/><h3 className="h5 nav-heading-title mb-0">&nbsp;On Budget</h3></div>
:<div>No Data</div>
}
<br />
</div>
</div>

<div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0">Revised (Rs.) : <span style={{ color: 'red' }}>{ parseFloat(Number(sovTotal)+Number(directCostTotal)-Number(budgetTotal)).toFixed(2)}</span></h3>
<br />
</div>
</div>
</div>
</div>
              </div>
              {/*<Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
Financial Management Home
</Button>
<Menu
  id="simple-menu"
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={this.handleClose}
>
<Link  to={"/budgetestimates/"+id}><MenuItem onClick={this.handleClose}>Budget Overview</MenuItem></Link>
     <Link  to={"/budgetestimates/"+id}><MenuItem onClick={this.handleClose}>Budget Estimates</MenuItem></Link>
   <Link  to={"/directcost/"+id}><MenuItem onClick={this.handleClose}>Direct Costs</MenuItem></Link>
 <Link  to={"/commitment/"+id}><MenuItem onClick={this.handleClose}>Commitments</MenuItem></Link>
        </Menu>*/}
              <hr></hr>
              <div className="row" style={{alignItems: "center"}} >
              <div className="col" >
              <BarChart
      width={400}
      height={200}
      data={data}
      margin={{
        top: 5,
        right: 5,
        left: 40,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="EB" fill="#82ca9d" />
      <Bar dataKey="TC" fill="#EF253D" />
    </BarChart>
   </div>
  
   <div className="col" >     
   <div className="row" style={{alignItems: "center"}} >
          <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2" >
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Estimated Budget</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {isNaN(parseFloat(budgetTotal).toFixed(2)) ? "0.00": parseFloat(budgetTotal).toFixed(2)}</span>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2">
              <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {isNaN(parseFloat(sovTotal+directCostTotal).toFixed(2))? "0.00":parseFloat(sovTotal+directCostTotal).toFixed(2)}</span>
              </div>
            </div>
    </div>
    <div className="row" style={{alignItems: "center"}} >
          <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Commited Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {isNaN(parseFloat(sovTotal).toFixed(2))? "0.00":parseFloat(sovTotal).toFixed(2)} </span>
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 mb-grid-gutter pb-2">
            <div className="card card-hover shadow-sm" style={{alignItems: "center"}} >
                <h3 className="h5 nav-heading-title mb-0">Total Direct Cost</h3>
                <span className="fs-sm fw-normal text-muted">Rs. {isNaN(parseFloat(directCostTotal).toFixed(2))? "0.00":parseFloat(directCostTotal).toFixed(2)}</span>
              </div>
    </div>
         
            </div>
            {/*<div className="form-group col-md-4">
        <div className="input-group mb-3">
        
 <select 
                
                id="costCode"
           
                
                name="costCode"
                className="form-control"
            placeholder="Search by cost code"
            value={searchCostCode}
            onChange={this.onChangeSearchCostCode}
              >
                <option  selected value="">All</option>
             {budgets &&
                budgets.map((budget, index) => (
                <option
                    //value={budget.costCode}
                    //onChange={onChangeSearchCostCode}
                    key={index}
                >
                
                {budget.costCode}
                </option>
                ))}

           
             
              </select>

          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.findByCostCode}
            >
              Search
            </button>
          </div>
        </div>
      </div>*/}
          </div>
          </div>   
          <hr /> 
          <br />
          {/* <input type="text" id="myInput" onkeyup={this.myFunction()} placeholder="Search .." /> */}
          
            
              {/* Drawing List */}
              <Table  id="myTable" className="table table-striped table-bordered" responsive>
                <thead className="Table-header">
                  <tr>
                  <th>#</th>
                    <th>Cost Code</th>
                    <th>Estimated Budget</th>
                    <th>Direct Cost</th>
                    <th>Commited Cost</th>
                    <th>Total Cost</th>
                    <th>Revised Amount</th>
                    <th>Over/Under</th>
                  </tr>
                </thead>
                {/* Functional for table data */}
                <tbody>
                {budgets &&
                    budgets.map((budget, index) => (
                    <tr
                        // className={
                        // "list-group-item row" +
                        // (index === currentIndex ? "active" : "")
                        // }
                        // onClick={() => this.setActiveProject(project, index)}
                        key={index}
                    >

<td>{budget.id}</td>
                    <td>{budget.costCode}</td>
                    <td>{(budget.estimatedBudget !== null) ? budget.estimatedBudget:"0.00"}</td>
                    <td>{(budget.dtotal !== null ) ? budget.dtotal:"0.00" }</td>
                    <td>{(budget.stotal !== null ) ? budget.stotal:"0.00" }</td>
                    <td>{(Number(budget.stotal)+Number(budget.dtotal) !== null) ? parseFloat(Number(budget.stotal)+Number(budget.dtotal)).toFixed(2) : "0.00" }</td>
                    <td>{( Number(Number(budget.stotal)+Number(budget.dtotal))-Number(budget.estimatedBudget) !== null) ?  parseFloat(Number(Number(budget.stotal)+Number(budget.dtotal))-Number(budget.estimatedBudget)).toFixed(2) : "0.00"}</td> 
                    <td>{(Number(budget.stotal)+Number(budget.dtotal)) > budget.estimatedBudget ? <ArrowUpwardIcon style={{ color: "red" }}/>:(Number(budget.stotal)+Number(budget.dtotal)) < budget.estimatedBudget ? <ArrowDownwardIcon style={{ color: "green" }}/>:<CheckIcon/>}</td>    
                    </tr>
                    ))}
                </tbody>
                {/*Ends */}
              </Table>
             
            </div>
        );
    }
}
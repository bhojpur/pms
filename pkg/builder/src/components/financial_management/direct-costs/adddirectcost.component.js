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

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Route, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DirectCostDataService from "./../../../services/directcost.service";
import BudgetDataService from "./../../../services/budget.service";
import VendorDataService from "./../../../services/vendor.service";
import EmployeeDataService from "./../../../services/employee.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';

const AddDirectCost = (props) => {

  /**validation */
  const validationSchema = Yup.object().shape({
    costCode: Yup.string().required('Cost Code is required'),
    description: Yup.string().required('Description is required'),
    vendor: Yup.string().required('Vendor is required'),
    employee: Yup.string().required('Employee is required'),
    receivedDate: Yup.date()
    .typeError('Select a valid Received Date')
    .required('Received Date is required'),
    paidDate: Yup.date()
    .typeError('Select a valid Paid Date')
    .required('Paid Date is required')
    .min(
      Yup.ref('receivedDate'),
      "Paid Date can't be smaller than Received Date"
    ),
    amount: Yup.number()
    .required('Amount is required')
    .typeError('You must specify a valid number'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = data => {
    console.log(JSON.stringify(data, null, 2));
  };
/**End of validation */

  //const {pid}= useParams();

  const initialDirectCostState = {
    id: null,
    costCode :"",
    description :"",
    category :"",
    vendor :"",
    employee :"",
    receivedDate :"",
    paidDate :"",
    amount: "",
    projectId:props.match.params.id,  
    
  };

  const {id}= useParams();
  const [budgets, setBudgets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [directcost, setDirectCost] = useState(initialDirectCostState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    retrieveBudgets();  
    retrieveVendors();
    retrieveEmployees();  

  }, []);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setDirectCost({ ...directcost, [name]: value });
  };

  const retrieveBudgets = () => {
    
    BudgetDataService.getAll(id)//passing project id as id
      .then((response) => {
        setBudgets(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveVendors = () => {
    
    VendorDataService.getAll()//passing project id as id
      .then((response) => {
        setVendors(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const retrieveEmployees = () => {
    
    EmployeeDataService.getAll()//passing project id as id
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const saveDirectCost = () => {
    var data = {
      costCode: directcost.costCode,
      description: directcost.description,
      category: directcost.category,
      vendor: directcost.vendor,
      employee: directcost.employee,
      receivedDate: directcost.receivedDate,
      paidDate: directcost.paidDate,
      amount: directcost.amount,
      projectId: directcost.projectId,
    };
if(directcost.receivedDate <= directcost.paidDate){
    DirectCostDataService.create(data)
      .then(response => {
        setDirectCost({
          id: response.data.id,
          costCode: response.data.costCode,
          description: response.data.description,
          category: response.data.category,
          vendor: response.data.vendor,
          employee: response.data.employee,
          receivedDate: response.data.receivedDate,
          paidDate: response.data.paidDate,
          amount: response.data.amount,
          projectId: response.data.projectId,
     
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  
 const viewDirectCost = () => {
  props.history.push("/directcost/"+ directcost.projectId);
  cogoToast.success("Direct Cost Saved Successfully!");
 }

  const newDirectCost = () => {
    setDirectCost(initialDirectCostState);
    setSubmitted(false);
  };

 
  return (
        <div className="container">
       
        {submitted ? (

         viewDirectCost()

        ) : (
          <div class="container">
            <h2>New Direct Cost</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+directcost.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/directcost/"+directcost.projectId} aria-current="page">
               Direct Costs
              </Link>
              <Link color="textPrimary" to={"/adddirectcost/"+directcost.projectId} aria-current="page">
               New Direct Cost
              </Link>
            </Breadcrumbs>
                <hr />
            <div className="row">
       <div className="col-sm-6">
       <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="costCode">Cost Code :</label>

                <select 
                id="costCode"
                name="costCode"
                {...register('costCode')}
                value={directcost.costCode}
                onChange={handleInputChange}
                className={`form-control ${errors.costCode ? 'is-invalid' : ''}`}
              >

        <option value="" disabled selected>Select a Cost Code</option>
        {budgets &&
                budgets.map((budget, index) => (
                <option
                    value={budget.costCode}
                    onChange={handleInputChange}
                    key={index}
                >
                {/* unit data */}
                {budget.costCode}
                </option>
                ))}
              </select>
              <div className="invalid-feedback">{errors.costCode?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Description :</label>
              <input
                type="text"          
                id="description"
                name="description"
                {...register('description')}
                list="suggest"
                value={directcost.description}
                onChange={handleInputChange}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              />
              <datalist id="suggest">
                                            <option value="bond paper 3 bundles for architectural drawings">bond paper 3 bundles for architectural drawings</option>
                                            <option value="telephone cost in finance department">telephone cost in finance department</option>
                                    </datalist>
               <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="amount">Vendor :</label>
              <select
                id="vendor"
                name="vendor"
                {...register('vendor')}
                className={`form-control ${errors.vendor ? 'is-invalid' : ''}`}
                value={directcost.vendor}
                onChange={handleInputChange}
                
              >
<option value="" disabled selected>Select a Vendor</option>
{vendors &&
                vendors.map((vendor, index) => (
                <option
                    value={vendor.companyName}
                    onChange={handleInputChange}
                    key={index}
                >
                {/* unit data */}
                {vendor.companyName}
                </option>
                ))}
 </select>
               <div className="invalid-feedback">{errors.vendor?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Reporting Employee :</label>
              <select
                id="employee"
                name="employee"
                {...register('employee')}
                value={directcost.employee}
                onChange={handleInputChange}
                className={`form-control ${errors.employee ? 'is-invalid' : ''}`}
              >

<option value="" disabled selected>Select an Employee</option>
{employees &&
                employees.map((employee, index) => (
                <option
                    value={employee.name}
                    onChange={handleInputChange}
                    key={index}
                >
                {/* unit data */}
                {employee.name}
                </option>
                ))}
 </select>
               <div className="invalid-feedback">{errors.employee?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="date">Received Date :</label>
              <input
                type="date"
                id="receivedDate"
                name="receivedDate"
                {...register('receivedDate')}
                value={directcost.receivedDate}
                onChange={handleInputChange}
                className={`form-control ${errors.receivedDate ? 'is-invalid' : ''}`}
              />
               <div className="invalid-feedback">{errors.receivedDate?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="date">Paid Date :</label>
              <input
                type="date"
                id="paidDate"
                name="paidDate"
                {...register('paidDate')}
                value={directcost.paidDate}
                onChange={handleInputChange}
                className={`form-control ${errors.paidDate ? 'is-invalid' : ''}`}
              />
               <div className="invalid-feedback">{errors.paidDate?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount :</label>
              <input
                type="text"
                id="amount"
                name="amount"
                {...register('amount')}
                value={directcost.amount}
                onChange={handleInputChange}
                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              />
               <div className="invalid-feedback">{errors.amount?.message}</div>
            </div>
            <div className="form-group">
            <button type="submit" onClick={saveDirectCost} className="btn btn-success">
              Save
            </button>
            &nbsp;&nbsp;
            {/* <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button> */}
          &nbsp;&nbsp;{/*reset not working properly. values doesn't reset, only the error msgs*/}
           {/* <Link to={"/directcost/" + directcost.projectId}>
            <button className="btn btn-success">
            Cancel
                </button></Link> */}
            </div>
            </form>
            </div>
            
            <div className="col-sm-6">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1</strong><br/>Create a Direct Cost.</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Direct Cost will be automatically added to the Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>View the Direct Costs.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 4</strong><br/>Edit/Delete a DirectCost.</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
            
            </div><br />
          {/** */} 
          </div>
        )} 
        <br /><br />
      </div>
  );
};

export default AddDirectCost;
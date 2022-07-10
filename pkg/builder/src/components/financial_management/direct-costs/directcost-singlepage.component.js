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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DirectCostDataService from "./../../../services/directcost.service";
import BudgetDataService from "./../../../services/budget.service";
import VendorDataService from "./../../../services/vendor.service";
import EmployeeDataService from "./../../../services/employee.service";
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import UpdateIcon from '@material-ui/icons/Update';
import { Route, useParams } from "react-router-dom";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';

const DirectCost = props => {

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
      "Paid Date can't be before Received Date"
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


  //const {projectId}= useParams();
  const initialDirectCostState = {
    id: null,
    costCode: "",
    description: "",
    vendor: "",
    employee: "",
    receivedDate: "",
    paidDate: "",
    amount: "",
    projectId:""
  };

  const {id}= useParams();
  const {pid}= useParams();
  const [budgets, setBudgets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [employees, setEmployees] = useState([]);
const [currentDirectCost, setCurrentDirectCost] = useState(initialDirectCostState);
const [submitted, setSubmitted] = useState(false);
const [message, setMessage] = useState("");


  const getDirectCost = id => {
    DirectCostDataService.get(id)
      .then(response => {
        setCurrentDirectCost(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveBudgets = () => {
    
    BudgetDataService.getAll(pid)//passing project id as id
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

  useEffect(() => {
    getDirectCost(props.match.params.id); 
    retrieveVendors();
    retrieveEmployees();
    retrieveBudgets();   
  },[props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentDirectCost({ ...currentDirectCost, [name]: value });
  };



  const updateDirectCost = () => {
    if(currentDirectCost.receivedDate <= currentDirectCost.paidDate && currentDirectCost.description !== "" ){
    DirectCostDataService.update(currentDirectCost.id, currentDirectCost)
      .then(response => {
        console.log(response.data);
        setSubmitted(true);
        props.history.push("/directcost/"+ currentDirectCost.projectId);
        cogoToast.success("Direct Cost Updated Successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  const viewDirectCost = () => {
    props.history.push("/directcost/"+ currentDirectCost.projectId);
    cogoToast.success("Direct Cost Updated Successfully!");
   }

   const updatePublished = (status) => {

    var data = {
      id: currentDirectCost.id,
      costCode: currentDirectCost.costCode,
      description: currentDirectCost.description,
      vendor: currentDirectCost.vendor,
      employee: currentDirectCost.employee,
      receivedDate: currentDirectCost.receivedDate,
      paidDate: currentDirectCost.paidDate,
      amount: currentDirectCost.amount,
      published:status
    };
    DirectCostDataService.update(currentDirectCost.id, data)
      .then(response => {
        props.history.push("/directcost/"+currentDirectCost.projectId);
        cogoToast.success("Direct Cost Deleted Successfully!");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
   

    
  };


  const deleteDirectCost = () => {
    DirectCostDataService.remove(currentDirectCost.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/directcost/"+currentDirectCost.projectId);//check this again
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container">
          {/* {submitted ? (
         viewDirectCost()
 
          ) : (*/}
        <div class="container">
          <h2>Direct Costs</h2>
          <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+currentDirectCost.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/directcost/"+currentDirectCost.projectId} aria-current="page">
              Direct Costs
              </Link>
              <Link color="textPrimary" to={"/viewdirectcost/"+currentDirectCost.projectId + "/"+currentDirectCost.id} aria-current="page">
               Edit Direct Cost
              </Link>
            </Breadcrumbs>
                <hr />
          <div className="row">
       <div className="col-sm-6">
       <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="costCode">Cost Code :</label>
             {/* <input
                type="text"
                className="form-control"
                id="costCode"
                required
                value={this.state.costCode}
                onChange={this.onChangeCostCode}
                name="costCode"
             />*/}
                <select
                id="costCode"
                name="costCode"
                {...register('costCode')}
                value={currentDirectCost.costCode}
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
              <label htmlFor="title">Description :</label>
              <input
                type="text"
                
                id="description"
                name="description"
                {...register('description')}
                value={currentDirectCost.description}
                onChange={handleInputChange}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="title">Vendor :</label>
              <select
                id="vendor"
                name="vendor"
                {...register('vendor')}
                value={currentDirectCost.vendor}
                onChange={handleInputChange}
                className={`form-control ${errors.vendor ? 'is-invalid' : ''}`}
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
              <label htmlFor="title">Reporting Employee :</label>
              <select
                id="employee"
                name="employee"
                {...register('employee')}
                value={currentDirectCost.employee}
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
              <label htmlFor="description">Received Date :</label>
              <input
                type="date"
              
                id="receivedDate"
                name="receivedDate"
                {...register('receivedDate')}
                value={currentDirectCost.receivedDate}
                onChange={handleInputChange}
                className={`form-control ${errors.receivedDate ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.receivedDate?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Paid Date :</label>
              <input
                type="date"
               
                id="paidDate"
                name="paidDate"
                {...register('paidDate')}
                value={currentDirectCost.paidDate}
                onChange={handleInputChange}
                className={`form-control ${errors.paidDate ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.paidDate?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Amount :</label>
              <input
                type="text"
               
                id="amount"
                name="amount"
                {...register('amount')}
                value={currentDirectCost.amount}
                onChange={handleInputChange}
                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.amount?.message}</div>
            </div>
            <div className="form-group">

            <button className="btn btn-danger" onClick={() =>{updatePublished(false);reset()}}>
            Delete <DeleteIcon/> 
          </button>

          <button
            type="submit"
            className="btn btn-success m-2"
            onClick={() =>{updateDirectCost();reset()}}
          >
            Update <UpdateIcon/>
          </button>
         {/* <Link to={"/directcost/" + currentDirectCost.projectId}>
            <button className="btn btn-success">
            Cancel
                </button></Link> */}
          {/* <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button> */}

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
                <TimelineContent><h6><strong>Step 1</strong><br/>Edit a Direct Cost</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Direct Cost amount will be automatically updated in the Budget.</h6></TimelineContent>
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
                <TimelineContent><h5><strong>Step 4</strong><br/>Edit/Delete a DirectCost.</h5></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
          
          
          </div>
          
        </div>
    { /* )} */}
    </div>
  );
};

export default DirectCost;
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

import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { Route, useParams } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
//import { Route, useParams } from "react-router-dom";
import BudgetDataService from "./../../../services/budget.service";
import CostCodeDataService from "./../../../services/costcode.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';

const AddBudget = (props) => {

  /**validation */

  const validationSchema = Yup.object().shape({
    costCode: Yup.string().required('Cost Code is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.string().required('Date is required'),
estimatedBudget: Yup.number()
.typeError('You must specify a valid number')
.required('Budget Amount is required'),
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

  

  const initialBudgetState = {
    id: null,
    costCode :"",
    description :"",
    date :"",
    estimatedBudget: "",
    projectId:props.match.params.id,    
  };

  const [budget, setBudget] = useState(initialBudgetState);
  const [costcodes, setCostCodes] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [today,setToday] = useState("");

  // const getDateTime = () => {

  //   let tempDate = new Date();
  //   let t = tempDate.getFullYear() + '-' +(tempDate.getMonth()+1) + '-' +tempDate.getDate() ; 
  //   const currDate =  t;
  //   console.log(currDate);
  //  setToday(currDate);
  //  setBudget({ ...budget, date: currDate });
  // };

  useEffect(() => {
    // getDateTime();
    retrieveCostCodes();  
    
  }, []);

  const {id}= useParams();

  const retrieveCostCodes = () => {
    
    CostCodeDataService.getAll(id)//passing project id as id
      .then((response) => {
        setCostCodes(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setBudget({ ...budget, [name]: value });
  };


  const saveBudget = () => {
    var data = {
      costCode: budget.costCode,
      description: budget.description,
      date: budget.date,
      estimatedBudget: budget.estimatedBudget,
      projectId: budget.projectId,
    };

    BudgetDataService.create(data)
      .then(response => {
        setBudget({
          id: response.data.id,
          costCode: response.data.costCode,
          description: response.data.description,
          date: response.data.date,
          estimatedBudget: response.data.estimatedBudget,
          projectId: response.data.projectId,
     
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        cogoToast.error("There's a problem with estimating this budget. Check if you have already estimated budget for this or any field is blank.!");
        console.log(e);
      });

    
  };

 const viewBudget = () => {
  props.history.push("/budgetestimates/"+ budget.projectId);
  cogoToast.success("Budget Estimate Saved Successfully!");
 }

  const newBudget = () => {
    setBudget(initialBudgetState);
    setSubmitted(false);
  };


  
  return (
    
        <div className="container">
       
        {submitted ? (       
            viewBudget()       
        ) : (
          <div class="container">
            <h2>New Budget Estimate</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+budget.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/budgetestimates/"+budget.projectId} aria-current="page">
               Budget Estimates
              </Link>
              <Link color="textPrimary" to={"/addbudget/"+budget.projectId} aria-current="page">
               New Budget Estimate
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
           
                autocomplete="on"
                name="costCode"
                {...register('costCode')}
                value={budget.costCode}
                onChange={handleInputChange}
                className={`form-control ${errors.costCode ? 'is-invalid' : ''}`}
              >
 <option  type="text" value="" disabled selected>Select a Cost Code</option>
        {costcodes &&
                costcodes.map((c, index) => (
                <option
                    value={c.costCode}
                    onChange={handleInputChange}
                    key={index}
                >
                {/* unit data */}
                {c.costCode}
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
                
           list="suggest"
                name="description"
                {...register('description')}
                value={budget.description}
                onChange={handleInputChange}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              />
                <datalist id="suggest">
                                            <option value="Concrete Subcontractor,Concrete Reinforcement...">Concrete Subcontractor,Concrete Reinforcement...</option>
                                            
                                    </datalist>
               <div className="invalid-feedback">{errors.description?.message}</div>
            </div>

   
            <div className="form-group">
              <label htmlFor="date">Date :</label>
              <input
                type="date"
                
                id="date"
                
                // onLoad={budget.date}
                name="date"
                {...register('date')}
                value={budget.date}
                onChange={handleInputChange}
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              />
               <div className="invalid-feedback">{errors.date?.message}</div>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount :</label>
              <input
                type="text"
               
                id="estimatedBudget"
             
              
                name="estimatedBudget"
                {...register('estimatedBudget')}
                value={budget.estimatedBudget}
                onChange={handleInputChange}
                className={`form-control ${errors.estimatedBudget ? 'is-invalid' : ''}`}
              />
               <div className="invalid-feedback">{errors.estimatedBudget?.message}</div>
            </div>
            <div className="form-group">
            <button type="submit" onClick={saveBudget} className="btn btn-success">
              Save
            </button>
            &nbsp;&nbsp;
            {/* <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button>&nbsp;&nbsp;reset not working properly. values doesn't reset, only the error msgs */}
          {/*  <Link to={"/budgetestimates/" + budget.projectId}>
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
                <TimelineContent><h5><strong>Step 1</strong><br/>Create a Budget Line Item</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Budget Line Item will be automatically added to the Estimated Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>View the Estimated Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 4</strong><br/>Edit/Delete a Budget Line Item.</h6></TimelineContent>
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

export default AddBudget ;

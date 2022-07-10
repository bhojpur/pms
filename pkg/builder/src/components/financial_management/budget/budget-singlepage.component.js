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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import BudgetDataService from "./../../../services/budget.service";
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import { Route, useParams } from "react-router-dom";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Link } from "react-router-dom";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';
import { Event } from "jquery";

const Budget = props => {

  //const {projectId}= useParams();
  const initialBudgetState = {
    id: null,
    costCode: "",
    description: "",
    date: "",
    estimatedBudget: "",
    projectId:""
  };
  const [currentBudget, setCurrentBudget] = useState(initialBudgetState);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");


  const getBudget = id => {
    BudgetDataService.get(id)
      .then(response => {
        setCurrentBudget(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getBudget(props.match.params.id);
  },[props.match.params.id]);

    /**validation*/
  const validationSchema = Yup.object().shape({
    costCode: Yup.string().required('Cost Code is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.string().required('Date is required'),
    estimatedBudget:  Yup.number()
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
    console.log("jfj"+JSON.stringify(data, null, 2));
  };
/*End of validation */



  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentBudget({ ...currentBudget, [name]: value });
  };


  const updateBudget = () => {

    var data = {
      id: currentBudget.id,
      costCode: currentBudget.costCode,
      description: currentBudget.description,
      date: currentBudget.date,
      estimatedBudget: currentBudget.estimatedBudget,
    };
    if(currentBudget.description !== ""){
    BudgetDataService.update(currentBudget.id, data)
      .then(response => {
        setSubmitted(true);
        console.log(response.data);
        props.history.push("/budgetestimates/"+currentBudget.projectId);
        cogoToast.success("Budget Estimate Updated Successfully!");
        
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const updatePublished = (status) => {

    var data = {
      id: currentBudget.id,
      costCode: currentBudget.costCode,
      description: currentBudget.description,
      date: currentBudget.date,
      estimatedBudget: currentBudget.estimatedBudget,
      published:status
    };
    BudgetDataService.update(currentBudget.id, data)
      .then(response => {
        props.history.push("/budgetestimates/"+currentBudget.projectId);
        cogoToast.success("Budget Estimate Deleted Successfully!");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
   

    
  };

  const viewBudget = () => {
    props.history.push("/budgetestimates/"+ currentBudget.projectId);
    cogoToast.success("Budget Estimate Updated Successfully!");
   }

  const deleteBudget = () => {
    BudgetDataService.remove(currentBudget.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/budget/"+currentBudget.projectId);//check this again
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container">

 
        <div class="container">
          <h2>Edit Budget Estimate</h2>
          <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+currentBudget.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/budgetestimates/"+currentBudget.projectId} aria-current="page">
               Budget Estimates
              </Link>
              <Link color="textPrimary" to={"/viewbudget/"+currentBudget.id} aria-current="page">
               Edit Budget Estimate
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
                <input
               type="text"
                id="costCode"
                name="costCode"
                disabled
                value={currentBudget.costCode}
                readonly
                //onChange={handleInputChange}
                className={`form-control`}
               
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Description :</label>
              <input
                type="text"
               className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                {...register('description')}
                value={currentBudget.description}
                onChange={handleInputChange}
               
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description"> Date :</label>
              <input
                type="date"
               
                id="date"
                name="date"
                {...register('date')}
                value={currentBudget.date}
                onChange={handleInputChange}
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.date?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Estimated Budget Amount :</label>
              <input
                type="text"
               
                id="estimatedBudget"
                name="estimatedBudget"
                {...register('estimatedBudget')}
                value={currentBudget.estimatedBudget}
                onChange={handleInputChange}
                className={`form-control ${errors.estimatedBudget ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.estimatedBudget?.message}</div>
            </div>
            <div className="form-group">

            <button className="btn btn-danger" onClick={() =>{updatePublished(false);reset()}}>
            Delete <DeleteIcon/> 
          </button>

          <button
            type="submit"
            className="btn btn-success m-2"
            onClick={() =>{updateBudget();reset()}}
          >
            Update <UpdateIcon/>
          </button>
         {/* <Link to={"/budgetestimates/" + currentBudget.projectId}>
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
                <TimelineContent><h6><strong>Step 1</strong><br/>Create a Budget Line Item</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Estimated Budget Amount will be automatically updated in the Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>View the Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 4</strong><br/>Edit/Delete a Budget Line Item.</h5></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
          
          
          </div>
     
         
        </div>
        
       
   
    </div>
  );
};

export default Budget;
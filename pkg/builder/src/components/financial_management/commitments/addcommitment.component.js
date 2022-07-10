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

import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
//import { Route, useParams } from "react-router-dom";
import CommitmentDataService from "./../../../services/commitment.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';
import SubDataService from "./../../../services/subcontractor.service";

const AddCommitment = (props) => {

  /**validation */
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    contractCompany: Yup.string().required('Contract Company is required'),
    description: Yup.string().required('Description is required'),
    signedContractReceivedDate: Yup.date()
    .typeError('Select a valid Date')
    .required('Signed Contract Received Date is required'),
    startDate: Yup.date()
    .required('Start Date is required')
    .typeError('Select a valid Date')
    .min(
      Yup.ref('signedContractReceivedDate'),
      "Start Date can't be before Signed Contract Received Date"
    ),
    estimatedCompletionDate: Yup.date()
    .required('Estimated Completion Date is required')
    .typeError('Select a valid Date') 
    .min(
      Yup.ref('startDate'),
      "Estimated Completion Date can't be before Start Date or Signed Contract Received Date"
    ),
    
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    validateCriteriaMode: "all",
    // mode: "onChange"
  });

  const onSubmit = data => {
    console.log(JSON.stringify(data, null, 2));
  };
/**End of validation */

  //const {pid}= useParams();

  const initialCommitmentState = {
    id: null,
    title :"",
    contractCompany :"",
    status :"Ongoing 🔴",
    description :"",
    startDate :"",
    estimatedCompletionDate :"",
actualCompletionDate :"",
signedContractReceivedDate :"",
    inclusions: "",
exclusions:"",
    projectId:props.match.params.id,
    
    commitmentStatuses: ["Ongoing 🔴","Completed 🟢"],
    lastcommitment:[],
  };
  const [commitment, setCommitment] = useState(initialCommitmentState);
  const [subcontractors, setSubcontractors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [lastcommitment,setlastcommitment]= useState(initialCommitmentState);

  const [count, setCount] = useState(0);

  const handleClickAsync=()=> {
    setTimeout(function delay() {
      setCount(count + 1);
    }, 5000);
  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setCommitment({ ...commitment, [name]: value });
  };

  const getLastCommitmentID=()=>{
    
    CommitmentDataService.findlastCommitment(initialCommitmentState.projectId)
      .then(response => {
 
            setlastcommitment(response.data)

        })
        .catch(e => {
          console.log(e);
        });
  };

  useEffect(() => {
    retrieveSubcontractors();  
  }, []);

  const retrieveSubcontractors=()=>{
    
    SubDataService.getAll()//passing project id as id
      .then((response) => {

          setSubcontractors(response.data);

      })
      .catch((e) => {
        console.log(e);
      });
  };


  const saveCommitment = () => {
    var data = {
title: commitment.title,
contractCompany:commitment.contractCompany,
status: commitment.status,
description:commitment.description,
startDate:commitment.startDate,
estimatedCompletionDate: commitment.estimatedCompletionDate,
actualCompletionDate:commitment.actualCompletionDate,
signedContractReceivedDate:commitment.signedContractReceivedDate,

      projectId: commitment.projectId,
    };

 /* should uncomment this after the subcontractors table
 retrieveSubcontractors(id){
    SubcontractorsService.getAll(id)
    .then(response => {
        this.setState({
          suncontractors: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  */   
  if(commitment.signedContractReceivedDate <= commitment.estimatedCompletionDate && commitment.signedContractReceivedDate <= commitment.startDate && commitment.startDate <= commitment.estimatedCompletionDate ){
    CommitmentDataService.create(data)
      .then(response => {
        setCommitment({
          id: response.data.id,
title:response.data.title,
contractCompany:response.data.contractCompany,
status:response.data.status,
description:response.data.description,
startDate:response.data.startDate,
estimatedCompletionDate: response.data.estimatedCompletionDate,
actualCompletionDate:response.data.actualCompletionDate,
signedContractReceivedDate:response.data.signedContractReceivedDate,

          projectId: response.data.projectId,
     
        });
        setSubmitted(true);
        console.log(response.data);
        // props.history.push("/editcommitment/"+ commitment.id);
        // cogoToast.success("Commitment Details Saved Successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  const newCommitment = () => {
    setCommitment(initialCommitmentState);
    setSubmitted(false);
  };

  const viewCommitment = () => {
    props.history.push("/editcommitment/"+ commitment.id);
    cogoToast.success("Commitment Details Saved Successfully!");
   }

 
  return (
        <div className="container">
       
       {submitted ? (       
            viewCommitment()       
        ) : (

          <div class="container">
            <h2>New Subcontract</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+commitment.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/commitment/"+commitment.projectId} aria-current="page">
              Commitments
              </Link>
              <Link color="textPrimary" to={"/addcommitment/"+commitment.projectId} aria-current="page">
               New Sub Contract
              </Link>
            </Breadcrumbs>
                <hr />

            <div className="row">
       <div className="col-sm-6">
       <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="title">Title :</label>
    
              <input
                type="text"
            list="suggest"
                id="title"
               {...register('title')}
                value={commitment.title}
                onChange={handleInputChange}
                name="title"
className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              />
                          <datalist id="suggest">
                                            <option value="Concrete Reinforcement, Cast-In-Place Concrete, Slab Foundations">Concrete Reinforcement, Cast-In-Place Concrete, Slab Foundations</option>
                                            
                                    </datalist>
<div className="invalid-feedback">{errors.title?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="contractCompany">Contract Company :</label>
             
                <select
       
                id="contractCompany"
               {...register('contractCompany')}
                value={commitment.contractCompany}
                onChange={handleInputChange}
                name="contractCompany"
className={`form-control ${errors.contractCompany ? 'is-invalid' : ''}`}
              >
                 <option value="" disabled selected>Select the Subcontractor</option>
              {subcontractors &&
               subcontractors.map((subcontractor, index) => (
                <option
                    value={subcontractor.companyName}
                    onChange={handleInputChange}
                    key={index}
                >
                {/* unit data */}
                {subcontractor.companyName}
                </option>
                ))}
              </select>
<div className="invalid-feedback">{errors.contractCompany?.message}</div>
              </div>
             { /* this should uncomment after the subcontractors table 
               {subcontractors &&
                subcontractors.map((subcontractor, index) => (
                <option
                    value={subcontractor.id}
                    onChange={this.onChangeType}
                    key={index}
                >
             
                {subcontractor.name}
                </option>
                ))}
             
             
             */}
            
            <div className="form-group">
                <label htmlFor="status">Status :</label>
            
                <input
                type="text"
                id="status"
                value="Ongoing 🔴"
                disabled
                onChange={handleInputChange}
                name="status"
className={`form-control`}
              />
                

               {/* <option selected>Ongoing 🔴</option>
                <option>Completed 🟢</option> 
<option value="" selected disabled>Select the Status</option>
         { commitment.commitmentStatuses &&
                commitment.commitmentStatuses.map((commitmentStatus, index) => (
                <option
                    value={commitmentStatus}
                    onChange={handleInputChange }
                    key={index}
                    selected
                >
                {commitmentStatus}
                </option> 
                ))} 
              </select>*/}

              </div>
           
           {/*<div className="form-group">
                <label htmlFor="executed">Executed</label>
         
              <input
                type="checkbox"
                className="form-control"
                id="executed"
                required
                value={this.state.executed}
                onChange={this.onChangeExecuted}
                name="executed"
              />

        </div>
         
              <div className="form-group">
                <label htmlFor="defaultRetainage">Default Retainage % :</label>
                <input
                type="text"
                className="form-control"
                id="defaultRetainage"
                required
                value={this.state.defaultRetainage}
                onChange={this.onChangeDefaultRetainage}
                name="defaultRetainage"
              />
              </div> */}
              <div className="form-group">
                <label htmlFor="description">Description :</label>
 
              <input
                type="textarea"
            
                id="description"
                {...register('description')}
                value={commitment.description}
                onChange={handleInputChange}
                name="description"
className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.description?.message}</div>
              </div> 
          {/* <div className="form-group">
                <label htmlFor="attachments">Attachments</label>
            
              <input
                type="file"
                className="form-control"
                id="attachments"
                required
                value={this.state.attachments}
                onChange={this.onChangeAttachments}
                name="attachments"
              />
              </div>*/}

<div className="form-group">
                <label htmlFor="signedContractReceivedDate">Signed Contract Received Date :</label>
 
              <input
                type="date"
              
                id="signedContractReceivedDate"
                 {...register('signedContractReceivedDate')}
                value={commitment.signedContractReceivedDate}
                onChange={handleInputChange}
                name="signedContractReceivedDate"
className={`form-control ${errors.signedContractReceivedDate ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.signedContractReceivedDate?.message}</div>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date :</label>
            
              <input
                type="date"
           
                id="startDate"
              {...register('startDate')}
                value={commitment.startDate}
                onChange={handleInputChange}
                name="startDate"
className={`form-control ${errors.startDate? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.startDate?.message}</div>
              </div> 
              <div className="form-group">
                <label htmlFor="estimatedCompletionDate">Estimated Completion Date :</label>

              <input
                type="date"
            
                id="estimatedCompletionDate"
                {...register('estimatedCompletionDate')}
                value={commitment.estimatedCompletionDate}
                onChange={handleInputChange}
                name="estimatedCompletionDate"
className={`form-control ${errors.estimatedCompletionDate ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.estimatedCompletionDate?.message}</div>
              </div>
             
             {/* <div className="form-group">
                <label htmlFor="actualCompletionDate">Actual Completion Date :</label>
 
              <input
                type="date"
            
                id="actualCompletionDate"
                value={commitment.actualCompletionDate}
                onChange={handleInputChange}
                name="actualCompletionDate"
className={`form-control`}
              />

            </div>*/}
            <div className="form-group">
            <button type="submit" onClick={()=>{saveCommitment();setTimeout(getLastCommitmentID({position:1}), 3000);}} className="btn btn-success">
              Save
            </button>
            &nbsp;&nbsp;
            {/* <button
            type="button"
            onClick={() => reset()}
            className="btn btn-warning float-right"
          >
            Reset
          </button>  */}
          &nbsp;&nbsp;{/*reset not working properly. values doesn't reset, only the error msgs*/}
            {/* <Link to={"/commitment/" + commitment.projectId}>
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
                <TimelineContent><h5><strong>Step 1</strong><br/>Create a Subcontract</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Add SoVs</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>Values will be automatically added to the Budget</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 4</strong><br/>Edit/Delete a Subcontract.</h6></TimelineContent>
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

export default AddCommitment;
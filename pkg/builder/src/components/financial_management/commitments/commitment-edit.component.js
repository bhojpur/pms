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
import { Link } from "react-router-dom";
import CommitmentDataService from "./../../../services/commitment.service";
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import { Route, useParams } from "react-router-dom";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { Breadcrumbs } from "@material-ui/core";
import SubDataService from "./../../../services/subcontractor.service";
import CheckIcon from '@material-ui/icons/Check';
import cogoToast from 'cogo-toast';

const EditCommitment = props => {
  //const {projectId}= useParams();
  const initialCommitmentState = {
    id: null,
    title :"",
    contractCompany :"",
    status :"",
    description :"",
    startDate :"",
    estimatedCompletionDate :"",
actualCompletionDate :"",
signedContractReceivedDate :"",
    inclusions: "",
exclusions:"",
    projectId:props.match.params.id,  
    commitmentStatuses: ["Ongoing 🔴", "Completed 🟢"],
    
  };
  const [currentCommitment, setCurrentCommitment] = useState(initialCommitmentState);
  const [subcontractors, setSubcontractors] = useState([]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [today,setToday] = useState("");
  const [todayNull,setTodayNull] = useState("Not set yet");

  const getDateTime = () => {
    let tempDate = new Date();
    let t = (tempDate.getMonth()+1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear(); 
    const currDate = t;
    console.log(currDate)
   setToday(currDate);
  }

  const updateDate=()=> {
   
   
    var data = {

      actualCompletionDate :today,

    };

    CommitmentDataService.update(currentCommitment.id,data)
      .then(response => {
   
        //props.history.push("/editcommitment/"+ currentCommitment.id);
 setCurrentCommitment({ ...currentCommitment,actualCompletionDate: today });
//  window.location.reload(true);
//  cogoToast.success("Subcontract Actual Completion Date set to "+ today);
        })
      .catch(e => {
        console.log(e);
      });
  };

  const removeDate=()=> {

    var data = {

      actualCompletionDate :todayNull,

    };

    CommitmentDataService.update(currentCommitment.id,data)
      .then(response => {

 setCurrentCommitment({ ...currentCommitment,actualCompletionDate:todayNull});
//  window.location.reload(true);
 //props.history.push("/editcommitment/"+ currentCommitment.id);
 console.log(todayNull)
 console.log(response)
// props.history.push("/editcommitment/"+ currentCommitment.id);
// cogoToast.success("Subcontract Actual Completion Date removed");
        })
      .catch(e => {
        console.log(e);
      });
  };


  const getCommitment = id => {
    CommitmentDataService.get(id)
      .then(response => {
        setCurrentCommitment(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCommitment(props.match.params.id);
    retrieveSubcontractors();  
    getDateTime();
  },[props.match.params.id]);

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

  const retrieveSubcontractors=()=>{
    
    SubDataService.getAll()//passing project id as id
      .then((response) => {

          setSubcontractors(response.data);

      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCommitment({ ...currentCommitment, [name]: value });
  };



  const updateCommitment = () => {

    var data = {
      id: currentCommitment.id,
      title: currentCommitment.title,
      contractCompany: currentCommitment.contractCompany,
      status:currentCommitment.status,
      description: currentCommitment.description,
      startDate:currentCommitment.startDate,
      estimatedCompletiondate:currentCommitment.estimatedCompletiondate,
      actualCompletionDate:currentCommitment.actualCompletionDate,
      signedContractReceivedDate:currentCommitment.signedContractReceivedDate,
      published:currentCommitment.published


    };
    if(currentCommitment.signedContractReceivedDate <= currentCommitment.estimatedCompletionDate && currentCommitment.signedContractReceivedDate <= currentCommitment.startDate && currentCommitment.startDate <= currentCommitment.estimatedCompletionDate && currentCommitment.title !== "" && currentCommitment.description !== "" ){
    CommitmentDataService.update(currentCommitment.id, data)
      .then(response => {
          props.history.push("/editcommitment/"+ currentCommitment.id);
    cogoToast.success("Subcontract Updated Successfully!");
        console.log(response.data);
     
      })
      .catch(e => {
        console.log(e);
      });
    }
  };


  const viewC = () => {
    props.history.push("/editcommitment/"+ currentCommitment.id);
    cogoToast.success("Subcontract Updated Successfully!");
   }

   const updatePublished = (status) => {

    var data = {
      id: currentCommitment.id,
      title: currentCommitment.title,
      contractCompany: currentCommitment.contractCompany,
      status:currentCommitment.status,
      description: currentCommitment.description,
      startDate:currentCommitment.startDate,
      estimatedCompletiondate:currentCommitment.estimatedCompletiondate,
      actualCompletionDate:currentCommitment.actualCompletionDate,
      signedContractReceivedDate:currentCommitment.signedContractReceivedDate,
      published:status
    };
    CommitmentDataService.update(currentCommitment.id, data)
      .then(response => {
        props.history.push("/commitment/"+currentCommitment.projectId);
        cogoToast.success("Commitment Deleted Successfully!");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
   

    
  };
  const day = new Date();

  const progressInDays = (start,end) => {
    let date1 = new Date(start);
    let date2 = new Date(end);
    let diffTime = Math.abs(date2 - date1);
    let diffTime2 = Math.abs(date2 - day);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    let remainDays = Math.ceil(diffTime2/(1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    console.log(remainDays + " remain days");

    return remainDays;
  }

  const updateStatus=(status)=> {
    var data = {

    status :status,

    };

    CommitmentDataService.update(currentCommitment.id,data)
      .then(response => {
 setCurrentCommitment({ ...currentCommitment,status: status });
//  props.history.push("/editcommitment/"+ currentCommitment.id);
cogoToast.success("Subcontract set to "+ status);
 window.location.reload(true);
 
        })
      .catch(e => {
        console.log(e);
      });
  };


  //delete is working but when deleting, validation errors occur
  const deleteCommitment = () => {
    CommitmentDataService.delete(currentCommitment.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/commitment/"+currentCommitment.projectId);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container">
        { /* {submitted ? (
         viewC()
 
         ) : (*/}
        <div class="container">
          <h4>Edit Subcontract</h4>
          <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+currentCommitment.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/commitment/"+currentCommitment.projectId}>
               Commitments
              </Link>
              <Link color="textPrimary" to={"/editcommitment/"+currentCommitment.id} aria-current="page">
              #{currentCommitment.id} - {currentCommitment.title}
              </Link>
            </Breadcrumbs>
<hr />

{/* 
                    <div class="col-6 text-right">    */}
                    {/* <div className="row">   */}
                    {/* <div className="col-md-4  mb-grid-gutter pb-2 text-right" > */}
                    {/* <div className="row">
                    <div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0"> {progressInDays(currentCommitment.startDate,currentCommitment.estimatedCompletionDate)}&nbsp;Days Remaining.</h3>
<br />
</div></div>
<div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0"> {progressInDays(currentCommitment.startDate,currentCommitment.estimatedCompletionDate)}&nbsp;Days Remaining.</h3>
<br />
</div></div>
<div className="col-lg-4 col-sm-6 mb-grid-gutter pb-2" >
<div className="card card-hover shadow-sm" style={{alignItems: "center"}} ><br />
  <h3 className="h6 nav-heading-title mb-0"> {progressInDays(currentCommitment.startDate,currentCommitment.estimatedCompletionDate)}&nbsp;Days Remaining.</h3>
<br />
</div></div></div> */}

{/* </div> */}
{/* </div>
<div className="col-md-12 text-right"> */}
 <ul class="nav nav-tabs">   
{/* <div className="row"> */}
                    <div className="col-md-12 text-right">
            {currentCommitment.status == "Ongoing 🔴" ? (
                <button
                className="btn btn-complete m-2"
                  onClick={() => {updateDate();updateStatus("Completed 🟢");}}
                >
                 <CheckIcon />&nbsp; Mark as Completed
                </button>
             ) : 
              (
                <button
                className="btn btn-ongoing m-2"
                  onClick={() => {removeDate();updateStatus("Ongoing 🔴");}}
                >
                Mark as Ongoing
                </button>
              )}
        
              {/* </div> */}
              </div>
              {/* </div> */}
                 
            <li class="nav-item">
                       <Link class="nav-link active" aria-current="page"to={"#"}>Sub Contract Details</Link>
            </li>
            <li class="nav-item">
             <Link to={"/viewsov/" +currentCommitment.projectId+"/"+currentCommitment.id}  class="nav-link">SoVs</Link>
            </li>

          </ul>

                    {/*<Link to={"/viewpayment/"+currentCommitment.id}>
                    <button className="btn btn-success m-2">Payments </button>
                    </Link><br />
                    <Link to={"/addinvoice/"+currentCommitment.id}>
                    <button className="btn btn-success m-2">Invoices </button>
                    </Link>*/}

          <div className="row">
       <div className="col-sm-6">
       <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
         
                  id="title"
 {...register('title')}
                  value={currentCommitment.title}
                  onChange={handleInputChange}
  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                />
<div className="invalid-feedback">{errors.title?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="contractCompany">Contract Company :</label>
             
                <select
                id="contractCompany"
                 {...register('contractCompany')}
                value={currentCommitment.contractCompany}
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
              <div className="form-group">
                <label htmlFor="status">Status :</label>
            
              <input
            type="text"
                id="status"
                value={currentCommitment.status}
                name="status"
                className={`form-control`}
                readOnly
              />
               {/* {currentCommitment &&
                currentCommitment.map((c, index) => (
                <option
                    value={c.status}
                    onChange={handleInputChange}
                    key={index}
                >

                {c.status}
                </option>
                ))} 
              </select>*/}

              </div>
              {/*<div className="form-group">
                <label htmlFor="defaultRetainage">Default Retainage % :</label>
                <input
                type="text"
                className="form-control"
                id="defaultRetainage"
                required
                value={currentCommitment.defaultRetainage}
                onChange={this.onChangeDefaultRetainage}
                name="defaultRetainage"
              />
        </div>*/}
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
           
                  id="description"
 {...register('description')}
                  value={currentCommitment.description}
                  onChange={handleInputChange}
  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                />
<div className="invalid-feedback">{errors.description?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="signedContractReceivedDate">Signed Contract Received Date :</label>
 
              <input
                type="date"
   
                id="signedContractReceivedDate"
                      {...register('signedContractReceivedDate')}
                value={currentCommitment.signedContractReceivedDate}
                onChange={handleInputChange}
                name="signedContractReceivedDate"
 className={`form-control ${errors.signedContractReceivedDate? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.signedContractReceivedDate?.message}</div>
              </div>
              <div className="form-group">
                <label htmlFor="startDate">Start Date :</label>
            
              <input
                type="date"
              
                id="startDate"
                {...register('startDate')}
                value={currentCommitment.startDate}
                onChange={handleInputChange}
                name="startDate"
  className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.startDate?.message}</div>
              </div> 
              <div className="form-group">
                <label htmlFor="estimatedCompletionDate">Estimated Completion Date :</label>

              <input
                type="date"
         
                id="estimatedCompletionDate"
                {...register('estimatedCompletionDate')}
                value={currentCommitment.estimatedCompletionDate}
                onChange={handleInputChange}
                name="estimatedCompletionDate"
  className={`form-control ${errors.estimatedCompletionDate ? 'is-invalid' : ''}`}
              />
<div className="invalid-feedback">{errors.estimatedCompletionDate?.message}</div>
              </div>
             
            <div className="form-group">
                <label htmlFor="actualCompletionDate">Actual Completion Date :</label>
 
              <input
                type="text"
      
                id="actualCompletionDate"
                  //  {...register('actualCompletionDate')}
                value={currentCommitment.actualCompletionDate}
                onChange={handleInputChange}
                name="actualCompletionDate"
                readOnly
  className={`form-control`}
              />
{/* <div className="invalid-feedback">{errors.actualCompletionDate?.message}</div> */}
              </div>


            <div className="form-group">

            <button className="btn btn-danger" onClick={() =>{updatePublished(false);reset()}}>
            Delete <DeleteIcon/> 
          </button>

          <button
            type="submit"
            className="btn btn-success m-2"
            onClick={()=>{updateCommitment();reset();}}
          >
            Update <UpdateIcon/>
          </button>
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
                <TimelineContent><h6><strong>Step 1</strong><br/>Create a Subcontract</h6> </TimelineContent>
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
                <TimelineContent><h5><strong>Step 4</strong><br/>Edit/Delete a Subcontract.</h5></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
          
          
          </div>
          


     
       
        </div>
      {/* )} */}
    </div>
  );
};

export default  EditCommitment;
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
import SovDataService from "./../../../services/sov.service";
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
import CommitmentDataService from "./../../../services/commitment.service";
import cogoToast from 'cogo-toast';
import BudgetDataService from "./../../../services/budget.service";

const Sov = props => {

  /**validation */
  const validationSchema = Yup.object().shape({
    costCode: Yup.string().required('Cost Code is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.string().required('Date is required'),
    amount: Yup.number()
    .typeError('You must specify a valid number')
    .required('Amount is required'),
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
  const initialSovState = {
    id: null,
    costCode: "",
    description: "",
    date: "",
    amount: "",
    commitmentId:""
  };
  const [currentSov, setCurrentSov] = useState(initialSovState);
  const [message, setMessage] = useState("");
  const [budgets, setBudgets] = useState([]);

  const {id}= useParams();
const {pid}= useParams();
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

  const getSov = id => {
    SovDataService.get(id)
      .then(response => {
        setCurrentSov(response.data);
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


  useEffect(() => {
    getSov(props.match.params.id);
    getCommitment(id);
    retrieveBudgets();
  },[props.match.params.id]);

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

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentSov({ ...currentSov, [name]: value });
  };



  const updateSov= () => {
    if(currentSov.description !== ""){
    SovDataService.update(currentSov.id, currentSov)
      .then(response => {
        console.log(response.data);
        //setMessage("SoV Updated successfully!");
        props.history.push("/viewsov/"+currentSov.projectId+"/"+currentSov.commitmentId);
        cogoToast.success("SoV updated Successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  const updatePublished = (status) => {

    var data = {
      id: currentSov.id,
      costCode: currentSov.costCode,
      description: currentSov.description,
      date: currentSov.date,
     amount:currentSov.amount,
      published:status
    };
    SovDataService.update(currentSov.id, data)
      .then(response => {
        props.history.push("/viewsov/"+currentSov.projectId+"/"+currentSov.commitmentId);
        cogoToast.success("SoV Deleted Successfully!");
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
   

    
  };


  const deleteSov = () => {
    SovDataService.remove(currentSov.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/sov/"+currentSov.commitmentId);//check this again
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container">
      {currentSov ? (
        <div class="container">
          <h4>#{currentSov.id}&nbsp;Schedule of Value</h4>
          <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+currentSov.projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/commitment/"+currentSov.projectId} aria-current="page">
               Commitments
              </Link>
              <Link color="textPrimary" to={"/editcommitment/"+currentSov.commitmentId} aria-current="page">
              #{id} - {currentCommitment.title}
              </Link>
              <Link color="textPrimary" to={"/viewsov/"+currentSov.projectId+"/"+currentSov.commitmentId} aria-current="page">
               Schedule of Values
              </Link>
              <Link color="textPrimary" to={"/viewsinglesov/"+currentSov.id} aria-current="page">
               #{currentSov.id} - {currentSov.costCode}
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
                value={currentSov.costCode}
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
                value={currentSov.description}
                onChange={handleInputChange}
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.description?.message}</div>
            </div>
    
            <div className="form-group">
              <label htmlFor="description">Date :</label>
              <input
                type="date"
               
                id="date"
                name="date"
                {...register('date')}
                value={currentSov.date}
                onChange={handleInputChange}
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              />
              <div className="invalid-feedback">{errors.date?.message}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Amount :</label>
              <input
                type="text"
               
                id="amount"
                name="ammount"
                {...register('amount')}
                value={currentSov.amount}
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
            onClick={()=>{updateSov();reset()}}
          >
            Update <UpdateIcon/>
          </button>
          {/* <Link to={"/viewsov/" +currentSov.projectId+"/"+ currentSov.commitmentId}>
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
                <TimelineContent><h6><strong>Step 1</strong><br/>Create a SoV</h6> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>SoV will be automatically added to the Budget.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>View the SoVs.</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 4</strong><br/>Edit/Delete a SoV.</h5></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>
            
          
          
          </div>
          


     
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};

export default Sov;
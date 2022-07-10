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
import ExcelService from "../../../services/excelupload.service";
import BudgetDataService from "../../../services/budget.service";
import { Link } from "react-router-dom";
import { Route, useParams } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';

// excel file upload
const BExcelUploadFiles = (props) => {
  const {id}= useParams();
  
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [budgets, setBudgets] = useState([]);
  
    const [fileInfos, setFileInfos] = useState([]);
    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
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

    const upload = () => {
        let currentFile = selectedFiles[0];
    
        setProgress(0);
        setCurrentFile(currentFile);
    
        ExcelService.bupload(currentFile, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then((response) => {
            setMessage(response.data.message);
            return ExcelService.getBFiles();
          })
          .then((files) => {
            setFileInfos(files.data);
          })
          .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
          });
    
        setSelectedFiles(undefined);
    };
    useEffect(() => {
        ExcelService.getBFiles().then((response) => {
          setFileInfos(response.data);
        });
        retrieveBudgets();  

    }, []);
    return (
        <div>
     
          {/*<div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">Import Direct Costs</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {retrieveDirectCosts();setTimeout(this.setState.bind(this, {position:1}), 3000); }} >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
    <div className="modal-body">*/}
      <div>
      <div  className="row"> <Link to={"/financialmanagementhome/" + id}><HomeIcon style={{ color: "#2b2d42"}}/></Link>&nbsp;<h4>Import Estimated Budget</h4>  </div>
        <hr />
          {currentFile && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + "%" }}
              >
                {progress}%
              </div>
            </div>
          )}
    
          <label className="btn btn-default">
            <input type="file" onChange={selectFile} />
          </label>
    
          <button
            className="btn btn-success"
            disabled={!selectedFiles}
            onClick={upload}
          >
            Upload
          </button><hr /><br />
          <Link  to={"/budgetestimates/"+id} className="btn btn-primary">View Estimated Budget</Link>
    
          <div className="alert alert-light" role="alert">
            {message}
          </div>

         </div>
              { /* <div className="modal-footer">
   
          <Link  to={"/directcost/"+id} className="btn btn-success">View Direct Costs</Link>
         
                </div>
              </div>
            </div>
    
          </div>*/}
        </div>
    );
  };

export default BExcelUploadFiles;
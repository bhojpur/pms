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
import ExcelService from "./../../../services/excelupload.service";
import DirectCostDataService from "./../../../services/directcost.service";
import { Link } from "react-router-dom";
import { Route, useParams } from "react-router-dom";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import cogoToast from 'cogo-toast';

// excel file upload
const ExcelUploadFiles = (props) => {
  const {id}= useParams();
  
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [directcosts, setDirectCosts] = useState([]);
   
    const [fileInfos, setFileInfos] = useState([]);
    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };

    const retrieveDirectCosts = () => {
    
      DirectCostDataService.getAll(id)//passing project id as id
        .then((response) => {
          setDirectCosts(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const upload = () => {
        let currentFile = selectedFiles[0];
    
        setProgress(0);
        setCurrentFile(currentFile);
    
        ExcelService.upload(currentFile, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then((response) => {
            // setMessage(response.data.message);
          
            return ExcelService.getFiles();
          })
          .then((files) => {
            setFileInfos(files.data);
            // props.history.push("/directcost/"+ id);
            cogoToast.success("ExcelFile uploaded successfully!");
          })
          .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
          });
    
        setSelectedFiles(undefined);
    };
    useEffect(() => {
        ExcelService.getFiles().then((response) => {
          setFileInfos(response.data);
        });
        retrieveDirectCosts();  

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
        <h4>Import Direct Costs</h4> 
        <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+id}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/directcost/"+id} aria-current="page">
              Direct Costs
              </Link>
              <Link color="textPrimary" to={"/excelupload/"+id} aria-current="page">
               Import Direct Costs
              </Link>
            </Breadcrumbs> 
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
          </button><br />
          {/* <Link  to={"/directcost/"+id} className="btn btn-success">View Direct Costs</Link> */}
    
          {/* <div className="alert alert-light" role="alert">
            {message}
          </div> */}

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

export default ExcelUploadFiles;
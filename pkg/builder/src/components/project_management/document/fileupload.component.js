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
import UploadService from "./../../../services/document.service";
// Import the main component
import { Viewer } from '@react-pdf-viewer/core';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
// Worker
import { Worker } from '@react-pdf-viewer/core';
// Readers
import { MobilePDFReader } from 'reactjs-pdf-reader';
import { PDFReader } from 'reactjs-pdf-reader';

const UploadFiles = () => {
  
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [name, setName] = useState("demo");
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
    }
  
    const [fileInfos, setFileInfos] = useState([]);
    const selectFile = (event) => {
        setSelectedFiles(event.target.files);
    };
    const upload = () => {
        let currentFile = selectedFiles[0];
    
        setProgress(0);
        setCurrentFile(currentFile);
    
        UploadService.upload(currentFile, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then((response) => {
            setMessage(response.data.message);
            return UploadService.getFiles();
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
        UploadService.getFiles().then((response) => {
          setFileInfos(response.data);
          
          console.log(response.data);
        });
    }, []);
    //viewer
    // Create new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
      
    // for onchange event
    const [pdfFile, setPdfFile]=useState(null);
    const [pdfFileError, setPdfFileError]=useState('');

    // for submit event
    const [viewPdf, setViewPdf]=useState(null);

    // onchange event
    const fileType=['application/pdf'];
    const handlePdfFileChange=(e)=>{
      let selectedFile=e.target.files[0];
      console.log(e.target.files[0]);
      if(selectedFile){
        if(selectedFile&&fileType.includes(selectedFile.type)){
          let reader = new FileReader();
              reader.readAsDataURL(selectedFile);
              reader.onloadend = (e) =>{
                setPdfFile(e.target.result);
                setPdfFileError('');
              }
        }
        else{
          setPdfFile(null);
          setPdfFileError('Please select valid pdf file');
        }
      }
      else{
        console.log('select your file');
      }
    }

    // form submit
    const handlePdfFileSubmit=(e)=>{
      e.preventDefault();
      console.log("pdf-look");
      if(pdfFile!==null){
        setViewPdf(pdfFile);
      }
      else{
        setViewPdf(null);
      }
    }
    //end viewer
    return (
        <div>
        <br></br>
        {/*Recent List */}
        {/* <div className="card col-5">
            <div className="card-header"><h5>Recent List</h5></div>
            <ul className="list-group list-group-flush">
              {fileInfos &&
                fileInfos.map((file, index) => (
                  index < 5 ?
                  <li className="list-group-item" key={index}>
                    <a href={file.url} target="_blank">{file.name}</a>
                  </li>
                  :
                  <p></p>
                ))}
            </ul>
          </div> */}
          {/* Browser-native */}
          <hr></hr>
          <h3>View Custom Documents</h3>
          <p>View necessary documents</p>
           <br></br>
           <div className="row">
           <div className="col-4">  
              <form className='form-group' onSubmit={handlePdfFileSubmit}>
                <input type="file" className='form-control'
                  required onChange={handlePdfFileChange}
                />
                {pdfFileError&&<div className='error-msg'>{pdfFileError}</div>}
                <br></br>
                <button type="submit" className='btn btn-success btn-lg'>
                  UPLOAD
                </button>
              </form>
            </div>
            <div className="col-8">
              {/* form select */}
              <h4>View PDF</h4>
              <div className='pdf-container'style={{ 'height': '800px' }}>
                {/* show pdf conditionally (if we have one)  */}
                {viewPdf&&<><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                  <Viewer fileUrl={viewPdf}
                    plugins={[defaultLayoutPluginInstance]} />
              </Worker></>}
            
              {/* if we dont have pdf or viewPdf state is null */}
              {!viewPdf&&<>No pdf file selected</>}
              </div>
            </div>
            </div>
            </div>
    );
};

export default UploadFiles;
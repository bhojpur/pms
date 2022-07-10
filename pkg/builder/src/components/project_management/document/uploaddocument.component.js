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

import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UploadService from "./../../../services/document.service";

export default class UploadDocuments extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    
    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      title: this.props.match.params.name,

      fileInfos: [],
    };
  }
  componentDidMount() {
    UploadService.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }
  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }
  upload() {
    let currentFile = this.state.selectedFiles[0];
    let fileName = this.state.title;
    console.log(currentFile);
    console.log(fileName);
    
    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, fileName, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }

  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
      title
    } = this.state;

    return (
      <div className="container">
      <h3>Upload the Document Source</h3>
      <p>File source document : - {title}</p>
      <div>
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
          <input type="file" onChange={this.selectFile} />
        </label>

        <button className="btn btn-success"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>

        <div className="alert alert-light" role="alert">
          {message}
        </div>

        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url} target="_blank">{file.name}</a>
                </li>
              ))}
          </ul>
        </div>
      </div>
      </div>
    );
  }
}
//React Hooks
// const UploadDocment = () => {
  
//     const [selectedFiles, setSelectedFiles] = useState(undefined);
//     const title = useParams();
//     const [currentFile, setCurrentFile] = useState(undefined);
//     const [name, setName] = useState("demo");
//     const [progress, setProgress] = useState(0);
//     const [message, setMessage] = useState("");
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);

//     function onDocumentLoadSuccess({ numPages }) {
//       setNumPages(numPages);
//     }
  
//     const [fileInfos, setFileInfos] = useState([]);
//     const selectFile = (event) => {
//         setSelectedFiles(event.target.files);
//     };
//     const upload = () => {
//         let currentFile = selectedFiles[0];
    
//         setProgress(0);
//         setCurrentFile(currentFile);
//         console.log(currentFile.name);
    
//         UploadService.upload(currentFile, (event) => {
//           setProgress(Math.round((100 * event.loaded) / event.total));
//         })
//           .then((response) => {
//             setMessage(response.data.message);
//             setNewMessage(response.data.message);
//             return UploadService.getFiles();
//           })
//           .then((files) => {
//             console.log(files.data);
//             setFileInfos(files.data);
//           })
//           .catch(() => {
//             setProgress(0);
//             setMessage("Could not upload the file!");
//             setCurrentFile(undefined);
//           });
    
//         setSelectedFiles(undefined);
//     };
//     useEffect(() => {
//         UploadService.getFiles().then((response) => {
//           setFileInfos(response.data);
//         });
//     }, []);
//     return (
//         <div>
//         <h2>Add Single Document</h2>
//         {title}
//         <hr></hr>
//         <p>Add your file details to insert a new file</p>
//         <div className="row">
//         <div className="container col-sm-8">
//             <div className="form-group">
//               <label htmlFor="title">Document Name:</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="title"
//                 required
//                 // value={this.state.title}
//                 // onChange={this.onChangeTitle}
//                 // name="title"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="description">Description :</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="description"
//                 required
//                 // value={this.state.description}
//                 // onChange={this.onChangeDescription}
//                 // name="description"
//               />
//             </div>
//             {/* Upload part */}
//             <h4>Upload Status</h4>
//             {currentFile && (
//             <div className="progress">
            
//               <div
//                 className="progress-bar progress-bar-info progress-bar-striped"
//                 role="progressbar"
//                 aria-valuenow={progress}
//                 aria-valuemin="0"
//                 aria-valuemax="100"
//                 style={{ width: progress + "%" }}
//               >
//                 {progress}%
//               </div>
//             </div>
//           )}
    
//           <label className="btn btn-default">
//             <input type="file" onChange={selectFile} />
//           </label>
    
//           <button
//             className="btn btn-primary"
//             disabled={!selectedFiles}
//             onClick={upload}
//           >
//             Upload
//           </button>
    
//           <div className="alert alert-light" role="alert">
//             {message}
//           </div>
//         </div>
//         <div className="col-sm-4">
//         </div>
//         </div>
//         <button className="btn btn-success">Add Document</button>
//        </div>
//     );
// };

// export default UploadDocment;
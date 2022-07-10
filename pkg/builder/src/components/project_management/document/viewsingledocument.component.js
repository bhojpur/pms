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

import React, { Component } from "react";
import { Link } from "react-router-dom";
import DocumentDataService from "./../../../services/documentfile.service";
import DocumentRevisionService from "../../../services/documentrevision.service";
import UserService from "./../../../services/user.service";
import AuthService from "./../../../services/auth.service";
import { Avatar } from "@material-ui/core";
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from "cogo-toast";
import PdfIcon from '@material-ui/icons/PictureAsPdf';

export default  class SingleDocument extends Component {
    constructor(props) {
        super(props);
        this.retrieveDocument = this.retrieveDocument.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeComment = this.onChangeComment.bind(this);
        this.saveDocumentRevision = this.saveDocumentRevision.bind(this);
      
        this.state = {
          id: this.props.match.params.id,
          url: "http://localhost:8080/api/files/", 
          title: "",
          description: "",
          category: "",
          version: 1,
          status: "", 
          projectId: "",
          revisions: [],
          documentId: this.props.match.params.id,
  
          //revision
          currentUser: AuthService.getCurrentUser(),
          username: "",
          comment: "",
        };
      }
      componentDidMount() {
        window.scrollTo(0, 0);
        this.retrieveDocument(this.props.match.params.id);
        this.getRevisions(this.props.match.params.id);
      }
      onChangeUserName(e) {
        this.setState({
          username: e.target.value
        });
      }
    
      onChangeComment(e) {
        this.setState({
          comment: e.target.value
        });
      }
      retrieveDocument(id) {
        DocumentDataService.get(id)
          .then(response => {
            this.setState({
              id: response.data.id,
              title: response.data.title,
              description: response.data.description,
              category: response.data.category,
              status: response.data.status,
              version: response.data.version,
              projectId: response.data.projectId,
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
      getRevisions(id){
        DocumentRevisionService.getAll(id)
        .then(response => {
            this.setState({
              revisions: response.data
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
      saveDocumentRevision() {
        if(this.state.comment != ""){
        var data = {
          username : this.state.currentUser.username,
          description: this.state.comment,
          documentId: this.state.documentId
        };
        cogoToast.success("Revision added to the thread");
        DocumentRevisionService.create(data)
          .then(response => {
            this.setState({
              id: response.data.id,
              username: response.data.username,
              description: response.data.comment,
              documentId: response.data.documentId,
              // submitted: true
            });
            console.log(response.data);
            this.getRevisions(this.state.documentId);
          })
          .catch(e => {
            console.log(e);
          });
        }else{
          cogoToast.error("Message body cannot be empty");
        }
      }
      render() {
          const { id,title,description,category,version,status,url,revisions,currentUser,projectId } = this.state;
          return (
             // Main Div
              <div>
                <h2>Document Single Page</h2>
                <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">
                  Home
                </Link>
                <Link color="inherit" to={"/projectmanagementhome/"+projectId}>
                  App Dashboard
                </Link>
                <Link color="textPrimary" to={"/document/"+projectId}>
                  Document Home
                </Link>
                <Link color="textPrimary" to={"/viewsingledocument/"+id} aria-current="page">
                  View Document
                </Link>
              </Breadcrumbs>
              <hr></hr>
              <h3>View & Manage Document</h3>
              <h6>Manage as single document and add measurements and versioning</h6>
              <div className="row">
              <div className="col-sm-8">
              <embed
                    //src="https://vancouver.ca/files/cov/sample-drawing-package-1and2family.pdf"
                    src={"http://localhost:8080/api/files/"+title+".pdf"}
                    type="application/pdf"
                    frameBorder="0"
                    scrolling="auto"
                    height="700px"
                    width="100%"
                ></embed>
                <h3>Revisions</h3>
                <p>Add specific notes for the document for the future reference</p>
                <div className="row">
                  <div className="col-sm-6">
                    <ul className="list-group list-group-flush">
                          {revisions &&
                          revisions.map((revision, index) => (
                            <li className="list-group-item" key={index}>
                            
                            <Avatar>U</Avatar>
                            
                            <b>{revision.username}</b>{" : "}{revision.description}
                            <br/>
                            <p>{revision.createdAt} ✔️sent</p>
                          </li>
                          ))}
                    </ul>
                  </div>
                  <div className="col-sm-6">
                      <div className="form-group">
                      <label htmlFor="name">Username</label>
                      <input
                          type="text"
                          className="form-control"
                          id="title"
                          required
                          value={currentUser.username}
                          onChange={this.onChangeUserName}
                          name="title"
                          disabled
                      />
                      </div>
                      <div className="form-group">
                      <label htmlFor="description">Comment</label>
                      <input
                          type="textarea"
                          className="form-control"
                          id="comment"
                          required
                          value={this.state.comment}
                          onChange={this.onChangeComment}
                          name="description"
                      />
                      </div>
                      <div>
                        <button className="btn btn-primary" onClick={this.saveDocumentRevision}>Add Comment</button>
                      </div>
                  </div>
                </div>
                </div>
                <div className="col-sm-4">
                  <h3>File details</h3>
                  {/* <h6>Document Id : {id}</h6> */}
                  <h6>Name : <b>{title}</b></h6>
                  <h6>Description : <b>{description}</b></h6>
                  {/* <h6>Document Type : <b>{category}</b></h6> */}
                  <hr></hr>
                  <h4>Full Screen</h4>
                  <a href={url+title+".pdf"} target="_blank" style={{'text-decoration': 'none'}}>
                  
                  <PdfIcon style={{ fontSize: 100 }} />
                  </a>
                  {/* <div>
                      <h4>Measurements</h4>
                      <p>Main measurements : Area, Distance</p>
                      <button className="btn btn-primary">Add</button>
                  </div>
                  <div>
                      <h4>Version</h4>
                      <h5>{version}{".0"}</h5>   
                  </div>  */}
                </div>
              </div>
              </div>
          );
    }
}
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
import DrawingDataService from "./../../../services/drawing.service";
import DrawingCategoryDataService from "./../../../services/drawing-category.service";
import AuthService from "./../../../services/auth.service";
import Table from 'react-bootstrap/Table';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import UpdateIcon from '@material-ui/icons/Update';
import { Breadcrumbs } from "@material-ui/core";

export default class ViewSingleDrawingCategory extends Component {
    constructor(props) {
      super(props);
      this.retrieveCategoryDrawing = this.retrieveCategoryDrawing.bind(this);
      this.state = {
        id: this.props.match.params.pid,
        cat: this.props.match.params.cat,
        drawings: [],
        title: "",
        description: "", 
        projectId: this.props.match.params.pid,
        currentUser: AuthService.getCurrentUser(),
        showEngineerBoard: false,
        showManagerBoard: false,
        showAdminBoard: false,
      };
    }
  
    componentDidMount() {
      this.retrieveCategoryDrawing(this.props.match.params.cat);
      this.retriveCategoryInfo(this.props.match.params.cat);
      const user = AuthService.getCurrentUser();
  
      if (user) {
        this.setState({
          currentUser: user,
          showEngineerBoard: user.roles.includes("ROLE_USER"),
          showManagerBoard: user.roles.includes("ROLE_MODERATOR"),
          showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        });
      }  
    }
    retriveCategoryInfo(id){
      DrawingCategoryDataService.getOne(id)
      .then(response => {
        this.setState({
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          projectId: response.data.projectId,
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
    retrieveCategoryDrawing(id) {
      DrawingDataService.getCat(id)
        .then(response => {
          this.setState({
            drawings: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    render() {
        const { id,title,description,drawings,currentIndex,showManagerBoard,projectId,cat } = this.state;
        return (
            <div>
              <h2>{title} Drawings</h2>
              <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/"+projectId}>
                App Dashboard
              </Link>
              <Link color="textPrimary" to={"/drawing/"+projectId} aria-current="page">
                Drawing Home
              </Link>
              <Link color="textPrimary" to={"/viewdrawingcategory/"+id+"/"+cat} aria-current="page">
                {title}
              </Link>
            </Breadcrumbs>
              
              <hr></hr>
              <h3>Category Details</h3>
              <div className="row">
                  <div className="col-9">
                  <h6>Name : {title}</h6>
                  <h6>Description : {description}</h6>
                  <h6>🔴 : Not Complete</h6>
                  <h6>🟡 : Pending</h6>
                  <h6>🟢 : Complete</h6>
                  </div>
                  <div className="col-3">
                  { showManagerBoard &&
                  <div>
                  <Link className="btn btn-primary" to={"/updatedrawingcategory/"+projectId+"/"+cat} style={{'text-decoration': 'none'}}>
                  ⚙️ Manage
                  </Link>
                  <br/>
                  </div>
                  }
                  <Link className="btn btn-primary mt-2" to={"/adddrawing/"+projectId} style={{'text-decoration': 'none'}}>
                  Add Drawing
                  </Link>
                  </div>
                </div>
              <hr></hr>
              
              <h3>Drawing List</h3>
              {/* Drawing List */}
              <h6>Manage the drawing in each drawing category</h6>
              <Table striped bordered hover variant="secondary" responsive>
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {/* Functional for table data */}
                <tbody>
                {drawings &&
                    drawings.map((drawing, index) => (
                    <tr
                        // className={
                        // "list-group-item row" +
                        // (index === currentIndex ? "active" : "")
                        // }
                        // onClick={() => this.setActiveProject(project, index)}
                        key={index}
                    >
                    <td>{drawing.id}</td>
                    <td>{drawing.title}</td>
                    <td>{drawing.description}</td>
                    <td>{title}</td>
                    <td>{drawing.status == "Not Complete" ? "🔴 NC": drawing.status == "Pending" ? "🟡 Pending": "🟢 Complete"}</td>
                    <td>   
                        {/* Button Group */}
                        <Link to={"/viewdrawing/"+cat+"/"+drawing.id}>
                        <button className="btn btn-primary">View <VisibilityIcon/> </button>
                        </Link>
                        <Link to={"/updatedrawing/"+drawing.id+"/"+projectId}>
                        <button className="btn btn-success m-2">Update <UpdateIcon/> </button>
                        </Link>
                        {/* <Link to={"/viewdrawing/"+drawing.id}>
                        <button className="btn btn-danger">Delete <DeleteIcon/> </button>
                        </Link> */}
                    </td>    
                    </tr>
                    ))}
                </tbody>
                {/*Ends */}
              </Table>
             
            </div>
        );
    }
}
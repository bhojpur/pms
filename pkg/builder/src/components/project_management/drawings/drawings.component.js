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
import DrawingCategoryService from "../../../services/drawing-category.service";
import ProjectService from "../../../services/project.service";
import DrawRevisionService from "../../../services/drawrevision.service";
import { Breadcrumbs } from "@material-ui/core";
import Pdfviewer from "./pdfviewer.component";
import Card from 'react-bootstrap/Card';
import drawingcover from "././../../../assets/PM/photos/drawing.jpg";
import ProgressBar from 'react-bootstrap/ProgressBar';
// import ProgressBarCust from 'react-customizable-progressbar';

export default class Drawings extends Component {
    constructor(props) {
      super(props);
      this.retrieveDrawing = this.retrieveDrawing.bind(this);
      this.state = {
        drawings: [],
        drawingcategories: [],
        currentIndex: -1,
        content: "",
        project: [],

        drawingcount: 0,
        drawcategorycount: 0,
        revisioncount: 0,
        drawingComplete: 0,
        drawingPending: 0,
        drawingIncomplete: 0,
        id: this.props.match.params.id
      };
    }
    componentDidMount() {
      window.scrollTo(0, 0);
      this.retrieveDrawing(this.props.match.params.id);
      this.retriveDrawingCategory(this.props.match.params.id);
      this.retrieveDrawingStatus(this.props.match.params.id);
      this.retriveProject(this.props.match.params.id);
      this.getRevisions(this.props.match.params.id);
    }
    retrieveDrawing(id) {
      DrawingDataService.getAll(id)
        .then(response => {
          this.setState({
            drawings: response.data,
            drawingcount: response.data.length
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    retriveProject(id){
      ProjectService.get(id).then(response => {
        this.setState({
          project: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
    retriveDrawingCategory(id){
        DrawingCategoryService.getAll(id)
        .then(response => {
            this.setState({
              drawingcategories: response.data,
              drawcategorycount: response.data.length
            });
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
    }
    retrieveDrawingStatus(id) {
      DrawingDataService.getStatus(id,"Complete")
        .then(response => {
          this.setState({
            drawingComplete: response.data.length,
            // dataPie: response.data.length,
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        DrawingDataService.getStatus(id,"Pending")
        .then(response => {
          this.setState({
            drawingPending: response.data.length,
            //dataPie: response.data.length,
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        DrawingDataService.getStatus(id,"Not Complete")
        .then(response => {
          this.setState({
            drawingIncomplete: response.data.length,
            //dataPie: response.data.length,
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    getRevisions(id){
      DrawRevisionService.getAll(id)
      .then(response => {
          this.setState({
            revisioncount: response.data.length
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

    render() {
        const { drawings, drawingcount , drawingcategories, drawcategorycount,revisioncount,currentIndex,id,drawingComplete,
          drawingPending,drawingIncomplete, project } = this.state;
        const completePercentage = Math.ceil((drawingComplete/drawingcount)*100);
        const pendingPercentage = Math.ceil((drawingPending/drawingcount)*100);
        const incompletePerentage = Math.ceil((drawingIncomplete/drawingcount)*100);

        return (
        <div>
          <div className="container row">
            <div className="col-9">
              <h2>DRAWING HOME</h2>
                <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">
                  Home
                </Link>
                <Link color="inherit" to={"/projectmanagementhome/"+id}>
                  {project.title} / App Dashboard
                </Link>
                <Link color="textPrimary" to={"/drawing/"+id} aria-current="page">
                  Drawing Home
                </Link>
                </Breadcrumbs>
            </div>
            <div className="col-3">
                <h4>{project.title}</h4>
                {/* <h6>{project.description}</h6> */}
                <h6>{project.location}</h6>
            </div>
          </div>
          <hr></hr>
          <div className="container">
          <h3>Insights</h3>
          <h6>Overview of Drawings of the project</h6>
          <div className="row">
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm" title="Category Insights">
                <h1 className="m-2">{drawcategorycount}</h1>
                <h3 className="h5 nav-heading-title m-2">Category</h3>
                {/* <span className="fs-sm fw-normal text-muted">Contains abstract project detail specification with analytics</span> */}
              </div>
            </div>
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm" title="Project Insights">
                <h1 className="m-2" >{drawingcount}</h1>
                <h3 className="h5 nav-heading-title mb-0 m-2">Drawing</h3>
                {/* <span className="fs-sm fw-normal text-muted">Contains abstract project detail specification with analytics</span> */}
              </div>
            </div>
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm" title="Revision Insights">
                <h1 className="m-2">{revisioncount}</h1>
                <h3 className="h5 nav-heading-title mb-0 m-2">Revision</h3>
                {/* <span className="fs-sm fw-normal text-muted">Contains abstract project detail specification with analytics</span> */}
              </div>
            </div>
            <div className="col-lg-3 mb-grid-gutter pb-2 card-text-bhojpur">
              <div className="card card-hover shadow-sm" title="Project Detail Specification with Analytics">
              <Link className="d-block nav-heading text-center card-text-bhojpur" to={"/portfolio/" + id} style={{ 'text-decoration': 'none' }}>
                <center>
                <ProgressBar className="m-1">
                    <ProgressBar  variant="primary" now={completePercentage} key={1} />
                    <ProgressBar variant="success" now={pendingPercentage} key={2} />
                    <ProgressBar variant="danger" now={incompletePerentage} key={3} />
                  </ProgressBar>
                
                <h6>Complete: {completePercentage} %</h6>
                <h6>Pending : {pendingPercentage} %</h6>
                <h6>Incomplete : {incompletePerentage} %</h6>
                {/* <ProgressBarCust
                    radius={29}
                    progress={completePercentage}
                    cut={120}
                    rotate={-210}
                    initialAnimation
                    initialAnimationDelay={1}
                    strokeWidth={13}
                    strokeColor="#273f7d"
                    transition="2s ease"
                    trackStrokeWidth={12}
                    trackTransition="1s ease"
                    pointerRadius={3}
                    pointerStrokeWidth={12}
                /> */}
                {/* <h3 className="h5 nav-heading-title mb-0">Progress</h3> */}
                </center>
              </Link>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <div className="container">
        <h3>Drawings</h3>
        <h6>Manage the drawings,other related planning materials in here</h6>
        <Link className="btn btn-primary mb-2 mr-2" to={"/adddrawing/"+id}>
          Add New Drawing
        </Link>
        <Link className="btn btn-primary mb-2" to={"/adddrawingcategory/"+id}>
          Add Catgory
        </Link>
        <div className="container row">
            {drawingcategories &&
                drawingcategories.map((drawingcategory, index) => (
                    <div
                    className={
                    "container col-3" +
                    (index === currentIndex ? "active" : "")
                    }
                    key={index}
                >
                {/* unit data */}
                <Link to={"/viewdrawingcategory/"+id +"/"+drawingcategory.id}>
                        <Card
                        bg={'secondary'}
                        text={'dark'}
                        style={{ width: '15rem' }}
                        className="bg-dark mb-2"
                        >
                        <Card.Img src={drawingcover} alt="Card image" />
                        <Card.ImgOverlay>
                        <Card.Title><h4>{drawingcategory.title}</h4></Card.Title>
                        <Card.Text>
                           {drawingcategory.description == "" ? "No Description" : drawingcategory.description} 
                        </Card.Text>
                        </Card.ImgOverlay>
                        </Card>
                </Link>
                </div>
            ))}
            </div>
        </div>
        <hr></hr>
        <div className="container">
        <h3>Custom Drawing Viewer</h3>
        <p>View the drawing before use in a system and rapid file viewer</p>
        <Pdfviewer/>            
        </div>
        <hr></hr>
        <div className="container">
            {/* <h3>Recent List</h3>
            
            <ul className="list-group">
            {drawings &&
                drawings.map((drawing, index) => (
                <div
                    className={
                    "list-group-item row" +
                    (index === currentIndex ? "active" : "")
                    }
                    key={index}
                >
                <div className="row">
                <div className="col-10">
                {drawing.name}
                    <h6>{drawing.description}</h6>
                    <p>{drawing.drawtype}</p>
                    
                    <Link to={"/viewdrawing/"+drawing.id}>
                    <button className="btn btn-primary">View <VisibilityIcon/> </button>
                    </Link>
                    <Link to={"/viewdrawing/"+drawing.id}>
                    <button className="btn btn-success m-2">Update <UpdateIcon/> </button>
                    </Link>
                    <Link to={"/viewdrawing/"+drawing.id}>
                    <button className="btn btn-danger">Delete <DeleteIcon/> </button>
                    </Link>
                </div>
                </div>    
                </div>
                ))}
            </ul> */}
          </div> 
          </div>
        );
    }
}
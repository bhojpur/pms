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
import { WebcamCapture } from './webcam.component';
import { Breadcrumbs } from "@material-ui/core";

export default class CameraSinglePage extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        currentIndex: -1,
        content: "",
        id: this.props.match.params.id
      };
    }
    componentDidMount() {
      window.scrollTo(0, 0);
    }
    
    render() {
      const { currentIndex,id} = this.state;
      return (
        <div>
        <h3>Bhojpur PMS Camera</h3>
        <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">
              Home
            </Link>
            <Link color="inherit" to={"/projectmanagementhome/"+id}>
              App Dashboard
            </Link>
            <Link color="inherit" to={"/photos/"+id}>
              Photos Home
            </Link>
            <Link color="textPrimary" to={"/camera/"+id} aria-current="page">
              Camera
            </Link>
          </Breadcrumbs>
          <hr></hr>
         <WebcamCapture/>
         <hr></hr>
         <center>
         <Link className="btn btn-primary" style={{'text-decoration': 'none'}} to={"/movecapture/"+id}>
              Move Captures
        </Link>
        </center>
        </div>
    );
  }
}
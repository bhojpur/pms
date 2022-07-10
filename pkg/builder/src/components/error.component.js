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
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import errorIcon from "././../assets/unnamed.gif";

export default class ErrorPage extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        id: "",
      };
    }
    componentDidMount() {
     
    }
  
    render() {
      const {id} = this.state;
      return (
        <div className="container">
            <center>
                <h3>Error 404 : Page has not built by Bhojpur PMS</h3>
                <img
                    src={errorIcon}
                    alt="profile-img"
                    className="profile-img-card"
                    style={{'height': '350px', 'width':'350px'}}
                    id="img"
                />
                <p><a href="/login">Click here</a> to restart the process or contact the system admin for more infomation</p>
            </center>
        </div>
      );
    }
}
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
import DrawingDataService from "./../../../services/drawing.service";
import { Table } from "react-bootstrap";
import PdfIcon from '././../../../assets/PM/pdf.png';

export default class ViewSingleBidding extends Component {
    constructor(props) {
      super(props);
      this.retrieveDrawing = this.retrieveDrawing.bind(this);
      this.state = {
        id: this.props.match.params.id,
        name: "",
        description: "",
        drawtype: "", 
        projectId: ""
      };
    }
  
    componentDidMount() {
      this.retrieveDrawing(this.props.match.params.id);
    }
    retrieveDrawing(id) {
      DrawingDataService.get(id)
        .then(response => {
          this.setState({
            id: response.data.id,
            name: response.data.name,
            description: response.data.description,
            drawtype: response.data.drawtype,
            projectId: response.data.projectId,
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    render() {
        const { id,name,description,drawtype } = this.state;
        return (
            <div>
              <h2>Bidding Single Page</h2>
              <p>Manage bid specifications and submitted vendor response and awarding</p>
              <hr></hr>
              <div className="row">
              <div className="col-sm-6">
                <h3>Bid Package Details</h3>
                <h6>Package Id : 1</h6>
                <h6>Title : Demo Sample Bid #1 PortCity</h6>
                <h6>Description : Concrete Sample Bid</h6>
                <h6>Category : Infrastructure</h6>
                <h5>Status : <b>Open 🟢</b></h5>
              </div>
              <div className="col-sm-6">
                <h3>Bid Documents</h3>
                <img
                    // src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    src={PdfIcon}
                    alt="profile-img"
                    style={{'width': '75px'}}
                />
              </div>  
              </div>
              
              <hr></hr>
              <h3>Bid Responses</h3>
              <p>responses for the bid package</p>
              <div className="row">
              <div className="col-sm-10">
              <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Vendor Name</th>
                    <th>SOV</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>City Concrete</td>
                        <td>450 cubic/LKR</td>
                        <td>
                            <a className="btn btn-primary" href="/viewspec">View Spec</a>
                            <button className="btn btn-success">Award</button>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Access Concrete Pvt Ltd</td>
                        <td>650 cubic/LKR</td>
                        <td>
                            <button className="btn btn-primary">View Spec</button>
                            <button className="btn btn-success">Award</button>
                        </td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Empire colombo concrete</td>
                        <td>500 cubic/LKR</td>
                        <td>
                            <button className="btn btn-primary">View Spec</button>
                            <button className="btn btn-success">Award</button>
                        </td>
                    </tr>
                </tbody>
              </Table>  
              </div>
                <div className="col-sm-2">
                <div>
                    <h4>Sub Category</h4>
                    <p>Concrete Mixture</p>
                </div>
                <div>
                    <h4>Responses</h4>
                    <p>3</p>
                </div> 
                <div>
                    <h4>Due Date</h4>
                    <p>2021-07-25</p>
                </div> 
                </div>
                </div>
               
            </div>
        );
    }
}
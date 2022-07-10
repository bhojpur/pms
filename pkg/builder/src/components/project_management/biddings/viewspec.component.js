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

export default class ViewSpec extends Component {
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
              <h2>View Bidding Specification</h2>
              <p>view vendor/sub contractor bidding specification</p>
              <hr></hr>
              <div className="row">
              <div className="col-sm-3">
                <h3>Bidder Details</h3>
                <h6>Bidder Id : 13</h6>
                <h6>Name : Bhojpur Consulting Private Limited</h6>
                <h6>Tel : +1 (628) 200-4199</h6>
                <h6>Email : info@bhojpur.net</h6>
                <hr></hr>
                <h3>Specification</h3>
                
                <h5>SOV</h5>
                <p>450 cubic/LKR</p>
                <div>
                    <h4>Invitation sent:</h4>
                    <p>2018-03-25 16:14:34</p>
                </div>
                <div>
                    <h4>Invitation replied:</h4>
                    <p>2018-03-26 09:36:34</p>
                </div> 
              </div>
              <div className="col-sm-9">
                <h3>Bid Document</h3>
                <embed
                src="http://www.oas.org/juridico/PDFs/mesicic5_blz_resp_annex17.pdf"
                type="application/pdf"
                frameBorder="0"
                scrolling="auto"
                height="700px"
                width="100%"
            ></embed>
              </div>  
              </div>
              
              <div className="row">
              <div className="col-sm-8">
                
              </div>
              <div className="col-sm-4">
                
              </div>
            </div>   
            </div>
        );
    }
}
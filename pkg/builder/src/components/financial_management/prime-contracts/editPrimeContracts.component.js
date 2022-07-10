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

import React, { Component } from 'react';

class EditPrimeContracts extends Component {
  render() {
    return (
        <div>
       <h3> PRIME CONTRACT <span><h6>>Prime Contract #1</h6></span> </h3><hr/>
        <ul class="nav nav-tabs">
            <li class="nav-item">  
            <a class="nav-link active" id="generalprime" data-toggle="tab" href="#status" aria-controls="status" aria-selected="true">General</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" id="sov" data-toggle="tab" href="#comment" aria-controls="comment" aria-selected="true">SoV</a>
            </li>
            <li class="nav-item">
            <a class="nav-link" id="emails" data-toggle="tab" href="#comment" aria-controls="comment" aria-selected="true">Emails</a>
            </li>
         
        </ul><br />
          <div class="tab-content" id="myTabContent">
          <div class="col-md-12 text-right">
          &nbsp;&nbsp;<a href="#" className="btn btn-outline-dark mb-3">Edit</a>&nbsp;&nbsp;
            &nbsp;&nbsp;<a href="#" className="btn btn-outline-dark mb-3">Delete</a>&nbsp;&nbsp;
            &nbsp;&nbsp;<a href="#" className="btn btn-outline-dark mb-3">Email Contract</a>&nbsp;&nbsp;
            &nbsp;&nbsp;<a href="#" className="btn btn-outline-dark mb-3">Export</a>&nbsp;&nbsp;
              </div>
              <div class="tab-pane fade show active" id="status" role="tabpanel" aria-labelledby="general">
              <div className="submit-form">
          <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">#</label> 
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="id"
                required
                value= "1"
                name="id"
              />
              </div>
              <div className="form-group col-md-2"></div>
              <div className="form-group col-md-2">
                <label htmlFor="">Title:</label>
              </div>
              <div className="form-group col-md-4">
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value= "Vortex Properties Prime Contract"
                name="title"
              />
              </div>
              </div></div><hr />
              <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">Owner/Client:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="owner"
                required
                value= "Vertex Properties"
                name="owner"
              />
              </div> <div className="form-group col-md-2"></div>
              <div className="form-group col-md-2">
                <label htmlFor="">Contractor:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "Bhojpur PMS"
                name="contractor"
              />
              </div>
              </div><hr />
            <div className="form-row">
            <div className="form-group col-md-2">
                <label htmlFor="">Architect/Engineer:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="engineer"
                required
                value= ""
                name="engineer"
              />
              </div>
              </div><hr />
       
              <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">Status:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "Draft"
                name="contractor"
              />
              </div><div className="form-group col-md-2"></div>
              </div><hr />
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">Start Date:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "16/04/2021"
                name="contractor"
              />
              </div> <div className="form-group col-md-2"></div>
              <div className="form-group col-md-2">
                <label htmlFor="">Estimated Completion Date:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "16/04/2021"
                name="contractor"
              />
              </div>
              </div><hr />
              <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">Signed Contract Received Date:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "16/04/2021"
                name="contractor"
              />
              </div> <div className="form-group col-md-2"></div>
              <div className="form-group col-md-2">
                <label htmlFor="">Actual Completion Date:</label>
              </div>
              <div className="form-group col-md-2">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "16/04/2021"
                name="contractor"
              />
              </div>
              </div><hr />
            <div className="form-row">
            <div className="form-group col-md-2">
                <label htmlFor="">Default Retainange:</label>
              </div>
              <div className="form-group col-md-1">
              <input
                type="text"
                className="form-control"
                id="contractor"
                required
                value= "10"
                name="contractor"
              />
              </div><div className="form-group col-md-1">%</div>
              <div className="form-group col-md-2">
                <label htmlFor="">Executed:</label>
                <input
                type="checkbox"
                className="form-control"
                id="executed"
                required
                value="false"
                name="executed"
              />
              </div>
             
            </div>
            
            <hr />
            <div className="form-row">
            <div className="form-group col-md-2">
                <label htmlFor="">Description:</label>
              </div>
              <div className="form-group col-md-6">
              <input
                type="textarea"
                className="form-control"
                id="contractor"
                required
                value= "dqwdqw"
                name="contractor"
              />
              </div>
            </div><hr />
            <div className="form-row">
            <div className="form-group col-md-2">
                <label htmlFor="">Inclusions:</label>
              </div>
              <div className="form-group col-md-6">
              <input
                type="textarea"
                className="form-control"
                id="contractor"
                required
                value= "dqwdqw"
                name="contractor"
              />
              </div>
            </div><hr />
            <div className="form-row">
            <div className="form-group col-md-2">
                <label htmlFor="">Exclusions:</label>
              </div>
              <div className="form-group col-md-6">
              <input
                type="textarea"
                className="form-control"
                id="contractor"
                required
                value= "dqwdqw"
                name="contractor"
              />
              </div>
            </div><hr />
            <div className="form-row">
            <div className="form-group col-md-6">
                <label htmlFor="">Attachments:</label>
              </div>
              <div className="form-group col-md-2">
       
        

             </div></div>

          </div>
                <div>
                </div>
        
              
              <div class="tab-pane fade" id="comment" role="tabpanel" aria-labelledby="recyclebin">
                
              </div>

            </div>

         
        </div>
    );
    }

}

export default EditPrimeContracts;
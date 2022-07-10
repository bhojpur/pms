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

class ViewTasks extends Component {

  render() {
    return (
      <div className="">
        <h2>View Tasks</h2><hr/>
        <div className="mb-3">
          <form>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">No</label>
                <input className="form-control" type="number" min="0" readOnly/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="">Title</label>
                <input className="form-control" type="text" readOnly/>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="">Status</label>
                <input className="form-control" type="text" readOnly/>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="">Assignee</label>
                <input className="form-control" type="text" readOnly/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">Due Date</label>
                <input className="form-control" type="date" min="" readOnly/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="">Category</label>
                <input className="form-control" type="text" readOnly/>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="">Discription</label>
                <input className="form-control" type="textarea" readOnly/>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="privateCheck" disabled/>
                <label htmlFor="privateCheck" className="form-check-label">Private</label>
              </div>
            </div>
          </form>
        </div>

        <div>
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a class="nav-link active" id="changeStatus" data-toggle="tab" href="#status" aria-controls="status" aria-selected="true">Change Status</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="addComment" data-toggle="tab" href="#comment" aria-controls="comment" aria-selected="true">Add Comment</a>
            </li>
          </ul>
          
          <div class="tab-content" id="myTabContent">
            
            <div class="tab-pane fade show active" id="status" role="tabpanel" aria-labelledby="changeStatus">
              <form action="">
                <div className="form-group row mt-3">
                  <label className="col-sm-3 col-form-label">The task's status is currently</label>
                  <input className="form-control col-md-3" type="text" readOnly/>
                </div>
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label" htmlFor="">Change Status to </label>
                  <select className="form-control col-md-3" required>
                      <option value="Initialized">Initialized</option>
                      <option value="In progress">In progress</option>
                      <option value="Ready for review">Ready for review</option>
                      <option value="Closed">Closed</option>
                      <option value="Void">Void</option>
                  </select>
                </div>
                <textarea className="form-control col-md-6 mb-3" placeholder="Comment (Optional)" rows="5"></textarea>
                <a href="#" className="btn btn-success">Update Status</a>
              </form>
            </div>

            <div class="tab-pane fade" id="comment" role="tabpanel" aria-labelledby="addComment">
              <br />
              <textarea className="form-control col-md-6 mb-3" placeholder="Comment" rows="5" required></textarea>
              {/* <label htmlFor="">Attachment</label> */}
              <a href="#" className="btn btn-success">Comment</a>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
  
}

export default ViewTasks;
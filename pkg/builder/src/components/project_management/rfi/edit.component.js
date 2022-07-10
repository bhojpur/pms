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

class EditRFI extends Component {

  render() {
    return (
        <div className="">
            <h2>RFI #No Details - Update</h2><hr/>
            <div className="mb-3">
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-6"></div>
                        <div className="form-group col-md-3 form-check">
                            <input type="checkbox" className="form-check-input" id="draftCheck" required/>
                            <label htmlFor="draftCheck" className="form-check-label">Draft</label>
                        </div>
                        <div className="form-group col-md-3 form-check">
                            <input type="checkbox" className="form-check-input" id="privateCheck" required/>
                            <label htmlFor="draftCheck" className="form-check-label">Private</label>
                        </div>
                    </div>
                    <div className="form-row">
                    <div className="form-group col-md-2">
                        <label htmlFor="">No</label>
                        <input className="form-control" type="number" min="0" required/>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="">Subject</label>
                        <input className="form-control" type="text" required/>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="">Assigned To</label>
                        <select className="form-control" required>
                        <option value="Yes" selected>Yes</option>
                        <option value="Yes" selected>Yes</option>
                        <option value="Assignee 2">Assignee 2</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="">Status</label>
                        <select className="form-control" required>
                        <option value="Open" selected>Open</option>
                        <option value="Ready to review">Ready to review</option>
                        </select>
                    </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="">RFI Manager</label>
                            <input className="form-control" type="text" required/>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="">Location</label>
                            <input className="form-control" type="text" required/>
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="">Due Date</label>
                            <input className="form-control" type="date" min="" required/>
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="">Drawing No</label>
                            <input className="form-control" type="number" min="0" required/>
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="">Keywords</label>
                            <input className="form-control" type="text"/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="">Responsible Contracts</label>
                            <input className="form-control" type="text" readOnly/>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">Received From</label>
                            <input className="form-control" type="text" readOnly/>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="">Destribution list</label>
                            <input className="form-control" type="text" required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="">Schedule Impact</label>
                            <select className="form-control" required>
                                <option value="Yes" selected>Yes</option>
                                <option value="Unknown" selected>Yes (Unknown)</option>
                                <option value="Yes" selected>No</option>
                                <option value="Yes" selected>TBD</option>
                                <option value="Yes" selected>NA</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="">Cost Impact</label>
                            <select className="form-control" required>
                                <option value="Yes" selected>Yes</option>
                                <option value="Unknown" selected>Yes (Unknown)</option>
                                <option value="No" selected>No</option>
                                <option value="TBD" selected>TBD</option>
                                <option value="NA" selected>NA</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="">Spec section</label>
                            <input className="form-control" type="text" required/>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="">Cost code</label>
                            <input className="form-control" type="text" required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="">Question</label>
                            <textarea className="form-control" type="textarea" required/>
                        </div>
                    </div>
                    <a href="#" type="submit" className="mr-3">Cancel</a>
                    <a href="#" type="submit" className="btn btn-success">Save</a>
                </form>
            </div>
        </div>
    );
  }
  
}

export default EditRFI;
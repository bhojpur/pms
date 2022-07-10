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
import BootstrapTable from 'react-bootstrap-table-next';

const data = [
  {edit:<a href="/managestasks/update" className="btn btn-success">Edit</a>, view:<a href="/managestasks/view" className="btn btn-primary">View</a>, no: 1, title:"", description:"Collect all the biddings", category:"Bidding"}
];
const columns = [
  {
    dataField: 'edit',
    text: '',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'view',
    text: '',
    headerStyle: (column, colIndex) => {
    return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'no',
    text: 'No',
    headerStyle: (column, colIndex) => {
    return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'title',
    text: 'Title',
    headerStyle: (column, colIndex) => {
    return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'description',
    text: 'Description',
    headerStyle: (column, colIndex) => {
    return { width: '50%', textAlign: 'center' };}
  },{
    dataField: 'assignee',
    text: 'Assignee',
    headerStyle: (column, colIndex) => {
    return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'duedate',
    text: 'Due Date',
    headerStyle: (column, colIndex) => {
        return { width: '50%', textAlign: 'center' };}
  }, {
    dataField: 'status',
    text: 'Status',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  },
  {
    dataField: 'category',
    text: 'Category',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  }];

class ManageTasks extends Component {

  render() {
    return (
      <div className="">
        <h2>Manage Tasks</h2><hr/>
        <div className="mb-3">
          <h5>New Tasks</h5>
          <form>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">No</label>
                <input className="form-control" type="number" min="0" required/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="">Title</label>
                <input className="form-control" type="text" required/>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="">Status</label>
                <select className="form-control" required>
                  <option value="Initialized" selected>Initialized</option>
                  <option value="In progress">In progress</option>
                  <option value="Ready for review">Ready for review</option>
                  <option value="Closed">Closed</option>
                  <option value="Void">Void</option>
                </select>
              </div>
              <div className="form-group col-md-3">
                <label htmlFor="">Assignee</label>
                <select className="form-control" required>
                  <option value="Assignee 1" selected>Assignee 1</option>
                  <option value="Assignee 2">Assignee 2</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="">Due Date</label>
                <input className="form-control" type="date" min="" required/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="">Category</label>
                <select className="form-control" required>
                  <option value="Category 1">Category 1</option>
                  <option value="Category 2">Category 2</option>
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="">Discription</label>
                <input className="form-control" type="textarea"/>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="privateCheck" />
                <label htmlFor="privateCheck" className="form-check-label">Private</label>
              </div>
            </div>
            <a href="/managetasks" type="submit" className="btn btn-success">Add</a>
          </form>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-4">
              <input className="form-control" type="text" placeholder="Search" />
            </div>
            <a href="#" className="btn btn-primary mb-3">Add Filter</a>
          </div>
        </form>
        <div className="">
          <BootstrapTable 
            hover
            keyField='assignee'
            data={ data }
            columns={ columns } 
            cellEdit={ false }
          />
        </div>
      </div>
    );
  }
  
}

export default ManageTasks;
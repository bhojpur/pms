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
import BootstrapTable from 'react-bootstrap-table-next';

const data = [
    {edit:<a href="/addCategory" className="btn btn-success">Edit</a>, view:<a href="/viewCategory" className="btn btn-primary">View</a>, No: 1, name: 'Bidding', active:<input type="checkbox"></input>, delete:<a href="/deleteCategory" className="btn btn-danger">Delete</a>},
    {edit:<a href="/addCategory" className="btn btn-success">Edit</a>, view:<a href="/viewCategory" className="btn btn-primary">View</a>, No: 2, name: 'ABC Company', active:<input type="checkbox"></input>, delete:<a href="/deleteCategory" className="btn btn-danger">Delete</a>},
    {edit:<a href="/addCategory" className="btn btn-success">Edit</a>, view:<a href="/viewCategory" className="btn btn-primary">View</a>, No: 3, name: 'Contracts', active:<input type="checkbox"></input>, delete:<a href="/deleteCategory" className="btn btn-danger">Delete</a>}
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
    dataField: 'No',
    text: 'No',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'name',
    text: 'Name',
    headerStyle: (column, colIndex) => {
        return { width: '50%', textAlign: 'center' };}
  }, {
    dataField: 'active',
    text: 'Active',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  },
  {
    dataField: 'delete',
    text: 'Delete',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  }];

class TaskConfiguration extends Component {

  render() {
    return (
      <div className="">
        <h2>Task Tool Configuration</h2><hr/>
        <h5>Task Categories</h5>
        <form className="row g-3">
          <div className="col-auto">
            <input className="form-control" type="text" placeholder="Enter new task category"/>  
          </div>
          <div className="col-auto">
            <a href="" className="btn btn-success">Create</a>
          </div>
        </form>
        <hr />
        <div>
          <BootstrapTable 
            hover
            keyField='No'
            data={ data }
            columns={ columns } 
            cellEdit={ false }
          />
        </div>
      </div>
    );
  }
  
}

export default TaskConfiguration;
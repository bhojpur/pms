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

import React, { Component, Route, Switch } from "react";
import BootstrapTable from 'react-bootstrap-table-next';

const data = [
  {edit:<a href="/managerfi/edit" className="btn btn-success">Edit</a>, view:<a href="/managerfi/view" className="btn btn-primary">View</a>}
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
    dataField: 'subject',
    text: 'Subject',
    headerStyle: (column, colIndex) => {
    return { width: '50%', textAlign: 'center' };}
  }, {
    dataField: 'status',
    text: 'Status',
    headerStyle: (column, colIndex) => {
    return { width: '5%', textAlign: 'center' };}
  },{
    dataField: 'rc',
    text: 'Responsible Contractor',
    headerStyle: (column, colIndex) => {
    return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'rf',
    text: 'Recieved From',
    headerStyle: (column, colIndex) => {
        return { width: '50%', textAlign: 'center' };}
  }, {
    dataField: 'date',
    text: 'Initialized Date',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  },
  {
    dataField: 'manager',
    text: 'RFI manager',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  }];

  class rfiHome extends Component {

  render() {
    return (
      <div className="">
        <h2>RFI</h2><hr/>
        <form>
          <div className="form-row mt-3">
            <div class="col-md-12 text-right">
              <a href="/managerfi/create" className="btn btn-primary">+ Create RFI</a>
            </div>
            <div className="form-group col-md-4">
              <input className="form-control" type="text" placeholder="Search" />
            </div>
            <a href="#" className="btn btn-outline-dark mb-3">Add Filter</a>
          </div>
        </form>
        <div className="">
          <BootstrapTable 
            hover
            keyField='rc'
            data={ data }
            columns={ columns } 
            cellEdit={ false }
          />
        </div>
      </div>
    );
  }
  
}

export default rfiHome;
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
import CreateCategory from './createcat.component';

const data = [
    {edit: <a href="/dailylogsconfiguration/update" className="btn btn-success">Edit</a>, view:<a href="/dailylogsconfiguration/view" className="btn btn-primary">View</a>, delete: <a href="/dailylogsconfiguration/delete" className="btn btn-danger">Delete</a>}
  ];
const columns = [
    {
      dataField: 'edit',
      text: '',
      headerStyle: (column, colIndex) => {
          return { width: '5%', textAlign: 'center' };}
    }, {
      dataField: 'category',
      text: 'Category',
      headerStyle: (column, colIndex) => {
      return { width: '20%', textAlign: 'center' };}
    }, {
      dataField: 'description',
      text: 'Description',
      headerStyle: (column, colIndex) => {
          return { width: '25%', textAlign: 'center' };}
    }, {
      dataField: 'titles',
      text: 'Titles',
      headerStyle: (column, colIndex) => {
      return { width: '45%', textAlign: 'center' };}
    }, {
      dataField: 'delete',
      text: '',
      headerStyle: (column, colIndex) => {
      return { width: '5%', textAlign: 'center' };}
    }
];

class DlConfiguration extends Component {

  render() {
    return (
      <div className="">
        <h2>Daily Log Configuration</h2><hr/>
        <form>
          <div className="form-row mb-3">
            <div class="col-md-12 text-right">
              <a data-toggle="modal" data-target="#CreateCategory" href="#" className="btn btn-primary">+ Create a Category</a>
            </div>
          </div>
        </form>
        <div>
          <BootstrapTable 
            hover
            keyField='temp'
            data={ data }
            columns={ columns } 
            cellEdit={ false }
          />
        </div>
        
        {/* Create Category Starts */}
        <div className="modal fade" id="CreateCategory" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <CreateCategory/>        
        </div>
        {/* Create Category Ends */}

      </div>
    );
  }
  
}

export default DlConfiguration;
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

import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';

const Dates = () => {

const options = {
    page: 1,
    sizePerPage: 5,
    nextPageText: '>',
    prePageText: '<',
    showTotal: true
  };

const data = [
    {id: 1, name: 'Bid Day', check:<input type='checkbox' /> ,delete:''},
    {id: 2, name: 'Breaking Ground', check: <input type='checkbox' />,delete:''},
    {id: 3, name: 'Contract Awarded', check: <input type='checkbox' />,delete:''}
  ];
  const columns = [{
    dataField: 'id',
    text: '',
    headerStyle: (column, colIndex) => {
        return { width: '10%', textAlign: 'center' };}
  }, {
    dataField: 'name',
    text: 'Name',
    headerStyle: (column, colIndex) => {
        return { width: '70%', textAlign: 'center' };}
  }, {
    dataField: 'check',
    text: 'Add to Project Dashboard',
    headerStyle: (column, colIndex) => {
        return { width: '20%', textAlign: 'center' };}
  },
  {
    dataField: 'delete',
    text: 'Remove',
    headerStyle: (column, colIndex) => {
        return { width: '20%', textAlign: 'center' };}
  }];
        return (
          <div>
            <h2 className="Table-header">Dates</h2>
            <hr />
             
            <BootstrapTable 
                hover
                keyField='id'
                data={ data }
                columns={ columns } 
                pagination={ paginationFactory(options) }
                cellEdit={ cellEditFactory({ mode: 'click' }) }
 
            />
          </div>
        );
      };
    

export default Dates;
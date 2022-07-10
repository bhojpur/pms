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

const Defaults = () => {

const options = {
    page: 1,
    sizePerPage: 5,
    nextPageText: '>',
    prePageText: '<',
    showTotal: true
  };

const data = [
    {name: 'Bidding', bid:'Yes' ,project:'2',delete:<button>Delete</button>},
    {name: 'Course of Construction', bid:'No' ,project:'3',delete:<button>Delete</button>},
    {name: 'Post Construction', bid:'No' ,project:'4',delete:<button>Delete</button>}
  ];
  const columns = [{
    dataField: 'name',
    text: 'Name',
    headerStyle: (column, colIndex) => {
        return { width: '60%', textAlign: 'center' };}
  }, {
    dataField: 'bid',
    text: 'Bidding Stage?',
    headerStyle: (column, colIndex) => {
        return { width: '15%', textAlign: 'center' };}
  }, {
    dataField: 'project',
    text: 'Projects',
    headerStyle: (column, colIndex) => {
        return { width: '15%', textAlign: 'center' };}
  },
  {
    dataField: 'delete',
    text: '',
    headerStyle: (column, colIndex) => {
        return { width: '10%', textAlign: 'center' };}
  }];

        return (
          <div>
            <h2 className="Table-header">Defaults</h2>
            <hr />
            <p><b>Default Project Settings</b></p>
            <hr />
            <p>Include store number and designated market area <input type='checkbox' /></p>
            <hr />
            <p>Prevent overbilling on all projects <input type='checkbox' /></p>
            <hr />
            <p></p>
            <hr />
            {/*<Form>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Include store number and designated market area" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Prevent overbilling on all projects" />
                </Form.Group>
            </Form>*/}

            <p><b>Project Stages</b></p>
           
             
            <BootstrapTable 
                hover
                keyField='id'
                data={ data }
                columns={ columns } 
                pagination={ paginationFactory(options) }
                cellEdit={ cellEditFactory({ mode: 'click' }) }
 
            />

            <p><b>Project Types</b></p>
            <p><button>Edit</button> Civil</p>
            <hr />
            <p><button>Edit</button> Commercial</p>
            <hr />
            <p><button>Edit</button> Education</p>
            <hr />
            <p><button>Edit</button> Healthcare</p>
            <hr />
            <form>
                            <input type='text' placeholder='Add Type'/>
                            <button>Add Type</button>
            </form><br />

            <p><b>Departments</b></p>
            <p><button>Edit</button> Technology Services</p>
            <hr />
            <p><button>Edit</button> Sales and Marketing</p>
            <hr />
            <p><button>Edit</button> Purchasing</p>
            <hr />
            <p><button>Edit</button> Finance</p>
            <hr />
            <form>
                            <input type='text' placeholder='Add Departments'/>
                            <button>Add Departments</button>
            </form><br />

            <p><b>Bid Type Settings</b></p>
            <p><button>Edit</button> Competitive</p>
            <hr />
            <p><button>Edit</button> Negotiated</p>
            <hr />
            <p><button>Edit</button> Not Applicable</p>
            <hr />
            <form>
                            <input type='text' placeholder='Add Departments'/>
                            <button>Add Departments</button>
            </form><br />

            <p><b>Owner Type Settings</b></p>
            <form>
                            <input type='text' placeholder='Add Owner Type'/>
                            <button>Add Owner Type</button>
            </form><br />

            <button>Save Changes</button>

          </div>
        );
      
    };

export default Defaults;
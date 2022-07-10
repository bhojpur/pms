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
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@material-ui/core";
import {People,Search} from '@material-ui/icons';
import EmployeeDataService from "./../../../services/employee.service";

  const columns = [{
    dataField: 'id',
    text: 'Id',
    headerStyle: (column, colIndex) => {
        return { width: '7%', textAlign: 'center' };}
  }, {
    dataField: 'name',
    text: 'Name',
    headerStyle: (column, colIndex) => {
        return { width: '22%', textAlign: 'center' };}
  }, {
    dataField: 'role',
    text: 'Role',
    headerStyle: (column, colIndex) => {
        return { width: '18%', textAlign: 'center' };}
  },
  {
    dataField: 'email',
    text: 'Email',
    headerStyle: (column, colIndex) => {
        return { width: '18%', textAlign: 'center' };}
  },
  {
    dataField: 'mobile',
    text: 'Mobile',
    headerStyle: (column, colIndex) => {
        return { width: '13%', textAlign: 'center' };}
  },
  {
    dataField: 'edit',
    text: '',
    headerStyle: (column, colIndex) => {
        return { width: '8%', textAlign: 'center' };}
  },
  {
    dataField: 'create',
    text: '',
    headerStyle: (column, colIndex) => {
        return { width: '15%', textAlign: 'center' };}
  }  
];


class Employee extends Component {

  constructor(props) {
    super(props);
    this.getEmployees = this.getEmployees.bind(this);
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.searchEmpName = this.searchEmpName.bind(this);
    this.refreshList = this.refreshList.bind(this);
    console.log(this.getEmployee);
    this.state = {
      currentEmployee: {
        employees: [],
        currentEmployee: null,
        currentId: -1,
        
      },
      message: "",
      temp: this.props.match.params.id,
      searchName: ""
    };
  }

  componentDidMount() {
    this.getEmployees();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });

    console.log(this.state.searchName)
  }

  refreshList() {
    this.getEmployees();
    this.setState({
      currentEmployee: null,
      currentIndex: -1,
      searchName: ""
    });
  }

  getEmployees() {
    EmployeeDataService.getAll()
      .then(response => {
        this.setState({
          employees: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchEmpName() {
    EmployeeDataService.findByName(this.state.searchName)
      .then(response => {
        this.setState({
          employees: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {

    const {employees, currentEmployee, currentIndex } = this.state;

    //assigning table values
    var data1=[];
    var temp={};
    {employees &&
      employees.map((employee, index) => (
        temp={},
        temp.id=employee.id,
        temp.name= employee.name,
        temp.role=employee.role,
        temp.email=employee.email,
        temp.mobile=employee.mobile,
        temp.edit=<Link to={"/editUser/"+temp.id}> <a className="btn btn-primary">View</a></Link>,
        employee.hasAccount? temp.create=<p></p> : temp.create=<Link to={"/register/"+temp.id} ><a className="btn btn-secondary"> Create Acc.</a></Link>,
        data1.push(temp)
      )
      )}

    //console.log(employees);
      return (
        <div>

          <h2><People/> EMPLOYEES</h2>

          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/home">
              Home
            </Link>
            <Link color="inherit" to={"/admin"}>
              Core Dashboard
            </Link>
            <Link color="inherit" to={"#/"}>
              Employees
            </Link>
          </Breadcrumbs>

          <form className="row g-3 mt-2">
            <div className="col-auto">
              <input className="form-control" type="text" 
                onChange={this.onChangeSearchName}
                placeholder="Search employee"/>  
            </div>

            <div className="col-auto">
              <a onClick={this.searchEmpName} className="btn btn-success"><Search/> </a>
            </div>

            <div>
              <Link to={"/addUser"}><a className="btn btn-primary"> + Add Employee</a></Link>
            </div>
          </form>

          <hr />
            
          <BootstrapTable 
                hover
                keyField='id'
                data={ data1 }
                columns={ columns } 
                cellEdit={ false }

          />
        </div>
      );
    }
  }

export default Employee;
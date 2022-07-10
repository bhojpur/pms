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
import VendorDataService from "./../../../services/vendor.service";
import {Face,Search} from '@material-ui/icons';
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@material-ui/core";

  const columns = [{
    dataField: 'id',
    text: 'Id',
    headerStyle: (column, colIndex) => {
        return { width: '5%', textAlign: 'center' };}
  }, {
    dataField: 'companyName',
    text: 'Company Name',
    headerStyle: (column, colIndex) => {
        return { width: '15%', textAlign: 'left' };}
  }, {
    dataField: 'type',
    text: 'Type',
    headerStyle: (column, colIndex) => {
        return { width: '12%', textAlign: 'center' };}
  },
  {
    dataField: 'contactNo',
    text: 'Contact No',
    headerStyle: (column, colIndex) => {
        return { width: '15%', textAlign: 'center' };}
  },
  {
  dataField: 'email',
  text: 'Email',
  headerStyle: (column, colIndex) => {
      return { width: '20%', textAlign: 'center',  };}
  },
  {
    dataField: 'contactPersonName',
    text: 'contact person name',
    headerStyle: (column, colIndex) => {
        return { width: '20%', textAlign: 'center' };}
  },
  {
    dataField: 'edit',
    text: '',
    headerStyle: (column, colIndex) => {
        return { width: '15%', textAlign: 'center' };}
  }];


class Vendors extends Component {
  
  constructor(props) {
    super(props);
    this.getVendors = this.getVendors.bind(this);
    console.log(this.getVendor);
    this.state = {
      currentVendor: {
        vendors: [],
        currentVendor: null,
        currentId: -1,
        searchName: ""
        
      },
      message: "",
      temp: this.props.match.params.id
    };
  }

  componentDidMount() {
    this.getVendors(this.props.match.params.id);
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
  }

  refreshList() {
    this.getVendors();
    this.setState({
      currentVendor: null,
      currentIndex: -1,
      searchName: ""
    });
  }

  getVendors() {
    VendorDataService.getAll()
      .then(response => {
        this.setState({
          vendors: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchName() {
    VendorDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          vendors: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {

    const {vendors, currentVendor, currentIndex } = this.state;

    //assigning table values
    var data1=[];
    var temp={};
    {vendors &&
      vendors.map((vendor, index) => (
        temp={},
        temp.id=vendor.id,
        temp.companyName= vendor.companyName,
        temp.type=vendor.type,
        temp.contactNo=vendor.contactNo,
        temp.email=vendor.email,
        temp.contactPersonName=vendor.contactPersonName,
        temp.edit=<Link to={'/editVendor/'+vendor.id}><a className="btn btn-primary"> View</a></Link>,
        data1.push(temp)
      )
      )}
    console.log(vendors);

    return (
      <div>
        
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page">Vendors</a>
          </li>
          <li class="nav-item">
            <Link to="/subcontractors"><a class="nav-link" style={{textDecoration:'none'}}>Sub-Contractors</a></Link>
          </li>
        </ul>

        <h2 className="mb-2"> <Face/> VENDORS</h2>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" to="/home">
            Home
          </Link>
          <Link color="inherit" to={"/admin"}>
            Core Dashboard
          </Link>
          <Link color="inherit">
            Vendors
          </Link>
        </Breadcrumbs>

        <form className="row g-3 mt-2">
          <div className="col-auto">
            <input className="form-control" type="text" placeholder="Search vendor"/>  
          </div>

          <div className="col-auto">
            <a href="" className="btn btn-success mr-2"><Search/></a>
          </div>

          {/* <p>Group By:</p>

          <div className="col-auto">
            <select className="form-control" name="" id="">
              <option value="role1">date</option>
              <option value="role2">Projects</option>
              <option value="role3">contact</option>
            </select><br />
          </div> */}

          <div>
            <Link to="/addVendor"> <a className="ml-5 btn btn-primary"> + Add Vendor</a></Link>
          </div>
        </form>

        <hr />
        <table>
          <th>

          </th>
        </table>  
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

export default Vendors;
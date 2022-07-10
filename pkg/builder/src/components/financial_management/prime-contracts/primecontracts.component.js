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
import { Link } from "react-router-dom";
import PrimeContractDataService from "./../../../services/primecontract.service";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import UpdateIcon from '@material-ui/icons/Update';
import BootstrapTable from 'react-bootstrap-table-next';

import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

export default class PrimeContracts extends Component {
    
  constructor(props) {
    super(props);
    this.retrievePrimeContract = this.retrievePrimeContract.bind(this);
    this.state = {
      primecontracts: [],
      currentIndex: -1,
      content: "",
      id: this.props.match.params.id
    };
  }

  // makeStyles((theme) => ({
  //     button: {
  //       margin: theme.spacing(1),
  //     },
  //   }));

  componentDidMount() {
    this.retrievePrimeContract(this.props.match.params.id);
  }
  retrievePrimeContract(id) {
    PrimeContractDataService.getAll(id)
      .then(response => {
        this.setState({
          primecontracts: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  render() {
      const { primecontracts ,currentIndex,id } = this.state;
      // const classes = useStyles();
      return (
          <div>
             <div className="container row">
          <div className="col-12">
          <h2>Prime Contracts</h2>
          <h6>See the status and current value of contracts and purchase orders.</h6>
          <hr />
          </div>
         
          </div>
          <div className="col-12 text-right">
              
              <Link className="btn btn-primary mr-2" to={"/addprimecontract/"+id}>
              Add New Prime Contract
              </Link>
          </div>


          <div className="container">
              <h4>Prime Contracts List</h4>
          {/* Drawing List */}
          <ul className="list-group">
          {primecontracts &&
              primecontracts.map((primecontract, index) => (
              <div
                  className={
                  "list-group-item row" +
                  (index === currentIndex ? "active" : "")
                  }
                  // onClick={() => this.setActiveProject(project, index)}
                  key={index}
              >
              <div className="row">
              <div className="col-10">
              <h6>Title : {primecontract.title}</h6>
                  <h6>Contractor :{primecontract.contractor}</h6> 
                  <h6>Status :  {primecontract.status}</h6>
                  {/* Button Group */}
                  <Link to={"/viewprimecontract/"+primecontract.id}>
                  <button className="btn btn-primary">View <VisibilityIcon/> </button>
                  {/* <Button
                      variant="contained"
                      color="primary"
                      className="btn btn-primary"
                      endIcon={<VisibilityIcon/>}
                  >
                      View 
                  </Button>*/}
                  </Link>
                  <Link to={"/viewprimecontract/"+primecontract.id}>
                  <button className="btn btn-success m-2">Update <UpdateIcon/> </button>
                  </Link>
                  <Link to={"/viewprimecontract/"+primecontract.id}>
                  <button className="btn btn-danger">Delete <DeleteIcon/> </button>
                  </Link>
                  
              </div>
              {/* <div className="col-2">
              <img src={drawingIcon} alt="" width="50"/>
              </div>     */}
              </div>    
              </div>
              ))}
          </ul>
          </div> 
          </div>
      );
  }
}
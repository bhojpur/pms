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
import { Link } from "react-router-dom";
import InvoiceDataService from "./../../../services/invoice.service";

export default class AddInvoice extends Component{

  constructor(props) {
    super(props);
    this.onChangeHash = this.onChangeHash.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTo = this.onChangeTo.bind(this);
    this.onChangeFrom = this.onChangeFrom.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeWorkCompleted = this.onChangeWorkCompleted.bind(this);
    this.onChangeAmmountDue= this.onChangeAmmountDue.bind(this);
    this.saveInvoice = this.saveInvoice.bind(this);
    this.newInvoice = this.newInvoice.bind(this);

    this.state = {
      id: null,
      hash :"",
      date :"",
      to :"",
      from :"",
      description :"",
      workCompleted :"",
      ammountDue: "",
      commitmentId: this.props.match.params.id,  
      submitted: false
    };
  }

  onChangeHash(e) {
    this.setState({
      hash: e.target.value
    });
  }

  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }

  onChangeTo(e) {
    this.setState({
      to: e.target.value
    });
  }

  onChangeFrom(e) {
    this.setState({
      from: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeWorkCompleted(e) {
    this.setState({
      workCompleted: e.target.value
    });
  }

  onChangeAmmountDue(e) {
    this.setState({
      ammountDue: e.target.value
    });
  }

  saveInvoice() {
    console.log("clicked");  
    var data = {
      hash: this.state.hash,
      date: this.state.date,
      to: this.state.to,
      from: this.state.from,
      description: this.state.description,
      workCompleted: this.state.workCompleted,
      ammountDue: this.state.ammountDue,
      commitmentId: this.state.commitmentId
    };

    InvoiceDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          hash: response.data.hash,
          date: response.data.date,
          to: response.data.to,
          from: response.data.from,
          description: response.data.description,
            workCompleted: response.data.workCompleted,
            ammountDue: response.data.ammountDue,
            commitmentId: response.data.commitmentId,
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newInvoice() {
    this.setState({
      id: null,
      hash: "",
      date: "",
      to: "",
      from: "",
      description: "",
      workCompleted: "",
      ammountDue: "",
      commitmentId: this.props.match.params.id,

      submitted: false
    });
  }

 
  render() {
    const {commitmentId} = this.state;
    return (
        <div className="container">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newInvoice}>
              Add Another Invoice
            </button>&nbsp;&nbsp;
            <Link  to={"/invoice/"+commitmentId} className="btn btn-success">View Invoices</Link>
          </div>
        ) : (
          <div class="container">
            <h2>New Invoice</h2>
            <div className="form-group">
              <label htmlFor="amount">#</label>
              <input
                type="text"
                className="form-control"
                id="hash"
                required
                value={this.state.hash}
                onChange={this.onChangeHash}
                name="hash"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Invoice Date</label>
              <input
                type="date"
                className="form-control"
                id="date"
                required
                value={this.state.date}
                onChange={this.onChangeDate}
                name="date"
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">To</label>
              <input
                type="text"
                className="form-control"
                id="to"
                required
                value={this.state.to}
                onChange={this.onChangeTo}
                name="to"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">From</label>
              <input
                type="text"
                className="form-control"
                id="from"
                required
                value={this.state.from}
                onChange={this.onChangeFrom}
                name="from"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Ammount for Work Completed: </label>
              <input
                type="text"
                className="form-control"
                id="workCompleted"
                required
                value={this.state.workCompleted}
                onChange={this.onChangeWorkCompleted}
                name="workCompleted"
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Ammount Due: </label>
              <input
                type="text"
                className="form-control"
                id="ammountDue"
                required
                value={this.state.ammountDue}
                onChange={this.onChangeAmmountDue}
                name="ammountDue"
              />
            </div>

            <button onClick={this.saveInvoice} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
        <br /><br />
      </div>
    );
  }
};

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
import PaymentDataService from "./../../../services/payment.service";
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';

export default class CreatePayments extends Component{
  constructor(props) {
    super(props);
    this.onChangeInvoice = this.onChangeInvoice.bind(this);
    this.onChangePaymentMethod = this.onChangePaymentMethod.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangePaymentHash = this.onChangePaymentHash.bind(this);
    this.onChangeInvoiceHash = this.onChangeInvoiceHash.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
    this.onChangeAmmount = this.onChangeAmmount.bind(this);

    this.savePayment = this.savePayment.bind(this);
    this.newPayment = this.newPayment.bind(this);

    this.state = {
      id: null,
      invoice: "",
      paymentMethod: "",
      date: "",
      paymentHash: "",
      invoiceHash: "",
      note: "",
      ammount :"",

      projectId: this.props.match.params.id, 
      commitmentId: this.props.match.params.id,   
      submitted: false
    };
  }

  onChangeInvoice(e) {
    this.setState({
      invoice: e.target.value
    });
  }
  onChangePaymentMethod (e) {
    this.setState({
      paymentMethod: e.target.value
    });
  }
  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }
  onChangePaymentHash (e) {
    this.setState({
        paymentHash: e.target.value
    });
  }
  onChangeInvoiceHash (e) {
    this.setState({
        invoiceHash: e.target.value
    });
  }

  onChangeNote(e) {
    this.setState({
        note: e.target.value
    });
  }

  onChangeAmmount(e) {
    this.setState({
        ammount: e.target.value
    });
  }
  
  savePayment(){
    console.log("clicked");  
    var data = {
      invoice: this.state.invoice,
      paymentMethod: this.state.paymentMethod,
      date: this.state.date,
      paymentHash: this.state.paymentHash,
      invoiceHash: this.state.invoiceHash,     
      note: this.state.note,
      ammount:this.state.ammount,
      
      projectId: this.state.projectId,
      commitmentId: this.state.commitmentId
    };

    PaymentDataService.create(data)
      .then(response => {
        this.setState({
       
        invoice: response.data.invoice,
        paymentMethod: response.data.paymentMethod,
        date: response.data.date,
        paymentHash: response.data.paymentHash,
        invoiceHash: response.data.invoiceHash,     
        note: response.data.note,
        ammount:response.data.ammount,
          
          projectId: response.data.projectId,
          commitmentId: response.data.commitmentId,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newPayment() {
    this.setState({
      id: null,
      invoice: "",
      paymentMethod: "",
      date: "",
      paymentHash: "",
      invoiceHash: "",
      note: "",
      ammount :"",
      
      projectId: this.props.match.params.id,
      commitmentId: this.props.match.params.id,

      submitted: false
    });
  }

  render() {
    const {projectId, commitmentId} = this.state;
    return (
        <div className="container">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newPayment}>
             Create Another Payment
            </button>&nbsp;&nbsp;
            <Link  to={"/viewpayment/"+commitmentId} className="btn btn-success">View Payments</Link>&nbsp;&nbsp;
           
          </div>
        ) : (
            <div class="container">
       <h2>Create New SoV</h2><hr/>
       <div className="row">
       <div className="col-sm-6">
      
              <div className="form-group">
                <label htmlFor="title">Invoice :</label>
    
              <input
                type="text"
                className="form-control"
                id="invoice"
                required
                value={this.state.invoice}
                onChange={this.onChangeInvoice}
                name="invoice"
              />
              </div>
              <div className="form-group">
                <label htmlFor="contractCompany">Payment Method :</label>
             
                <input
                type="text"
                className="form-control"
                id="paymentMethod"
                required
                value={this.state.paymentMethod}
                onChange={this.onChangePaymentMethod}
                name="paymentMethod"
              />
              </div>
            
            <div className="form-group">
                <label htmlFor="status">Date :</label>
            
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
                <label htmlFor="defaultRetainage">Payment # :</label>
                <input
                type="text"
                className="form-control"
                id="paymentHash"
                required
                value={this.state.paymentHash}
                onChange={this.onChangePaymentHash}
                name="paymentHash"
              />
              </div>

              <div className="form-group">
                <label htmlFor="defaultRetainage">Invoice # :</label>
                <input
                type="text"
                className="form-control"
                id="invoiceHash"
                required
                value={this.state.invoiceHash}
                onChange={this.onChangeInvoiceHash}
                name="invoiceHash"
              />
              </div>
              <div className="form-group">
                <label htmlFor="defaultRetainage">Note :</label>
                <input
                type="text"
                className="form-control"
                id="note"
                required
                value={this.state.note}
                onChange={this.onChangeNote}
                name="note"
              />
              </div>

              <div className="form-group">
                <label htmlFor="defaultRetainage">Ammount :</label>
                <input
                type="text"
                className="form-control"
                id="ammount"
                required
                value={this.state.ammount}
                onChange={this.onChangeAmmount}
                name="ammount"
              />
              </div>
              </div>
<div className="col-sm-6">
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h5><strong>Step 1</strong><br/>Create SoV for the commitment</h5> </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 2</strong><br/>Save SoV</h6></TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot />
                 
                </TimelineSeparator>
                <TimelineContent><h6><strong>Step 3</strong><br/>View the SoVs for the Commitment</h6></TimelineContent>
              </TimelineItem>
            </Timeline>
            </div>

</div>
           
            <button onClick={this.savePayment} className="btn btn-success">
              Save
            </button>&nbsp;&nbsp;
            
           &nbsp;&nbsp;
            <br /><br /><br />
            </div>
        )}
          </div>


    );
  }
}
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
import cogoToast from "cogo-toast";

import EquipmentDataService from "./../../../services/equipment.service";
import EquipmentCategoryDataService from "./../../../services/equipment-category.service";

class NewEquip extends Component {

  constructor(props) {
    super(props);
    this.onChangeCode = this.onChangeCode.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeCondition = this.onChangeCondition.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveEquipment = this.saveEquipment.bind(this);
    this.retrieveEquipmentCategory = this.retrieveEquipmentCategory.bind(this);

    this.state = {
      categorys: [],
      code: "",
      date: "",
      condition: "",
      category: "",
      description: ""
    };
  }

  retrieveEquipmentCategory() {
    EquipmentCategoryDataService.getAll()
      .then(response => {
        this.setState({
          categorys: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

  }

  componentDidMount() {
    this.retrieveEquipmentCategory();
  }

  onChangeCode(e) {
    this.setState({
      code: e.target.value
    });
  }

  onChangeDate(e) {
    this.setState({
      date: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeCondition(e) {
    this.setState({
      condition: e.target.value
    });
  }

  onChangeCategory(e) {
    this.setState({
      category: e.target.value
    });
  }

  saveEquipment() {
    var data = {
      code: this.state.code,
      date: this.state.date,
      condition: this.state.condition,
      category: this.state.category,
      description: this.state.description

    };

    EquipmentDataService.create(data)
      .then(response => {
        this.setState({
          code: response.data.code,
          date: response.data.date,
          condition: response.data.condition,
          description: response.data.description,
          category: response.data.category,
        });
        console.log(response.data);
        cogoToast.success("Equipment Added successfully!");
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });

  }

  render() {
    const { categorys } = this.state;
    var today = new Date().toISOString().split('T')[0];
    return (
      <div>
        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">Add Equipment</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

              <div class="container">
                <div class="row">
                  <div class="col-6">
                    <label htmlFor="">Category</label>
                    <select
                      className="form-control"
                      name="category"
                      id="category"
                      onChange={this.onChangeCategory}>
                      <option value="--">- - </option>

                      {categorys && categorys.map((category, index) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div class="col-6">
                    <label htmlFor="">Number/Code</label>
                    <input
                      className="form-control"
                      type="text"
                      required
                      id="code"
                      value={this.state.code}
                      onChange={this.onChangeCode}
                      name="code" />
                  </div>
                </div>
              </div>

              <div class="container">
                <div class="row">
                  <div class="col-6">
                    <label htmlFor="">Date issued</label>
                    <input
                      className="form-control"
                      type="date"
                      id="date"
                      max={today}
                      value={this.state.date}
                      onChange={this.onChangeDate}
                      name="date" />
                  </div>

                  <div class="col-6">
                    <label htmlFor="">Condition</label>
                    <select
                      className="form-control"
                      name="condition"
                      id="condition"
                      value={this.state.condition}
                      onChange={this.onChangeCondition}>
                      <option value="Good">- - </option>
                      <option value="Good">Good(New)</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <label htmlFor="">Description</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  id="description"
                  value={this.state.description}
                  onChange={this.onChangeDescription}
                  name="description" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
                onClick={this.saveEquipment}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default NewEquip;
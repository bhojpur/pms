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
import cogoToast from "cogo-toast";

import AllocateEquip from './allocateEquipment.component';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import EquipmentDataService from "./../../../services/equipment.service";
import EquipmentCategoryDataService from "./../../../services/equipment-category.service";

class EquipDetails extends Component {
  constructor(props) {
    super(props);
    this.retrieveEquipment = this.retrieveEquipment.bind(this);
    this.retrieveEquipmentCategory = this.retrieveEquipmentCategory.bind(this);

    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onChangeProjectId = this.onChangeProjectId.bind(this);
    this.onChangeCondition = this.onChangeCondition.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);

    this.updateEquipment = this.updateEquipment.bind(this);
    this.deleteEquipment = this.deleteEquipment.bind(this);

    this.state = {
      // equipments: [],
      // categorys:[],
      // currentIndex: -1,
      // content: "",
      currentEquipment: {
        equipCode: this.props.match.params.code,
        categoryId: "",
        projectId: "",
        condition: "",
        description: ""
      },
      categorys: []

    };
  }

  componentDidMount() {
    this.retrieveEquipment(this.props.match.params.code);
    this.retrieveEquipmentCategory();
  }

  retrieveEquipment(id) {
    EquipmentDataService.get(id)
      .then(response => {
        this.setState({
          currentEquipment: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
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

  onChangeCategory(e) {
    const category = e.target.value
    this.setState(function (prevState) {
      return {
        currentEquipment: {
          ...prevState.currentEquipment,
          categoryId: category
        }
      };
    });
  }
  onChangeProjectId(e) {
    const projectId = e.target.value
    this.setState(function (prevState) {
      return {
        currentEquipment: {
          ...prevState.currentEquipment,
          projectId: projectId
        }
      };
    });
  }

  onChangeCondition(e) {
    const condition = e.target.value
    this.setState(function (prevState) {
      return {
        currentEquipment: {
          ...prevState.currentEquipment,
          condition: condition
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value
    this.setState(function (prevState) {
      return {
        currentEquipment: {
          ...prevState.currentEquipment,
          description: description
        }
      };
    });
  }

  updateEquipment() {
    var data = {
      equipmentCategoryId: this.state.currentEquipment.categoryId,
      condition: this.state.currentEquipment.condition,
      description: this.state.currentEquipment.description,
    };

    EquipmentDataService.update(this.props.match.params.code, data)
      .then(response => {
        this.setState(prevState => ({
          currentEquipment: {
            ...prevState.currentEquipment,
          }
        }));
        console.log(response.data);

      })
      .catch(e => {
        console.log(e);
      });
    cogoToast.success("Equipment updated successfully!");


  }
  deleteEquipment() {
    EquipmentDataService.delete(this.props.match.params.code)
      .then(response => {
        console.log(response.data);
        //this.props.history.push('/equipments');

      })
      .catch(e => {
        console.log(e);

      });
    cogoToast.success("Equipment deleted successfully!");
  }

  render() {
    const { equipCode, currentEquipment, id, categorys } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col" >
            <h2>EQUIPMENT DETAILS</h2>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" to="/home">
                Home
              </Link>
              <Link color="inherit" to={"/projectmanagementhome/" + id}>
                Core Dashboard
              </Link>
              <Link color="textPrimary" to={"/equipments/"} aria-current="page">
                Equipments
              </Link>
              <Link color="textPrimary" to={"/equipDetails/" + equipCode} aria-current="page">
                Equipments Details
              </Link>
            </Breadcrumbs>
          </div>
        </div>
        <hr />
        <br />

        <div>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <label htmlFor="">Number/Code</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  disabled
                  id="code"
                  name="code"
                  value={currentEquipment.code}
                />
              </div>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <label htmlFor="">Category</label>

                {categorys && categorys.map((category) => (
                  category.id === currentEquipment.equipmentCategoryId ?

                    <select
                      className="form-control"
                      name="category"
                      id="category"
                      onChange={this.onChangeCategory}>
                      <option value={currentEquipment.equipmentCategoryId} selected="selected" hidden="hidden">{category.name} </option>

                      {categorys && categorys.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </select> : ""
                ))}


              </div>

              <div class="col-6">
                <label htmlFor="">Assiged Project</label>
                <input
                  className="form-control"
                  type="text"
                  required
                  disabled
                  id="projectId"
                  name="projectId"
                  value={currentEquipment.projectId}
                  onChange={this.onChangeProjectId} />
              </div>

            </div>
          </div>

          <div class="container">
            <div class="row">
              <div class="col-6">
                <label htmlFor="">Date issued</label>
                <input
                  className="form-control"
                  type="text"
                  id="date"
                  name="date"
                  disabled
                  value={currentEquipment.date} />
              </div>

              <div class="col-6">
                <label htmlFor="">Condition</label>
                <select
                  className="form-control"
                  name="condition"
                  id="condition"
                  onChange={this.onChangeCondition}>
                  <option value={currentEquipment.condition} selected="selected" hidden="hidden">{currentEquipment.condition}</option>
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
              value={currentEquipment.description}
              onChange={this.onChangeDescription} />
          </div>
        </div>
        <br />
        <div className="text-right">
          <form>
            <button
              className="btn btn-danger mr-3"
              onClick={this.deleteEquipment}>
              Delete
            </button>
            {/*
                      <button  
                      className="btn btn-primary mr-3">
                        View Usage
                      </button>
*/}
            <button
              className="btn btn-primary mr-3"
              onClick={this.updateEquipment}>
              Update
            </button>

            <Link
              className="btn btn-success"
              to={"/equipments/1"}>
              Back
            </Link>
          </form>
        </div>

        {/* Allocate Equipment Starts */}
        <div className="modal fade" id="allocateEquip" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <AllocateEquip />
        </div>
        {/* Allocate Equipment Ends */}
      </div>
    );
  }
}
export default EquipDetails;
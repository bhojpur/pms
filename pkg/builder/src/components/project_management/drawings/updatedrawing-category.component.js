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
import DrawingCategoryDataService from "../../../services/drawing-category.service";
import { Breadcrumbs } from "@material-ui/core";
import cogoToast from "cogo-toast";

export default class UpdateDrawingCategory extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getDrawingCategory = this.getDrawingCategory.bind(this);
    this.updateDrawingCategory = this.updateDrawingCategory.bind(this);
    this.deleteDrawingCategory = this.deleteDrawingCategory.bind(this);

    this.state = {
      currentDrawingCategory: {
        id: null,
        title: "",
        description: "",
        projectId: "",
        
      },
      message: "",
      temp: this.props.match.params.pid,
      pid: this.props.match.params.id,
      
    };
  }

  componentDidMount() {
    this.getDrawingCategory(this.props.match.params.id);
    // this.retriveDrawingCategoryCategory(this.props.match.params.pid);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentDrawingCategory: {
          ...prevState.currentDrawingCategory,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentDrawingCategory: {
        ...prevState.currentDrawingCategory,
        description: description
      }
    }));
  }

  getDrawingCategory(id) {
    DrawingCategoryDataService.getOne(id)
      .then(response => {
        this.setState({
          currentDrawingCategory: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateDrawingCategory() {
    var data = {
      id: this.state.currentDrawingCategory.id,
      title: this.state.currentDrawingCategory.title,
      description: this.state.currentDrawingCategory.description,
    };
    if(this.state.currentDrawingCategory.title >= 6){ 
    DrawingCategoryDataService.update(this.state.currentDrawingCategory.id,data)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The drawing category content was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
      cogoToast.success("Drawing category updated successfully!");
    }else{
      cogoToast.error("Change Title into proper name length at least 6");
    }
  }

  deleteDrawingCategory() {    
    DrawingCategoryDataService.delete(this.state.currentDrawingCategory.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/drawing/'+this.state.pid)
      })
      .catch(e => {
        console.log(e);
      });
  }

    render() {
      const { currentDrawingCategory, temp,pid} = this.state;
  
      return (
        <div>
          {currentDrawingCategory ? (
            <div className="container">
              <h2>Update a DrawingCategory</h2>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">
                  Home
                </Link>
                <Link color="inherit" to={"/projectmanagementhome/"+pid}>
                  App Dashboard
                </Link>
                <Link color="inherit" to={"/drawing/"+pid}>
                  Drawing Home
                </Link>
                <Link color="textPrimary" to={"/updatedrawingcategory/"+pid+"/"+temp} aria-current="page">
                  Update Category / {temp}
                </Link>
              </Breadcrumbs>
              {/* <h4>DrawingCategory Id : {temp}</h4> */}
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentDrawingCategory.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentDrawingCategory.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
              </form>

              <button
                type="submit"
                className="btn btn-warning mr-2"
                onClick={this.updateDrawingCategory}
              >
                Update
              </button>
              <button
                className="btn btn-danger  mr-2"
                onClick={this.deleteDrawingCategory}
              >
                Delete
              </button>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a DrawingCategory...</p>
            </div>
          )}
        </div>
      );
  }
}
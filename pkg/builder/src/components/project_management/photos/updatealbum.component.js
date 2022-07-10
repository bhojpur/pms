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
import AlbumDataService from "../../../services/album.service";
import { Breadcrumbs } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class UpdateAlbum extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getAlbum = this.getAlbum.bind(this);
    this.updateAlbum = this.updateAlbum.bind(this);
    this.deleteAlbum = this.deleteAlbum.bind(this);

    this.state = {
      currentAlbum: {
        id: null,
        title: "",
        description: "",
        projectId: "",
        
      },
      message: "",
      temp: this.props.match.params.id,
      pid: this.props.match.params.pid,
      
    };
  }

  componentDidMount() {
    this.getAlbum(this.props.match.params.id);
    // this.retriveAlbumCategory(this.props.match.params.pid);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function(prevState) {
      return {
        currentAlbum: {
          ...prevState.currentAlbum,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;
    
    this.setState(prevState => ({
      currentAlbum: {
        ...prevState.currentAlbum,
        description: description
      }
    }));
  }

  getAlbum(id) {
    AlbumDataService.getOne(id)
      .then(response => {
        this.setState({
          currentAlbum: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateAlbum() {
    var data = {
      id: this.state.currentAlbum.id,
      title: this.state.currentAlbum.title,
      description: this.state.currentAlbum.description,
    };

    AlbumDataService.update(this.state.currentAlbum.id,data)
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The album content was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteAlbum() {    
    AlbumDataService.delete(this.state.currentAlbum.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/photos/'+this.state.pid)
      })
      .catch(e => {
        console.log(e);
      });
  }

    render() {
      const { pid,currentAlbum, temp} = this.state;
  
      return (
        <div>
          {currentAlbum ? (
            <div className="container">
              <h2>Update a Album</h2>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/home">
                  Home
                </Link>
                <Link color="inherit" to={"/projectmanagementhome/"+pid}>
                  App Dashboard
                </Link>
                <Link color="textPrimary" to={"/photos/"+pid}>
                  Photos Home
                </Link>
                <Link color="textPrimary" to={"/updatephoto/"+pid+"/"+temp} aria-current="page">
                  Update Photo / {temp}
                </Link>
              </Breadcrumbs>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentAlbum.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentAlbum.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
              </form>

              <button
                type="submit"
                className="btn btn-warning mr-2"
                onClick={this.updateAlbum}
              >
                Update
              </button>
              <button
                className="btn btn-danger  mr-2"
                onClick={this.deleteAlbum}
              >
                Delete
              </button>
              <p>{this.state.message}</p>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Album...</p>
            </div>
          )}
        </div>
      );
  }
}
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
import { Modal } from "react-bootstrap";

import EquipmentDataService from "./../../../services/equipment.service";

class AllocateEquip extends Component {
    constructor(props) {
        super(props);
        this.retrieveProjects = this.retrieveProjects.bind(this);
        this.updateEquipment = this.updateEquipment.bind(this);
        this.state = {
            currentEquipment: {
                projectId: this.props.projectId,
                code: this.props.code
            },
            projectId: this.props.projectId,
            code: this.props.code,
            projects: []
        }
    };

    componentDidMount() {
        this.retrieveProjects();
    }

    retrieveProjects() {
        EquipmentDataService.getAllProjects()
            .then(response => {
                this.setState({
                    projects: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateEquipment() {
        var data = {
            projectId: null,
        };
        EquipmentDataService.update(this.props.code, data)
            .then(response => {
                this.setState(prevState => ({
                    currentEquipment: {
                        ...prevState.currentEquipment,
                    }
                }));
                console.log(response.data);
                window.location.reload();
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { code, projectId, projects } = this.state;
        return (
            <div>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">

                                {projects && projects.map((project) => (
                                    projectId === project.id ?
                                        <p>Are you sure you want to release equipment code: {code} from project {project.title}</p> : null
                                ))}

                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.updateEquipment}>
                        Yes
                    </button>
                </Modal.Footer>
            </div>

        );
    }
}
export default AllocateEquip;
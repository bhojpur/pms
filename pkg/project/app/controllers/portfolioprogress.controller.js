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

const db = require("./../models/index.js");
const Progress = db.portfolioprogress;
const Op = db.Sequelize.Op;

// Create and Save a new Progress 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Progress Point Time content can't be empty!"
    });
    return;
  }

  // Create a Progress
  const milestone = {
    name: req.body.name,
    progress: req.body.progress,
    projectId: req.body.projectId,
  }

  // Save Progress in the database
  Progress.create(milestone)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Progress."
      });
    });
};

// Retrieve all Departments from the database for a certain project.
exports.findAll = (req, res) => {
    const id = req.params.id;
  
    Progress.findAll({ where: {
      projectId: id
    }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project Departments with id=" + id
        });
      });  
  };

// Find a single Progress with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Progress.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Progress with id=" + id
        });
      });  
};

// Update a Progress by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Progress.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Progress was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Progress with id=${id}. Maybe Progress was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Progress with id=" + id
        });
      });
};

// Delete a Progress with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Progress.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Progress was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Progress with id=${id}. Maybe Progress was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Progress with id=" + id
        });
      });
};
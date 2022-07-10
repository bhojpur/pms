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
const Milestone = db.milestones;
const Op = db.Sequelize.Op;

// Create and Save a new Milestone 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title && !req.body.description) {
    res.status(400).send({
      message: "Milestone content can't be empty!"
    });
    return;
  }

  // Create a Milestone
  const milestone = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    completed: req.body.completed ? req.body.completed : false,
    projectId: req.body.projectId,
  }

  // Save Milestone in the database
  Milestone.create(milestone)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Milestone."
      });
    });
};

// Retrieve all Departments from the database for a certain project.
exports.findAll = (req, res) => {
    const id = req.params.id;
  
    Milestone.findAll({ where: {
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

// Find a single Milestone with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Milestone.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Milestone with id=" + id
        });
      });  
};

// Update a Milestone by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Milestone.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Milestone was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Milestone with id=${id}. Maybe Milestone was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Milestone with id=" + id
        });
      });
};

// Delete a Milestone with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Milestone.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Milestone was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Milestone with id=${id}. Maybe Milestone was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Milestone with id=" + id
        });
      });
};

// Find all published Milestones
exports.findAllComplete = (req, res) => {
  const id = req.params.id;
  Milestone.findAll({ where: { completed: true, projectId: id } })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving projects."
    });
  });
};
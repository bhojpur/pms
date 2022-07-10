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

const db = require("./../models/index");
const Project = db.projects;
const DrawingCategory = db.drawingcategory;

// create a new drawing category
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title && !req.body.description) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Project
  const drawingcategory = {
    title: req.body.title,
    description: req.body.description,
    projectId: req.body.projectId,
  };

  // Save Project in the database
  DrawingCategory.create(drawingcategory)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    });
};
// Get drawings category for a given project
exports.findAll = (req, res) => {
    const id = req.params.id;
  
    DrawingCategory.findAll({ where: {
      projectId: id
    }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project Drawings Ctaegory with id=" + id
        });
      });  
  };

//Find a single drawing by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  DrawingCategory.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Drawing Category with id=" + id
      });
    });  
};


// Update a DrawingCategory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  DrawingCategory.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DrawingCategory was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DrawingCategory with id=${id}. Maybe DrawingCategory was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DrawingCategory with id=" + id
      });
    });
};

// Delete a DrawingCategory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  DrawingCategory.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DrawingCategory was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete DrawingCategory with id=${id}. Maybe DrawingCategory was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete DrawingCategory with id=" + id
      });
    });
};

// Find recent drawing category
exports.recent = (req, res) => {
  const id = req.params.id;

  DrawingCategory.findAll({order: [['id', 'DESC']], limit: 5})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving recent drawingcategory"
      });
    });  
};

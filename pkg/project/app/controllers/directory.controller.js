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
const Directory = db.directory;

// create a new album
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title && !req.body.description) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Album
  const album = {
    title: req.body.title,
    description: req.body.description,
    projectId: req.body.projectId,
  };

  // Save Directory in the database
  Directory.create(album)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the directory."
      });
    });
};

// Get all albums for a given project
exports.findAll = (req, res) => {
    const id = req.params.id;
  
    Directory.findAll({ where: {
      projectId: id
    }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving directiry with id=" + id
        });
      });  
  };

//Find a single drawing by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Directory.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Directory with id=" + id
      });
    });  
};

// Update a Directory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Directory.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Directory was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Directory with id=${id}. Maybe Directory was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Directory with id=" + id
      });
    });
};

// Delete a Directory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Directory.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Directory was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Directory with id=${id}. Maybe Directory was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Directory with id=" + id
      });
    });
};

// Find recent documents
exports.recent = (req, res) => {
  const id = req.params.id;

  Directory.findAll({order: [['id', 'DESC']], limit: 5})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving directiry with id=" + id
      });
    });  
};
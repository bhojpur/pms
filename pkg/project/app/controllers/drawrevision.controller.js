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
const DrawRevision = db.drawrevision;

// create a drawrevision
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a DrawRevision
  const drawrevision = {
    username: req.body.username,
    description: req.body.description,
    drawingId: req.body.drawingId,
  };

  // Save DrawRevision in the database
  DrawRevision.create(drawrevision)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the DrawRevision."
      });
    });
};

// Get drawings for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;

  DrawRevision.findAll({ where: {
    drawingId: id
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DrawRevision Drawings with id=" + id
      });
    });  
};

// Get drawings for a given category
exports.findAllCat = (req, res) => {
  const id = req.params.id;

  DrawRevision.findAll({ where: {
    category: id
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DrawRevision Drawings with id=" + id
      });
    });  
};
//Find a single drawrevision by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  DrawRevision.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DrawRevision with id=" + id
      });
    });  
};

// Update a DrawRevision by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  DrawRevision.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DrawRevision was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DrawRevision with id=${id}. Maybe DrawRevision was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DrawRevision with id=" + id
      });
    });
};

// Delete a DrawRevision with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  DrawRevision.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DrawRevision was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete DrawRevision with id=${id}. Maybe DrawRevision was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete DrawRevision with id=" + id
      });
    });
};
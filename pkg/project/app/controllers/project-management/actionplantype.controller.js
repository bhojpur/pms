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

const db = require("./../../models/index");
const ActionPlanType = db.actionplantype;
const sequelize = require("sequelize");
const Op = db.Sequelize.Op;

// create a drawing
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title && !req.body.description) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a ActionPlanType
  const actionplantype = {
    title: req.body.title,
    description: req.body.description,
    projectId: req.body.projectId,
  };
  // Save ActionPlanType in the database
  ActionPlanType.create(actionplantype)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ActionPlanType."
      });
    });
};

// Update a ActionPlanType by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  ActionPlanType.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlanType was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update ActionPlanType with id=${id}. Maybe ActionPlanType was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating ActionPlanType with id=" + id
    });
  });
};

// Delete a ActionPlanType with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ActionPlanType.update({isDeleted: 1}, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlanType was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete ActionPlanType with id=${id}. Maybe ActionPlanType was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete ActionPlanType with id=" + id
    });
  });
};

//Find a single drawing by Id
exports.findOne = (req, res) => {
  const title = req.params.id;
  ActionPlanType.findAll({ where: {
    title: id,
    isDeleted: 0
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlanType with id=" + id
    });
  });  
};

// Get drawings for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;
  ActionPlanType.findAll({ where: {
    projectId: id,
    isDeleted: 0
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlanType Drawings with id=" + id
    });
  });  
};

// Search All
exports.searchAll = (req, res) => {
  const title = req.query.title;
  const id = req.params.id;
  var condition = title ? { title: { [Op.like]: `%${title}%` }, projectId: id } : null;
  ActionPlanType.findAll({ where: condition })
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
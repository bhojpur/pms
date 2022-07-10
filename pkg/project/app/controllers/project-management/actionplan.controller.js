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

const db = require("./../../models/index.js");
const ActionPlan = db.actionplan;
const Op = db.Sequelize.Op;

// Create and Save a new ActionPlan
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title && !req.body.description) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a ActionPlan
  const actionplan = {
    title: req.body.title,    
    description: req.body.description,
    actiontype: req.body.actiontype,
    location: req.body.location,
    planmanager: req.body.planmanager,
    isApproved: req.body.isApproved ? req.body.isApproved : false,
    isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
    projectId: req.body.projectId
  };
  // Save ActionPlan in the database
  ActionPlan.create(actionplan)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ActionPlan."
    });
  });
};

// Update a ActionPlan by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  ActionPlan.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlan was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update ActionPlan with id=${id}. Maybe ActionPlan was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating ActionPlan with id=" + id
    });
  });
};

// Delete a ActionPlan with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  ActionPlan.update({
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlan was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete ActionPlan with id=${id}. Maybe ActionPlan was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete ActionPlan with id=" + id
    });
  });
};

// Find a single ActionPlan with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  ActionPlan.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlan with id=" + id
    });
  });  
};

//get the ActionPlan action
exports.findAll = (req, res) => {
  const id = req.params.id;
  ActionPlan.findAll({ where: {
    projectId: id,
    isDeleted: 0
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlan Drawings with id=" + id
    });
  });  
};

// Get action plan for a given projectId
exports.findAlltype = (req, res) => {
  const type = req.params.id;
  ActionPlan.findAll({ where: {
    actiontype: type,
    isDeleted: 0
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving acltion plan items with aid=" + id
    });
  });  
};

// Find all published Action Plan
exports.findAllApproved = (req, res) => {
  const id = req.params.id;
  ActionPlan.findAll({ where: { isApproved: true }, projectId: id })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tutorials."
    });
  });
};

// Search All
exports.SearchAll = (req, res) => {
  const name = req.query.name;
  const id = req.params.id;
  var condition = name ? { name: { [Op.like]: `%${name}%` }, projectId: id } : null;
  ActionPlan.findAll({ where: condition })
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
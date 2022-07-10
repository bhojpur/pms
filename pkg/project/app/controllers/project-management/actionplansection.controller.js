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
const ActionPlanSection = db.actionplansection;
const Op = db.Sequelize.Op;

// Create and Save a new ActionPlanSection
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a ActionPlanSection
  const actionplansection = {
    title: req.body.title,
    acceptance: req.body.acceptance,
    duedate: req.body.duedate,
    reftype: req.body.reftype,
    refid: req.body.refid,
    actionplanId: req.body.actionplanId
  };
  // Save ActionPlanSection in the database
  ActionPlanSection.create(actionplansection)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ActionPlanSection."
    });
  });
};

// Update a ActionPlanSection by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  ActionPlanSection.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlanSection was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update ActionPlanSection with id=${id}. Maybe ActionPlanSection was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating ActionPlanSection with id=" + id
    });
  });
};

// Delete a ActionPlanSection with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  ActionPlanSection.update({isDeleted: 1}, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlanSection was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete ActionPlanSection with id=${id}. Maybe ActionPlanSection was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete ActionPlanSection with id=" + id
    });
  });
};

// Find a single ActionPlanSection with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  ActionPlanSection.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlanSection with id=" + id
    });
  });  
};

//get the ActionPlanSection action
exports.findAll= (req, res) => {
  const id = req.params.id;
  ActionPlanSection.findAll({ where: {
    actionplanId: id,
    isDeleted: 0
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Action Plan Section with id=" + id
    });
  });  
};
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
const ActionPlanItem = db.actionplanitem;
const Op = db.Sequelize.Op;

// Create and Save a new ActionPlanItem
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a ActionPlanItem
  const actionplanitem = {
    title: req.body.title,
    description: req.body.description,
    assigner: req.body.assigner,
    isCompleted: req.body.isCompleted ? req.body.isCompleted : false,
    isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
    actionplansectionId: req.body.actionplansectionId
  };
  // Save ActionPlanItem in the database
  ActionPlanItem.create(actionplanitem)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ActionPlanItem."
    });
  });
};

// Update a Action Plan Item by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  ActionPlanItem.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlanItem was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update ActionPlanItem with id=${id}. Maybe ActionPlanItem was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating ActionPlanItem with id=" + id
    });
  });
};

// Delete a Action Plan Item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  ActionPlanItem.update({isDeleted: 1}, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "ActionPlanItem was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete ActionPlanItem with id=${id}. Maybe ActionPlanItem was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete ActionPlanItem with id=" + id
    });
  });
};

// Find a single ActionPlanItem with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  ActionPlanItem.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlanItem with id=" + id
    });
  });  
};

//get the ActionPlanItem action
exports.findAll = (req, res) => {
  const id = req.params.id;
  ActionPlanItem.findAll({ where: {
    projectId: id,
    isDeleted: 0
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving ActionPlanItem Drawings with id=" + id
    });
  });  
};

// Find all published ActionPlanItem
exports.findAllCompleted = (req, res) => {
    const id = req.params.id;
    ActionPlanItem.findAll({ where: {
      isCompleted: true,
      isDeleted: 0,
      actionplansectionId: id } })
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

//get the ActionPlanSection action
exports.findSection= (req, res) => {
  const actionplansectionId = req.params.id;
  db.sequelize.query('select * FROM actionplanitem where actionplansectionId = '+actionplansectionId+' and isDeleted=0;',
  { type: db.sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Action Plan Section with id=" + actionplansectionId
    });
  });  
};
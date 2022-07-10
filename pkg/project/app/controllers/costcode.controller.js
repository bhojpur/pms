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
const CostCode = db.costcodes;
const sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');

// create a cost code 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.costCode) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Budget Line Item
  const costcode = {
    costCode: req.body.costCode,
    // category: req.body.category,
    date: req.body.date,
    published: req.body.published,
    //directCosts:req.body.directCosts,
    //commitedCosts:req.body.commitedCosts,
    //currentBudget: req.body.currentBudget,
    //revisedBudget: req.body.revisedBudget,
   
    projectId: req.body.projectId,
  };

  // Save Budget Line in the database
  CostCode.create(costcode)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Budget Line Item."
      });
    });
};

// Get budget line items for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;
  const published = true;

  CostCode.findAll({where: {
    projectId: id,
    published: published
  }}
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Budget with id=" + id
      });
    });  
};

//Find a single budget by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  CostCode.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Budget with id=" + id
      });
    });  
};

//update a budget

exports.update = (req, res) => {

  const id = req.params.id;

  CostCode.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Budget Line Item was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Budget Line Item with id=${id}. Maybe Budget Line Item was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Budget Line Item with id=" + id
      });
    });
};

exports.findEverything = (req, res) => {
  const published = true;

  CostCode.findAll({where: {
    published: published
  }}
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Budget"
      });
    });  
};

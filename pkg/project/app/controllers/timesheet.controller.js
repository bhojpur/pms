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
const Timesheet = db.timesheets;
const Op = db.Sequelize.Op;

// Create and Save a new timesheet
exports.create = (req, res) => {
  // Validate request
  if (!req.body.date) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a timesheet
  const timesheet = {
    date: req.body.date,
    status: req.body.status,
    projectId: req.body.projectId,
  };
  // Save timesheet in the database
  Timesheet.create(timesheet)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the timesheet."
      });
    });
};

// Retrieve all timesheets from a given project
exports.findAll = (req, res) => {

  db.sequelize.query(
    'SELECT timesheet.id,timesheet.date,timesheet.status,timesheet.aprrovedId,users.username FROM timesheet LEFT JOIN users ON users.id=timesheet.aprrovedId WHERE timesheet.projectId=:id',
    { replacements: { id: req.params.id }, type: db.sequelize.QueryTypes.SELECT })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data"
      });
    });
};

// Find a single timesheet with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Timesheet.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving timesheet with id=" + id
      });
    });
};

// Update a timesheet by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Timesheet.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "timesheet was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update timesheet with id=${id}. Maybe timesheet was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating timesheet with id=" + id
      });
    });
};

exports.getUserDetails = (req, res) => {

  db.sequelize.query(
    'SELECT users.id,users.username FROM users',
    { replacements: {}, type: db.sequelize.QueryTypes.SELECT })
    .then(data => {
      res.send(data);
    })
}

exports.findAllDate = (req, res) => {
  const date = req.query.date;
  var condition = date ? { date: { [Op.like]: `%${date}%` } } : null;

  Timesheet.findAll({ where: condition })
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
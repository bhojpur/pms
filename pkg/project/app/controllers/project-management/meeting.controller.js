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

const db = require("../../models/index.js");
const Meeting = db.meetings;
const Op = db.Sequelize.Op;

// Create and Save a new Meeting
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Meeting
  const mt = {
    name: req.body.name,
    category: req.body.category,
    date: req.body.date,
    time: req.body.time,
    location: req.body.location,
    description: req.body.description,
    status: req.body.status,
    isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
    projectId: req.body.projectId
  };
  // Save Meeting in the database
  Meeting.create(mt)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Meeting."
      });
    });
};

// Update a Meeting by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Meeting.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Meeting was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Meeting with id=${id}. Maybe Meeting was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Meeting with id=" + id
      });
    });
};

// Delete a Meeting with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Meeting.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Meeting was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Meeting with id=${id}. Maybe Meeting was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Meeting with id=" + id
      });
    });
};


// Find a single Meeting with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Meeting.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Meeting with id=" + id
      });
    });
};

// Find all meetings
exports.findAll = (req, res) => {
  Meeting.findAll({
    where: {
      isDeleted: 0
    },
    order: [['status', 'DESC'], ['date', 'DESC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving meetings."
      });
    });
};

// Find all meetings to schedule
exports.getMeetings = (req, res) => {

  db.sequelize.query(
    'SELECT date AS startDate, name AS title WHERE projectId=:id',
    { replacements: { id: req.params.id }, type: db.sequelize.QueryTypes.SELECT })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving meetings."
      });
    });
};


exports.findMetinCategory = (req, res) => {
  const id = req.params.id;
  db.sequelize.query('select * from meetings where projectId = ' + id + ' and isDeleted = 0 order by id desc limit 1;',
    { type: db.sequelize.QueryTypes.SELECT })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving meetings."
      });
    });
};
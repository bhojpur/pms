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
const Schedule = db.schedule;

// Create and Save a new schedule
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a schedule
  const schedule = {
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    userId: req.body.userId,
  };
  // Save schedule in the database
  Schedule.create(schedule)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the schedule."
      });
    });
};

// Retrieve all schedules from a given user
exports.findAll = (req, res) => {
    const id = req.params.id;
      
    Schedule.findAll({ where: {
      userId: id
    }})
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

// Update a schedules by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Schedule.update(req.body, {
      where: { id:id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Schedule was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Schedule with id=${id}. Maybe Schedule was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Schedule with id=" + id
        });
      });
};

// Delete a schedule with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Schedule.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Schedule was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Schedule with id=${id}. Maybe Schedule was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Schedule with id=" + id
        });
      });
};
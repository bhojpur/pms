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
const WorkedHours = db.workedHours;
const Op = db.Sequelize.Op;

// Create and Save a new workedhours
exports.create = (req, res) => {
  // Validate request
  if (!req.body.workerId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a workedHours
  const workedHours = {
    start: req.body.date,
    lunch_start: req.body.lunch_start,
    lunch_stop: req.body.lunch_stop,
    tea_start: req.body.tea_start,
    tea_end: req.body.tea_end,
    stop: req.body.stop,
    timesheetId: req.body.timesheetId,
    workerWId: req.body.workerId

  };
  // Save workedHours in the database
  WorkedHours.create(workedHours)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the workedHours."
      });
    });
};

exports.getTimesheetDetails = (req, res) => {

  db.sequelize.query(
    'SELECT worked_hours.workerWId,worked_hours.location,worked_hours.start, worked_hours.lunch_start,worked_hours.lunch_stop,worked_hours.tea_start, worked_hours.tea_stop,worked_hours.stop, worker.firstName, worker.lastName FROM worked_hours INNER JOIN worker ON worker.wId=worked_hours.workerWId WHERE worked_hours.timesheetId=:id',
    { replacements: { id: req.params.id }, type: db.sequelize.QueryTypes.SELECT })
    .then(data => {
      res.send(data);
    })
}

// Update a workedhours by the id in the request
exports.update = (req, res) => {
  const tid = req.params.tid;
  const wid = req.params.wid;

  WorkedHours.update(req.body, {
    where: { workerWId: wid, timesheetId: tid }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "workedhours was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update workedhours with id=${wid}. Maybe workedhours was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating workedhours with id=" + wid
      });
    });
};

/*
// Retrieve all workers from a given project
exports.findAll = (req, res) => {
    //const id = req.query.id;

    Worker.findAll(/*{ where: {
      projectId: id
   // }}*/ /*)
.then(data => {
res.send(data);
})
.catch(err => {
res.status(500).send({
message:
err.message || "Some error occurred while retrieving data"
});
});
};*/
/*
// Find a single crew with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    crew.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving crew with id=" + id
        });
      });
};*/

/*
// Delete a crew with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    crew.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "crew was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete crew with id=${id}. Maybe crew was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete crew with id=" + id
        });
      });
};*/

/*
// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    crew.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all tutorials."
          });
        });
};*/
/*
// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    equipment.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};*/
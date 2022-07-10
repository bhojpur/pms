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
const MeetingCategory = db.meetingcategory;

// create a new punch list types
exports.create = (req, res) => {
  // Validate request
  if (!req.body.overview) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Punch List Types
  const plt = {
    overview: req.body.overview,
    description: req.body.description,
    isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
    projectId: req.body.projectId
  };
  // Save Punch List Type in the database
  MeetingCategory.create(plt)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the punch list types."
    });
  });
};

// Update a MeetingCategory by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  MeetingCategory.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "MeetingCategory was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update MeetingCategory with id=${id}. Maybe MeetingCategory was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating MeetingCategory with id=" + id
    });
  });
};

// Delete a MeetingCategory with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  MeetingCategory.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "MeetingCategory was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete MeetingCategory with id=${id}. Maybe MeetingCategory was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete MeetingCategory with id=" + id
    });
  });
};

// Find a single punch list by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  MeetingCategory.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Punch List Types with id=" + id
    });
  });  
};

// Get punch list types for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;
  MeetingCategory.findAll({ where: {
    projectId: id
  }})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Project Punch List Types with id=" + id
    });
  });  
};
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
const MeetingAttendees = db.meetingattendees;
const Op = db.Sequelize.Op;

// Create and Save a new MeetingAttendees
exports.create = (req, res) => {
    // Validate request
    if (!req.body.overview) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    // Create a MeetingAttendees
    const MeetingAttendees = {
        overview: req.body.overview,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        status: req.body.status,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
        projectId: req.body.projectId
    };
    // Save MeetingAttendees in the database
    MeetingAttendees.create(MeetingAttendees)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the MeetingAttendees."
        });
    });
};

// Update a MeetingAttendees by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    MeetingAttendees.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
        res.send({
            message: "MeetingAttendees was updated successfully."
        });
        } else {
        res.send({
            message: `Cannot update MeetingAttendees with id=${id}. Maybe MeetingAttendees was not found or req.body is empty!`
        });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating MeetingAttendees with id=" + id
        });
    });
};

// Find all meetingattendees
exports.findAll = (req, res) => {
    MeetingAttendees.findAll({ where: { 
        isDeleted: 0
    }})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving meetingattendees."
        });
    });
};
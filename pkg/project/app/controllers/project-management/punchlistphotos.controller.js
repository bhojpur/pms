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
const PLPhotos = db.plphotos;
const Op = db.Sequelize.Op;

// Create and Save a new PL Photos 
exports.create = (req, res) => {
  // Validate request
    if (!req.body.name) {
        res.status(400).send({
        message: "PLPhotos content can't be empty!"
        });
        return;
    }

    // Create a PL Photos
    const plphoto = {
        name: req.body.name,
        description: req.body.description,
        punchlistNo: req.body.punchlistNo
    }

    // Save PL Photos in the database
    PLPhotos.create(plphoto)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the PL Photos."
        });
    });
};

// Retrieve all PL Photoss from the database for a certain project.
exports.findAll = (req, res) => {
    const id = req.params.id;
  
    PLPhotos.findAll({ where: {
        projectId: id
    }})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project PL Photoss with id=" + id
        });
    });  
};

// Find a single PLPhotos with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Project.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving PL Photos with id=" + id
        });
    });  
};
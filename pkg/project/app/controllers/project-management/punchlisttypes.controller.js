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
const pltypes = db.pltypes;

// create a new punch list types
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Punch List Types
  const plt = {
    title: req.body.title,
    description: req.body.description,
    projectId: req.body.projectId
  };
  // Save Punch List Type in the database
  pltypes.create(plt)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the punch list types."
    });
  });
};

// Get punch list types for a given project
exports.findAll = (req, res) => {
    const id = req.params.id;
    pltypes.findAll({ where: {
      projectId: id,
      isDeleted: 0
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

// Find a single punch list by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  pltypes.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Punch List Types with id=" + id
      });
    });  
};

exports.findType = (req, res) => {
  const pliid = req.params.pliid;
  const id = req.params.id;
  db.sequelize.query('select pt.* FROM pltypes pt where id = (select type from punchlist where no = '+pliid+' and projectId = '+id+') and projectId='+id+';',
  { type: db.sequelize.QueryTypes.SELECT})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Punch List Types with id=" + id
    });
  });  
};
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
const Punchlist = db.punchlist;

// Create and Save a new Punchlist
exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a Punchlist
    const pl = {
        status: req.body.status,
        duedate: req.body.duedate,
        title: req.body.title,
        type: req.body.type,
        location: req.body.location,
        // punchmanager: req.body.punchmanager,
        // assignee: req.body.assignee,
        description: req.body.description,
        projectId: req.body.id
    };
    // Save Punchlist in the database
    Punchlist.create(pl)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Punch list."
        });
    });
};

// Retrieve all punchlist from the database.
exports.findAllintype = (req, res) => {
    const id = req.params.id;
    Punchlist.findAll({ where: {
        type: id
    }})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Punch List Items with category type=" + id
        });
    });
};

// Get punch list types for a given project
exports.findAll = (req, res) => {
    const id = req.params.id;
    Punchlist.findAll({ where: {
        projectId: id,
        isDeleted: 0
    }})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Punch List Items with id=" + id
        });
    });  
};

// Find a single Punchlist with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Punchlist.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message: "Error retrieving punch list with no=" + id
        });
    });  
};

exports.findLastOne = (req,res) =>{
    Punchlist.findAll({ where: { 
        isDeleted: 0
    },
        order: [['no', 'DESC']],
        limit: 1
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
    res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving punch lists."
        });
    });
}

// Get drawings for a given category
exports.findAllbyStatus = (req, res) => {
    const status = req.params.status;
    const projectId = req.params.pid;
    Punchlist.findAll({ where: {
      projectId: projectId,
      status: status
    }})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Complete Drawings with id=" + id
        });
    });  
};

// Update a equipment by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Punchlist.update(req.body, {
      where: { no: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "equipment was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update equipment with id=${id}. Maybe equipment was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating equipment with id=" + id
        });
    });
};

// Delete a Punchlist with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Punchlist.update(req.body, {
      where: { no: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Punchlist was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Punchlist with id=${id}. Maybe Punchlist was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Punchlist with id=" + id
      });
    });
  };
  
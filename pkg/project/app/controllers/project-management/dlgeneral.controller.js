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

const db = require("./../../models/index.js");
const DLGeneral = db.dlgeneral;
const Op = db.Sequelize.Op;

// Create and Save a new DLGeneral
exports.create = (req, res) => {
    // Validate request
    if (!req.body.date) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }
    // Create a DLGeneral
    const dlgeneral = {
        date: req.body.date,   
        question: req.body.question,
        isHappended: req.body.isHappended ? req.body.isHappended : false,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : false,
        projectId: req.body.projectId
    };
    // Save DLGeneral in the database
    DLGeneral.create(dlgeneral)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the DLGeneral."
        });
    });
};

// Update a DLGeneral by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    DLGeneral.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
        res.send({
            message: "DLGeneral was updated successfully."
        });
        } else {
        res.send({
            message: `Cannot update DLGeneral with id=${id}. Maybe DLGeneral was not found or req.body is empty!`
        });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: "Error updating DLGeneral with id=" + id
        });
    });
};

// Delete a DLGeneral with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    DLGeneral.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
        res.send({
            message: "DLGeneral was deleted successfully!"
        });
        } else {
        res.send({
            message: `Cannot delete DLGeneral with id=${id}. Maybe DLGeneral was not found!`
        });
        }
    })
    .catch(err => {
        res.status(500).send({
        message: "Could not delete DLGeneral with id=" + id
        });
    });
};

// Find a single DLGeneral with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    DLGeneral.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving DLGeneral with id=" + id
        });
    });  
};

//get the DLGeneral action
exports.findAll = (req, res) => {
    const id = req.params.id;
    DLGeneral.findAll({ where: {
        projectId: id,
        isDeleted: 0
    }})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
         message: "Error retrieving DLGeneral Drawings with id=" + id
        });
    });  
};

//get the AccidentLog in a week
exports.findAllweek = (req, res) => {
    const id = req.params.id;
    db.sequelize.query('select * FROM dlgeneral WHERE projectId = '+id+' AND date > date_sub(now(), interval 1 week) AND isDeleted = 0;',
    { type: db.sequelize.QueryTypes.SELECT})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving AccidentLog Drawings with id=" + id
        });
    });  
};

exports.findToday = (req, res) => {
    const id = req.params.id;
    db.sequelize.query('select * from dlgeneral where projectId = '+id+' and date=now() AND isDeleted = 0;',
    { type: db.sequelize.QueryTypes.SELECT})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving AccidentLog Drawings with id=" + id
        });
    });  
};
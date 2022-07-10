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

const db = require("../models/index.js");
const EmployeeDesignation = db.employeedesignation;
const Op = db.Sequelize.Op;

// create a empdes
exports.create = (req, res) => {
    // Validate request
    if (!req.body.employeeid && !req.body.designationid && !req.body.designation) {
      res.status(400).send({
        message: "Assigning incorrect! Check employeeid and designationid!"
      });
      return;
    }
  
    // Create a ProjectUser
    const empdes = {
        employeeid: req.body.employeeid,
        designationid: req.body.designationid,
        designation: req.body.designation
    };
  
    // Save ProjectUser in the database
    EmployeeDesignation.create(empdes)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the employeedesignations."
        });
      });
};

// Get drawings for a given project
exports.findAll = (req, res) => {

    EmployeeDesignation.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving EmployeeDesignations"
        });
    });  
};

//Find the designations of a single guy
exports.findDesforEmployee = (req, res) => {
    const id = req.params.employeeid;

    EmployeeDesignation.findAll({
        attributes: ['designation'],
        where: {
            employeeid: id
          }
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Employee designations for id=" + id
        });
    });  
};

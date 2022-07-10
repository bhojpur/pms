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
const Sub = db.subcontractor;
const Op = db.Sequelize.Op;

// Create and Save a new subcontractor
exports.create = (req, res) => {
  // Validate request
  // if (!req.body.companyName) {
  //   res.status(400).send({
  //     message: "company name can not be empty!",
  //   });
  //   return;
  // }

  // Create a subcontractor
  const subcontractor = {
    id: req.body.id,
    companyName: req.body.companyName,
    type: req.body.type,
    contactNo: req.body.contactNo,
    email: req.body.email,
    contactPersonName: req.body.contactPersonName
  };

  // Save vendor in the database
  Sub.create(subcontractor)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating subcontractor."
      });
    });
};

// Retrieve all subcontractors from the database.
exports.findAll = (req, res) => {
    const Id = req.query.id;
    //var condition = 
  
    Sub.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving subcontractors."
        });
      });
};

// Find a single sub with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Sub.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving sub with id=" + id
        });
      });  
};

// Find a sub similar to name
exports.findOne = (req, res) => {
  const id = req.params.id;

  Sub.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Sub with id=" + id
      });
    });  
};

//
exports.findLastOne = (req,res) =>{
  Sub.findAll({
    limit: 1,
    order: [['id', 'DESC']]
  })
  .then(data => {
   res.send(data);
 })
 .catch(err => {
   res.status(500).send({
     message:
       err.message || "Some error occurred while retrieving Subs."
   });
 });
}

// Update a Sub by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Sub.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Subcontractor was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Sub with id=${id}. Maybe Sub was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Sub with id=" + id
        });
      });
};

// Delete a Sub with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Sub.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Sub was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Sub with id=${id}. Maybe Sub was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Sub with id=" + id
        });
      });
};

// Delete all Sub from the database.
exports.deleteAll = (req, res) => {
    Sub.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} Subs were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all Subs."
          });
        });
};
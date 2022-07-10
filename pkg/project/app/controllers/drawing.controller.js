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

const db = require("./../models/index");
const Drawing = db.drawings;
const sequelize = require("sequelize");
const Op = db.Sequelize.Op;

// create a drawing
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Drawing
  const drawing = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    version: req.body.version,
    status: req.body.status,
    projectId: req.body.projectId,
  };

  // Save Drawing in the database
  Drawing.create(drawing)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Drawing."
      });
    });
};

// Get drawings for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;

  Drawing.findAll({ where: {
    projectId: id
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Drawing Drawings with id=" + id
      });
    });  
};

// Get drawings for a given category
exports.findAllCat = (req, res) => {
  const id = req.params.id;

  Drawing.findAll({ where: {
    category: id
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Drawing Drawings with id=" + id
      });
    });  
};
//Find a single drawing by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Drawing.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Drawing with id=" + id
      });
    });  
};

// Update a Drawing by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Drawing.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Drawing was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Drawing with id=${id}. Maybe Drawing was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Drawing with id=" + id
      });
    });
};

// Delete a Drawing with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Drawing.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Drawing was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Drawing with id=${id}. Maybe Drawing was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Drawing with id=" + id
      });
    });
};

// Search All
exports.SearchAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Drawing.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects."
      });
    });
};

// Get drawings for a given category
exports.findAllbyStatus = (req, res) => {
  const status = req.params.status;
  const projectId = req.params.pid;
  Drawing.findAll({ where: {
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

exports.findMaxVersion = (req,res)=>{
  Drawing.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('version')), 'maxversion']],
    raw: true,
  }).then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Drawing Drawings with id=" + id
    });
  });  
}
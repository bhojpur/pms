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
const Project = db.projects;
const DirectCost = db.directcosts;
const Op = db.Sequelize.Op;
const sequelize = require("sequelize");

exports.create = (req, res) => {
  // Validate request
  if (!req.body.description) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a direct cost
  const directcost = {
    costCode: req.body.costCode,
    description:req.body.description,
    vendor: req.body.vendor,
    employee: req.body.employee,
    receivedDate: req.body.receivedDate,
    paidDate: req.body.paidDate,
    amount: req.body.amount,
    projectId: req.body.projectId,
    published:req.body.published,
  };

  // Save direct cost in the database
  DirectCost.create(directcost)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Budget Line Item."
      });
    });
};

// Get direct costs for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;
  const published = true;

  DirectCost.findAll({ where: {
    projectId: id,
    published: published
  
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Budget with id=" + id
      });
    });  
};

//Find a single direct cost by Id
exports.findOne = (req, res) => {
  const id = req.params.id;
 
  DirectCost.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project with id=" + id
      });
    });  
};

/*-------------------------------------------------------------- */

//delete a direct cost

exports.delete = (req, res) => {
  const id = req.params.id;
 

  DirectCost.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Direct Cost was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Direct Cost with id=${id}. Maybe Direct Cost was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Direct Cost with id=" + id
      });
    });
};

//update a direct cost

exports.update = (req, res) => {
  const id = req.params.id;


  DirectCost.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Direct Cost was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Direct Cost with id=${id}. Maybe Direct Cost  was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Direct Cost with id=" + id
      });
    });
};

/*********************************************** */
exports.findByCostCode= (req, res) => {
  const id = req.params.id;
  //const costCode = req.query.costCode;
  const costCode = req.params.costCode;
    //var condition = costCode ? { costCode: { [Op.like]: `%${costCode}%` } } : null;
    const published = true;
  DirectCost.findAll({ where: {
    projectId: id,
    published : published,
    //condition:condition
    costCode:costCode
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Budget with id=" + id
      });
    });  
};

// total of direct costs according to cost code
exports.getDTotalOfCostCodes = (req,res)=>{
  const id = req.params.id;
  const costCode = req.params.costCode;
DirectCost.findAll({
where: { costCode:costCode,projectId:id,published:true },
attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
raw: true,
}).then(data => {
res.send(data[0].total);
//console.log(data[0].total)
})
.catch(err => {
res.status(500).send({
  message: "Error retrieving total  "
});
});  
}

// total of all direct costs according to project id
exports.getTotalDirectCosts = (req,res)=>{
  const id = req.params.id;
DirectCost.findAll({
where: {projectId:id,published:true },
attributes: [[sequelize.fn('sum', sequelize.col('amount')), 'total']],
raw: true,
}).then(data => {
res.send(data[0].total);
//console.log(data[0].total)
})
.catch(err => {
res.status(500).send({
  message: "Error retrieving total  "
});
});  
}
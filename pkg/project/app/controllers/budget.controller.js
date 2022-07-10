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
const Budget = db.budgets;
const DirectCost = db.directcosts;
const Sov = db.sovs;
const sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');

// create a budget 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.costCode) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Budget Line Item
  const budget = {
    costCode: req.body.costCode,
    description: req.body.description,
    date: req.body.date,
    estimatedBudget: req.body.estimatedBudget,
    published: req.body.published,
    //directCosts:req.body.directCosts,
    //commitedCosts:req.body.commitedCosts,
    //currentBudget: req.body.currentBudget,
    //revisedBudget: req.body.revisedBudget,
   
    projectId: req.body.projectId,
  };

  // Save Budget Line in the database
  Budget.create(budget)
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

// Get budget line items for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;
  const published = true;

  Budget.findAll({ where: {
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

//Find a single budget by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Budget.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Budget with id=" + id
      });
    });  
};


/*-------------------------------------------------------------- */

//delete a budget - this should be removed

exports.delete = (req, res) => {
  const id = req.params.id;
 

  Budget.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Budget Line Item was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Budget Line Item with id=${id}. Maybe Budget Line Item was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Budget Line Item with id=" + id
      });
    });
};
/*-------------------------------------------------------------- */

//update a budget

exports.update = (req, res) => {

  if (!req.body.costCode) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const id = req.params.id;

  Budget.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Budget Line Item was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Budget Line Item with id=${id}. Maybe Budget Line Item was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Budget Line Item with id=" + id
      });
    });
};


//search by cost code

exports.findByCostCode= (req, res) => {
  const id = req.params.id;
  const published = true;
  //const costCode = req.query.costCode;
  const costCode = req.params.costCode;
    //var condition = costCode ? { costCode: { [Op.like]: `%${costCode}%` } } : null;

  Budget.findAll({ where: {
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
        message: "Error retrieving Budget Line Items with id=" + id
      });
    });  
};

// total of all estimated budget according to project id
exports.getTotalBudget = (req,res)=>{
const id = req.params.id;
Budget.findAll({
where: {projectId:id ,published:true},
attributes: [[sequelize.fn('sum', sequelize.col('estimatedBudget')), 'total']],
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


// budget overview table with join

exports.getBudgetOverview = (req,res)=>{

  //db.budgets.projectId  = req.params.id;
  
  db.sequelize.query('SELECT budget.id,budget.costCode, budget.estimatedBudget,SUM(directcost.amount) as dtotal,  SUM(sov.amount) as stotal FROM budget LEFT JOIN directcost ON directcost.costCode=budget.costCode AND directcost.published=:published LEFT JOIN sov   ON sov.costCode=budget.costCode AND sov.published=:published WHERE budget.projectId=:id AND budget.published=:published GROUP BY budget.costCode',
   {  replacements: { id: req.params.id,published:true },type: db.sequelize.QueryTypes.SELECT})
  .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving total  "
      });
      });  

  }

  //update the status of a budget line

  exports.budgetUnpublished = (req,res)=>{
    id = req.params.id;
    db.sequelize.query('UPDATE budget SET published= false WHERE id='+id+';',
     {type: db.sequelize.QueryTypes.SELECT})
    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating status "
        });
        });  


  
    }
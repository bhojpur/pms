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
const Commitment = db.commitments;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a commitment
  const commitment = {
    title:req.body.title,
    contractCompany:req.body.contractCompany,
    status:req.body.status,
    //executed:req.body.executed,
    //defaultRetainage:req.body.defaultRetainage,
    description:req.body.description,
    startDate:req.body.startDate,
    estimatedCompletionDate:req.body.estimatedCompletionDate,
    //actualCompletionDate:req.body.actualCompletionDate,
    signedContractReceivedDate:req.body.signedContractReceivedDate,
    published:req.body.published,

    projectId: req.body.projectId,
  };

  // Save commitment in the database
  Commitment.create(commitment)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project."
      });
    });
};

// Get commitments for a given project
exports.findAll = (req, res) => {
  const id = req.params.id;

  Commitment.findAll({ where: {
    projectId: id,
    published:true
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project Drawings with id=" + id
      });
    });  
};

//Find a single commitment by Id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Commitment.findByPk(id)
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

//delete a commitment

exports.delete = (req, res) => {
  const id = req.params.id;

  Commitment.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Commitment was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Commitment with id=${id}. Maybe Commitment was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Commitment with id=" + id
      });
    });
};

//update a commitment

exports.update = (req, res) => {
  const id = req.params.id;

  Commitment.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Commitment was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Commitment with id=${id}. Maybe Commitment  was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Commitment with id=" + id
      });
    });
};

/*********************************************** */
exports.findByContractCompany= (req, res) => {
  const id = req.params.id;
  //const costCode = req.query.costCode;
  const contractCompany = req.params.contractCompany;
  const status = req.params.status;
    //var condition = costCode ? { costCode: { [Op.like]: `%${costCode}%` } } : null;

  Commitment.findAll({ where: {
    projectId: id,
    //condition:condition
   contractCompany: contractCompany ,
   status:status,
   published:true
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

// exports.findByTitle= (req, res) => {
//   const id = req.params.id;
//   //const costCode = req.query.costCode;
//   const title = req.params.title;
//   const status = req.params.status;
//     //var condition = costCode ? { costCode: { [Op.like]: `%${costCode}%` } } : null;

//   Commitment.findAll({ where: {
//     projectId: id,
//     //condition:condition
//    title : title,
//    published:true,
//    status : status
//   }})
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Project Budget with id=" + id
//       });
//     });  
// };

exports.findByStatusOngoing= (req, res) => {
  const id = req.params.id;
  const status = req.params.ongoing;

  Commitment.findAll({ where: {
    projectId: id,
    status : status,
    published:true
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving status with id=" + id +" and status = "+status
      });
    });  
};

exports.findByStatusCompleted = (req, res) => {
  const id = req.params.id;
  const status = req.params.completed;

  Commitment.findAll({ where: {
    projectId: id,
    status : status,
    published:true
  }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving status with id=" + id +" and status = "+status
      });
    });  
};

//get the last project 
exports.findLastOne = (req,res) =>{
  const pid = req.params.id;
  Commitment.findAll({
    where: {
      projectId: pid,
      published:true
    },
    limit: 1,
    order: [['id', 'DESC']]
  })
  .then(data => {
   res.send(data);
 })
 .catch(err => {
   res.status(500).send({
     message:
       err.message || "Some error occurred while retrieving projects."
   });
 });
}
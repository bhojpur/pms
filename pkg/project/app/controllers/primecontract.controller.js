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

// const db = require("./../models/index");
// const Project = db.projects;
// const PrimeContract = db.primecontracts;

// // create a drawing
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.hash) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//     return;
//   }

//   // Create a Project
//   const primecontract = {
//     hash: req.body.hash,
//     owner: req.body.owner,
//     contractor: req.body.contractor,
//     engineer: req.body.engineer,
//     title:req.body.title,
//     status:req.body.status,
//     //executed:req.body.executed,
//     defaultRetainage:req.body.defaultRetainage,
//     description:req.body.description,
//     startDate:req.body.startDate,
//     estimatedCompletionDate:req.body.estimatedCompletionDate,
//     actualCompletionDate:req.body.actualCompletionDate,
//     signedContractReceivedDate:req.body.signedContractReceivedDate,
//     inclusions:req.body.inclusions,
//     exclusions:req.body.exclusions,


//     projectId: req.body.projectId,
//   };

//   // Save Project in the database
//   PrimeContract.create(primecontract)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Project."
//       });
//     });
// };

// // Get drawings for a given project
// exports.findAll = (req, res) => {
//   const id = req.params.id;

//   PrimeContract.findAll({ where: {
//     projectId: id
//   }})
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Project Drawings with id=" + id
//       });
//     });  
// };

// //Find a single drawing by Id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   PrimeContract.findByPk(id)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Project with id=" + id
//       });
//     });  
// };
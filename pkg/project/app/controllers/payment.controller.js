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
// const Commitment = db.commitments;
// const Payment = db.payments;

// // create a drawing
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.note) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//     return;
//   }

//   // Create a Payment
//   const payment = {
//     invoice: req.body.invoice,
//     paymentMethod:req.body.paymentMethod,
//     date:req.body.date,
//     paymentHash:req.body.paymentHash,
//     invoiceHash:req.body.invoiceHash,
//     note:req.body.note,
//     ammount:req.body.ammount,

//     commitmentId: req.body.commitmentId,
//   };

//   // Save Project in the database
//   Payment.create(payment)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Payment."
//       });
//     });
// };

// // Get drawings for a given project
// exports.findAll = (req, res) => {
//   const id = req.params.id;

//  Payment.findAll({ where: {
//     commitmentId: id
//   }})
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Contract Payments with id=" + id
//       });
//     });  
// };

// //Find a single drawing by Id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   Payment.findByPk(id)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Payment with id=" + id
//       });
//     });  
// };
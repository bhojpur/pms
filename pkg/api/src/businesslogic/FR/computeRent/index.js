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

const fs = require('fs');
const path = require('path');

module.exports = function (contract, rentDate, previousRent, settlements) {
  const rent = {
    term: 0,
    month: 0,
    year: 0,
    preTaxAmounts: [
      // {
      //     description: '',
      //     amount: ''
      // }
    ],
    charges: [
      // {
      //     description: '',
      //     amount: ''
      // }
    ],
    discounts: [
      // {
      //     origin: '',  // 'contract', 'settlement'
      //     description: '',
      //     amount: ''
      // }
    ],
    debts: [
      // {
      //     description: '',
      //     amount: ''
      // }
    ],
    vats: [
      // {
      //     origin: '',  // 'contract', 'settlement'
      //     description: '',
      //     rate: 0,
      //     amount: 0
      // }
    ],
    payments: [
      // {
      //     date: '',
      //     amount: 0,
      //     type: '',
      //     reference: ''
      // }
    ],
    description: '',
    total: {
      balance: 0,
      preTaxAmount: 0,
      charges: 0,
      discount: 0,
      vat: 0,
      grandTotal: 0,
      payment: 0,
    },
  };
  const tasks_dir = path.join(__dirname, 'tasks');
  const taskFiles = fs.readdirSync(tasks_dir);
  return taskFiles.reduce((rent, taskFile) => {
    const task = require(path.join(tasks_dir, taskFile));
    return task(contract, rentDate, previousRent, settlements, rent);
  }, rent);
};
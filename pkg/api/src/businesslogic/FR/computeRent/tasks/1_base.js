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

const moment = require('moment');

module.exports = function (
  contract,
  rentDate,
  previousRent,
  settlements,
  rent
) {
  const currentMoment = moment(rentDate, 'DD/MM/YYYY HH:mm');
  rent.term = Number(currentMoment.format('YYYYMMDDHH'));
  if (contract.frequency === 'months') {
    rent.term = Number(
      moment(currentMoment).startOf('month').format('YYYYMMDDHH')
    );
  }
  if (contract.frequency === 'days') {
    rent.term = Number(
      moment(currentMoment).startOf('day').format('YYYYMMDDHH')
    );
  }
  if (contract.frequency === 'hours') {
    rent.term = Number(
      moment(currentMoment).startOf('hour').format('YYYYMMDDHH')
    );
  }
  rent.month = currentMoment.month() + 1; // 0 based
  rent.year = currentMoment.year();

  contract.properties
    .filter((property) => {
      const entryMoment = moment(property.entryDate).startOf('day');
      const exitMoment = moment(property.exitDate).endOf('day');

      return currentMoment.isBetween(
        entryMoment,
        exitMoment,
        contract.frequency,
        '[]'
      );
    })
    .forEach(function (property) {
      if (property.property) {
        const name = property.property.name || '';
        const preTaxAmount = property.rent || 0;
        const expenses = property.expenses || [];

        rent.preTaxAmounts.push({
          description: name,
          amount: preTaxAmount,
        });

        if (expenses.length) {
          rent.charges.push(
            ...expenses.map(({ title, amount }) => ({
              description: title,
              amount,
            }))
          );
        }
      }
    });
  if (settlements) {
    rent.description = settlements.description || '';
  }
  return rent;
};
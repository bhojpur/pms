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

const Sugar = require('sugar');
const moment = require('moment');
const BL = require('../businesslogic');

const create = (contract) => {
  const supportedFrequencies = ['hours', 'days', 'weeks', 'months', 'years'];

  if (
    !contract.frequency ||
    supportedFrequencies.indexOf(contract.frequency) === -1
  ) {
    throw Error(
      `unsupported frequency, should be one of these ${supportedFrequencies.join(
        ', '
      )}`
    );
  }

  if (!contract.properties || contract.properties.length === 0) {
    throw Error('properties not defined or empty');
  }

  const momentBegin = moment(contract.begin);
  const momentEnd = moment(contract.end);
  let momentTermination;
  if (contract.termination) {
    momentTermination = moment(contract.termination);
    if (!momentTermination.isBetween(momentBegin, momentEnd, 'minutes', '[]')) {
      throw Error('termination date is out of the contract time frame');
    }
  }

  if (momentEnd.isSameOrBefore(momentBegin)) {
    throw Error(
      'contract duration is not correct, check begin/end contract date'
    );
  }

  const terms = Math.round(
    momentEnd.diff(momentBegin, contract.frequency, true)
  );
  contract = {
    ...contract,
    terms,
    rents: [],
  };

  const current = moment(momentBegin);
  let previousRent;
  while (current.isSameOrBefore(momentTermination || momentEnd)) {
    const rent = BL.computeRent(
      contract,
      current.format('DD/MM/YYYY HH:mm'),
      previousRent
    );
    contract.rents.push(rent);
    previousRent = rent;
    current.add(1, contract.frequency);
  }
  return contract;
};

const update = (inputContract, modification) => {
  const originalContract = Sugar.Object.clone(inputContract, true);
  const modifiedContract = {
    ...originalContract,
    ...modification,
  };

  const momentBegin = moment(modifiedContract.begin);
  const momentEnd = moment(modifiedContract.end);
  let momentTermination;
  if (modifiedContract.termination) {
    momentTermination = moment(modifiedContract.termination);
  }

  // Check possible lost payments
  _checkLostPayments(
    momentBegin,
    momentTermination || momentEnd,
    inputContract
  );

  const updatedContract = create(modifiedContract);

  if (inputContract.rents) {
    inputContract.rents
      .filter((rent) => _isPayment(rent))
      .forEach((paidRent) => {
        payTerm(updatedContract, paidRent.term, {
          payments: paidRent.payments,
          vats: paidRent.vats.filter((vat) => vat.origin === 'settlement'),
          discounts: paidRent.discounts.filter(
            (discount) => discount.origin === 'settlement'
          ),
          debts: paidRent.debts.filter(
            (debt) => debt.amount && debt.amount > 0
          ),
          description: paidRent.description,
        });
      });
  }

  return updatedContract;
};

const renew = (contract) => {
  const momentEnd = moment(contract.end);
  const momentNewEnd = moment(momentEnd).add(
    contract.terms,
    contract.frequency
  );

  return {
    ...update(contract, { end: momentNewEnd.toDate() }),
    terms: contract.terms,
  };
};

const terminate = (inputContract, termination) => {
  return update(inputContract, { termination });
};

const payTerm = (contract, term, settlements) => {
  if (!contract.rents || !contract.rents.length) {
    throw Error('cannot pay term, the rents were not generated');
  }
  const current = moment(term, 'YYYYMMDDHH');
  const momentBegin = moment(contract.begin);
  const momentEnd = moment(contract.termination || contract.end);

  if (!current.isBetween(momentBegin, momentEnd, contract.frequency, '[]')) {
    throw Error('payment term is out of the contract time frame');
  }

  const previousTerm = moment(current).subtract('1', contract.frequency);
  const previousRentIndex = contract.rents.findIndex(
    (rent) => rent.term === Number(previousTerm.format('YYYYMMDDHH'))
  );

  let previousRent =
    previousRentIndex > -1 ? contract.rents[previousRentIndex] : null;
  contract.rents.forEach((rent, index) => {
    if (index > previousRentIndex) {
      if (index > previousRentIndex + 1) {
        const { debts, discounts, payments } = rent;
        settlements = {
          debts,
          discounts: discounts.filter((d) => d.origin === 'settlement'),
          payments,
        };
      }
      contract.rents[index] = BL.computeRent(
        contract,
        current.format('DD/MM/YYYY HH:mm'),
        previousRent,
        settlements
      );
      previousRent = contract.rents[index];
      current.add(1, contract.frequency);
    }
  });

  return contract;
};

const _isPayment = (rent) => {
  return (
    rent.payments.some((payment) => payment.amount && payment.amount > 0) ||
    rent.discounts.some(
      (discount) =>
        discount.origin === 'settlement' &&
        discount.amount &&
        discount.amount > 0
    ) ||
    rent.debts.some((debt) => debt.amount && debt.amount > 0) ||
    !!rent.description
  );
};

const _checkLostPayments = (momentBegin, momentEnd, contract) => {
  if (!contract.rents || !contract.rents.length) {
    return;
  }

  const lostPayments = contract.rents
    .filter(
      (rent) =>
        !moment(rent.term, 'YYYYMMDDHH').isBetween(
          momentBegin,
          momentEnd,
          contract.frequency,
          '[]'
        ) && _isPayment(rent)
    )
    .map(
      (rent) =>
        String(rent.term) +
        ' ' +
        rent.payments.map((payment) => payment.amount).join(' + ')
    );

  if (lostPayments.length > 0) {
    throw Error(
      `Some payments will be lost because they are out of the contract time frame:\n${lostPayments.join(
        '\n'
      )}`
    );
  }
};

module.exports = {
  create,
  update,
  terminate,
  renew,
  payTerm,
};
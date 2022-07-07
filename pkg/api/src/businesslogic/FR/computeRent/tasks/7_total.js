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

module.exports = function (
    contract,
    rentDate,
    previousRent,
    settlements,
    rent
  ) {
    const preTaxAmount = rent.preTaxAmounts.reduce(
      (total, preTaxAmount) => total + preTaxAmount.amount,
      0
    );
    const charges = rent.charges.reduce(
      (total, charges) => total + charges.amount,
      0
    );
    const debts = rent.debts.reduce((total, debt) => total + debt.amount, 0);
    const discount = rent.discounts.reduce(
      (total, discount) => total + discount.amount,
      0
    );
    const vat =
      Math.round(rent.vats.reduce((total, vat) => total + vat.amount, 0) * 100) /
      100;
    const payment = rent.payments.reduce(
      (total, payment) => total + payment.amount,
      0
    );
  
    rent.total.preTaxAmount = preTaxAmount;
    rent.total.charges = charges;
    rent.total.debts = debts;
    rent.total.discount = discount;
    rent.total.vat = vat;
    rent.total.grandTotal =
      Math.round(
        (preTaxAmount + charges + debts - discount + vat + rent.total.balance) *
          100
      ) / 100;
    rent.total.payment = payment;
  
    return rent;
  };
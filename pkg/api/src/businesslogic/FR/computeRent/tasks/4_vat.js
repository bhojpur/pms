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
    if (contract.vatRate) {
      const rate = contract.vatRate || 0;
  
      rent.preTaxAmounts.forEach((preTaxAmount) => {
        rent.vats.push({
          origin: 'contract',
          description: `${preTaxAmount.description} T.V.A. (${rate * 100}%)`,
          amount: preTaxAmount.amount * rate,
          rate,
        });
      });
  
      rent.charges.forEach((charges) => {
        rent.vats.push({
          origin: 'contract',
          description: `${charges.description} T.V.A. (${rate * 100}%)`,
          amount: charges.amount * rate,
          rate,
        });
      });
  
      rent.debts.forEach((debt) => {
        rent.vats.push({
          origin: 'debts',
          description: `${debt.description} T.V.A. (${rate * 100}%)`,
          amount: debt.amount * rate,
          rate,
        });
      });
  
      rent.discounts.forEach((discount) => {
        rent.vats.push({
          origin: discount.origin,
          description: `${discount.description} T.V.A. (${rate * 100}%)`,
          amount: discount.amount * rate * -1,
          rate,
        });
      });
    }
  
    return rent;
  };
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

const OF = require('./objectfilter');
const Model = require('./model');

class OccupantModel extends Model {
  constructor() {
    super('occupants');
    this.schema = new OF({
      _id: String,
      isCompany: Boolean,
      company: String,
      legalForm: String,
      siret: String,
      rcs: String,
      capital: Number,
      manager: String,
      name: String,
      street1: String,
      street2: String,
      zipCode: String,
      city: String,
      state: String,
      country: String,
      contacts: Array,
      contract: String,
      leaseId: String,
      beginDate: Date,
      endDate: Date,
      frequency: String,
      terminationDate: Date,
      guarantyPayback: Number,
      properties: Array, // [{ propertyId, property: { ... }, entryDate, exitDate, rent, expenses: [{title, amount}] }]
      guaranty: Number,
      reference: String,
      isVat: Boolean,
      vatRatio: Number,
      discount: Number,
      rents: Array,
      stepperMode: Boolean,
    });
  }

  findAll(realm, callback) {
    super.findAll(realm, (errors, occupants) => {
      if (errors && errors.length > 0) {
        callback(errors);
        return;
      }

      callback(
        null,
        occupants.sort((o1, o2) => {
          const name1 = (o1.isCompany ? o1.company : o1.name) || '';
          const name2 = (o2.isCompany ? o2.company : o2.name) || '';

          return name1.localeCompare(name2);
        })
      );
    });
  }
}

module.exports = new OccupantModel();
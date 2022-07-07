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
const logger = require('winston');

class RealmModel extends Model {
  constructor() {
    super('realms');
    this.schema = new OF({
      _id: String,
      name: String,
      members: Array, // [{ name, email, role, registered },]
      addresses: Array, // [{ street1, street2, zipCode, city, state, country }, ]
      bankInfo: Object, // { name, iban }
      contacts: Array, // [{ name, email, phone1, phone2 }]
      isCompany: Boolean,
      companyInfo: Object, // { name, legalStructure, capital, ein, dos, vatNumber, legalRepresentative }
      thirdParties: Object, // { mailgun: { apiKey, domain, fromEmail, replyToEmail }, b2: { keyId, applicationKey, endpoint, bucket } },
      locale: String,
      currency: String,
    });
  }

  findOne(id, callback) {
    super.findOne(null, id, function (errors, realm) {
      if (errors) {
        callback(errors);
      } else if (!realm) {
        callback(['realm not found']);
      } else {
        callback(null, realm);
      }
    });
  }

  findAll(callback) {
    super.findAll(null, function (errors, realms) {
      if (errors) {
        callback(errors);
      } else if (!realms || realms.length === 0) {
        callback(null, null);
      } else {
        callback(null, realms);
      }
    });
  }

  findByEmail(email, callback) {
    // TODO to optimize: filter should by applied on DB
    super.findAll(null, function (errors, realms) {
      if (errors) {
        callback(errors);
      } else if (!realms || realms.length === 0) {
        callback(null, null);
      } else {
        const realmsFound = realms.filter((realm) =>
          realm.members?.map(({ email }) => email).includes(email)
        );
        callback(null, realmsFound);
      }
    });
  }

  add(realm, callback) {
    super.add(null, realm, callback);
  }

  update(realm, callback) {
    super.update(null, realm, callback);
  }

  remove() {
    logger.error('method not implemented!');
  }
}

module.exports = new RealmModel();
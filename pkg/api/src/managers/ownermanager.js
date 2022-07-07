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

const realmModel = require('../models/realm');

////////////////////////////////////////////////////////////////////////////////
// Exported functions
////////////////////////////////////////////////////////////////////////////////
function all(req, res) {
  const realm = req.realm;
  realmModel.findOne(realm._id, (errors, dbRealm) => {
    if (errors && errors.length > 0) {
      res.json({
        errors: errors,
      });
      return;
    }
    res.json({
      _id: dbRealm._id,
      isCompany: dbRealm.isCompany,
      company: dbRealm.companyInfo.name,
      legalForm: dbRealm.companyInfo.legalStructure,
      capital: dbRealm.companyInfo.capital,
      siret: dbRealm.companyInfo.ein,
      dos: dbRealm.companyInfo.dos,
      vatNumber: dbRealm.companyInfo.vatNumber,
      manager: dbRealm.companyInfo.legalRepresentative,
      street1: dbRealm.addresses[0].street1,
      street2: dbRealm.addresses[0].street2,
      zipCode: dbRealm.addresses[0].zipCode,
      city: dbRealm.addresses[0].city,
      state: dbRealm.addresses[0].state,
      country: dbRealm.addresses[0].country,
      contact: dbRealm.contacts[0].name,
      email: dbRealm.contacts[0].email,
      phone1: dbRealm.contacts[0].phone1,
      phone2: dbRealm.contacts[0].phone2,
      bank: dbRealm.bankInfo.name,
      rib: dbRealm.bankInfo.iban,
    });
  });
}

function update(req, res) {
  const realm = req.realm;
  const owner = req.body;

  realm.isCompany = owner.isCompany;
  realm.companyInfo = {
    name: owner.company,
    legalStructure: owner.legalForm,
    capital: owner.capital,
    ein: owner.siret,
    dos: owner.dos,
    vatNumber: owner.vatNumber,
    legalRepresentative: owner.manager,
  };

  realm.addresses = [
    {
      street1: owner.street1,
      street2: owner.street2,
      zipCode: owner.zipCode,
      city: owner.city,
      state: owner.state,
      country: owner.country,
    },
  ];

  realm.contacts = [
    {
      name: owner.contact,
      email: owner.email,
      phone1: owner.phone1,
      phone2: owner.phone2,
    },
  ];

  realm.bankInfo = {
    name: owner.bank,
    iban: owner.rib,
  };

  realmModel.update(realmModel.schema.filter(realm), (errors) => {
    res.json({ errors: errors });
  });
}

module.exports = {
  all,
  update,
};
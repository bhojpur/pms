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
const Tenant = require('@bhojpur/common/models/tenant');

module.exports = {
  get: async (tenantId, params) => {
    const dbTenant = await Tenant.findOne({ _id: tenantId })
      .populate('realmId')
      .populate('leaseId')
      .populate('properties.propertyId');
    if (!dbTenant) {
      throw new Error('tenant not found');
    }

    if (!dbTenant.rents.length) {
      throw new Error('term not found');
    }

    const tenant = dbTenant.toObject();
    const landlord = tenant.realmId;
    landlord.name =
      (landlord.isCompany
        ? landlord.companyInfo?.name
        : landlord.contacts?.[0]?.name) || '';
    landlord.hasCompanyInfo = !!landlord.companyInfo;
    landlord.hasBankInfo = !!landlord.bankInfo;
    landlord.hasAddress = !!landlord.addresses?.length;
    landlord.hasContact = !!landlord.contacts?.length;

    delete tenant.realmId;

    tenant.contract = {
      name: tenant.contract,
      lease: tenant.leaseId,
      beginDate: tenant.beginDate,
      endDate: tenant.endDate,
      properties: tenant.properties.reduce((acc, { propertyId }) => {
        acc.push(propertyId);
        return acc;
      }, []),
    };

    delete tenant.leaseId;

    tenant.rents = tenant.rents.filter(
      (rent) => rent.term === Number(params.term)
    );

    // data that will be injected in the email content files (ejs files)
    return {
      landlord,
      tenant,
      period: params.term,
      today: moment().format('DD/MM/YYYY'),
    };
  },
};
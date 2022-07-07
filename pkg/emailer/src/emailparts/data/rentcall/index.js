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
const invoice = require('../invoice');

const _avoidWeekend = (aMoment) => {
  const day = aMoment.isoWeekday();
  if (day === 6) {
    // if saturday shift the due date to friday
    aMoment.subtract(1, 'days');
  } else if (day === 7) {
    // if sunday shift the due date to monday
    aMoment.add(1, 'days');
  }
  return aMoment;
};

module.exports = {
  get: async (tenantId, params) => {
    const momentTerm = moment(params.term, 'YYYYMMDDHH');
    const momentToday = moment();

    const { landlord, tenant, period } = await invoice.get(tenantId, params);
    const beginDate = moment(tenant.contract.beginDate);

    let dueDate = moment(momentTerm);
    if (tenant.contract.lease.timeRange === 'years') {
      dueDate.add(1, 'months');
    } else if (tenant.contract.lease.timeRange === 'months') {
      dueDate.add(10, 'days');
    } else if (tenant.contract.lease.timeRange === 'weeks') {
      dueDate.add(2, 'days');
    }
    _avoidWeekend(dueDate);
    if (dueDate.isBefore(beginDate)) {
      dueDate = moment(beginDate);
    }

    let billingDay = momentToday;
    if (dueDate.isSameOrBefore(momentToday)) {
      billingDay = _avoidWeekend(moment(momentTerm));
    }

    // data that will be injected in the email content files (ejs files)
    return {
      landlord,
      tenant,
      period,
      today: billingDay.format('DD/MM/YYYY'),
      billingRef: `${moment(params.term, 'YYYYMMDDHH').format('MM_YY')}_${
        tenant.reference
      }`,
      dueDate: dueDate.format('DD/MM/YYYY'),
    };
  },
};
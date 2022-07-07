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

const config = require('../../../config');

module.exports = {
  get: (recordId, params, data) => {
    if (!data.tenant && !data.tenant.contacts) {
      throw new Error('tenant has not any contact emails');
    }

    if (!data.landlord.thirdParties || !data.landlord.thirdParties.mailgun) {
      throw new Error('landlord has not set the mailgun configuration');
    }

    const fromEmail = data.landlord.thirdParties.mailgun.fromEmail;
    const replyToEmail = data.landlord.thirdParties.mailgun.replyToEmail;

    const recipientsList = data.tenant.contacts
      .filter((contact) => contact.email)
      .reduce((acc, { email }) => {
        if (acc.find(({ to }) => to === email.toLowerCase())) {
          return acc;
        }
        let recipients = {
          from: fromEmail,
          to: email.toLowerCase(),
          'h:Reply-To': replyToEmail,
        };
        if (config.PRODUCTIVE && data.landlord.members.length) {
          recipients = {
            ...recipients,
            bcc: data.landlord.members
              .filter(
                ({ email, registered }) => registered && email !== fromEmail
              )
              .map(({ email }) => email)
              .join(','),
          };
        }
        acc.push(recipients);
        return acc;
      }, []);

    if (!recipientsList || !recipientsList.length) {
      throw new Error('tenant has not any contact emails');
    }

    return recipientsList;
  },
};
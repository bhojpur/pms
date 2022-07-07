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

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const config = require('./config');
const crypto = require('@bhojpur/common/utils/crypto');

const sendEmail = (email, data) => {
  let mgConfig;
  if (data.landlord) {
    // email sent by an organization
    if (data.landlord.thirdParties && data.landlord.thirdParties.mailgun) {
      mgConfig = {
        apiKey: crypto.decrypt(data.landlord.thirdParties.mailgun.apiKey),
        domain: data.landlord.thirdParties.mailgun.domain,
      };
    }
  } else {
    // email sent by the application
    mgConfig = config.MAILGUN;
  }

  if (!mgConfig) {
    throw new Error('landlord has not set the mailgun configuration');
  }

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: mgConfig.apiKey });
  return mg.messages.create(mgConfig.domain, email);
};

module.exports = {
  sendEmail,
};
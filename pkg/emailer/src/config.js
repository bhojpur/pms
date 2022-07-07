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

const path = require('path');
const baseConfig = require('@bhojpur/common/config');

const root_dir = path.join(__dirname, '..');

module.exports = {
  ...baseConfig,
  PRODUCTIVE: process.env.NODE_ENV === 'production',
  ALLOW_SENDING_EMAILS:
    process.env.NODE_ENV === 'production' ||
    process.env.ALLOW_SENDING_EMAILS === 'true',
  APP_NAME: process.env.APP_NAME || 'Loca',
  APP_URL: process.env.APP_URL || 'http://localhost:8080/app',
  PORT: process.env.PORT || 8083,
  MAILGUN: {
    apiKey: process.env.MAILGUN_API_KEY || 'your_api_key',
    domain: process.env.MAILGUN_DOMAIN || 'mg.example.com',
  },
  PDFGENERATOR_URL:
    process.env.PDFGENERATOR_URL || 'http://localhost:8082/pdfgenerator',
  TEMPORARY_DIRECTORY:
    process.env.TEMPORARY_DIRECTORY || path.join(root_dir, '/tmp'),
  EMAIL: {
    FROM: process.env.EMAIL_FROM || 'Example <noreply@example.com>',
    REPLY_TO: process.env.EMAIL_REPLY_TO || 'customer-service@example.com',
    BCC: process.env.EMAIL_BCC || 'manager1@example.com,manager2@example.com',
  },
};
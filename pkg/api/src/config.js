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

const baseConfig = require('@bhojpur/common/config');

const toBoolean = (value) => {
  if (value && typeof value !== 'boolean') {
    value = value.toLowerCase() === 'true';
  }
  return value;
};

module.exports = {
  ...baseConfig,
  appHttpPort: process.env.PORT || 8080,
  businesslogic: 'FR',
  productive: process.env.NODE_ENV === 'production',
  signup: toBoolean(process.env.SIGNUP || false),
  restoreDatabase: toBoolean(process.env.RESTORE_DB || true),
  demoMode: toBoolean(process.env.DEMO_MODE || true),
  EMAILER_URL: process.env.EMAILER_URL || 'http://localhost:8083/emailer',
  PDFGENERATOR_URL:
    process.env.PDFGENERATOR_URL || 'http://localhost:8082/pdfgenerator',
};
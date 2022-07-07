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
  PORT: process.env.PORT || 8082,
  DATA_DIRECTORY: process.env.DATA_DIRECTORY || path.join(root_dir, '/data'),
  TEMPLATES_DIRECTORY:
    process.env.TEMPLATES_DIRECTORY || path.join(root_dir, '/templates'),
  TEMPORARY_DIRECTORY:
    process.env.TEMPORARY_DIRECTORY || path.join(root_dir, '/tmp'),
  PDF_DIRECTORY:
    process.env.PDF_DIRECTORY || path.join(root_dir, '/pdf_documents'),
  UPLOADS_DIRECTORY:
    process.env.UPLOADS_DIRECTORY || path.join(root_dir, '/uploads'),
};
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

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const config = require('./config');
const templateFunctions = require('./utils/templatefunctions');

const _templatesDir = path.join(__dirname, 'emailparts', 'contents');

const _renderFile = (templateFile, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templateFile, data, { root: _templatesDir }, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    });
  });
};

module.exports = {
  build: async (
    locale,
    currency,
    templateName,
    recordId,
    params,
    emailData
  ) => {
    const contentPackagePath = path.join(_templatesDir, templateName, locale);
    if (!fs.existsSync(contentPackagePath)) {
      throw new Error(
        `cannot generate email content for ${templateName}. Template not found`
      );
    }

    const data = {
      ...emailData,
      config,
      _: templateFunctions({ locale, currency }),
    };
    const subject = await _renderFile(
      path.join(contentPackagePath, 'subject.ejs'),
      data
    );
    const html = await _renderFile(
      path.join(contentPackagePath, 'body_html.ejs'),
      data
    );
    const text = await _renderFile(
      path.join(contentPackagePath, 'body_text.ejs'),
      data
    );
    return { subject, text, html };
  },
};
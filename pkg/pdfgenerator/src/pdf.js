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
const logger = require('winston');
const config = require('./config');
const dataPicker = require('./datapicker');
const pdfEngine = require('./engine/chromeheadless');
const templateFunctions = require('./utils/templatefunctions');

const settings = {
  'view engine': ejs.renderFile,
  'pdf engine': pdfEngine,
};
const templates_dir = config.TEMPLATES_DIRECTORY;
const tmp_dir = config.TEMPORARY_DIRECTORY;
const pdf_dir = config.PDF_DIRECTORY;

function set(key, value) {
  settings[key] = value;
}

async function start() {
  if (!fs.existsSync(pdf_dir)) {
    fs.mkdirSync(pdf_dir);
  }
  if (!fs.existsSync(tmp_dir)) {
    fs.mkdirSync(tmp_dir);
  }

  await settings['pdf engine'].start();
}

async function exit() {
  await settings['pdf engine'].exit();
}

async function generate(documentId, params) {
  const templateFile = path.join(templates_dir, `${documentId}.ejs`);
  if (!fs.existsSync(templateFile)) {
    logger.error(
      `cannot generate file for a not existing template ${templateFile}`
    );
    throw new Error(
      `cannot generate file for a not existing template ${templateFile}`
    );
  }

  const data = await dataPicker(documentId, params);
  const html = await settings['view engine'](
    templateFile,
    {
      ...data,
      _: templateFunctions({
        locale: data.landlord.locale,
        currency: data.landlord.currency,
      }),
    },
    { root: templates_dir }
  );
  return await settings['pdf engine'].generate(documentId, html, data.fileName);
}

module.exports = {
  set,
  start,
  exit,
  generate,
};
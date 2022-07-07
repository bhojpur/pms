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
const fs = require('fs');
const axios = require('axios');
const config = require('../../config');

module.exports = (
  authorizationHeader,
  organizationId,
  templateName,
  recordId,
  params,
  filename
) => {
  const uri = `${config.PDFGENERATOR_URL}/documents/${templateName}/${recordId}/${params.term}`;
  const fileDir = path.join(config.TEMPORARY_DIRECTORY, templateName);
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  const filePath = path.join(fileDir, `${filename}.pdf`);
  const wStream = fs.createWriteStream(filePath);

  return axios
    .get(uri, {
      responseType: 'stream',
      headers: {
        authorization: authorizationHeader,
        organizationid: organizationId,
      },
    })
    .then((response) => {
      return new Promise((resolve, reject) => {
        let isErrorOccured = false;
        wStream.on('error', (error) => {
          isErrorOccured = true;
          wStream.close();
          reject(error);
        });
        wStream.on('close', () => {
          if (!isErrorOccured) {
            resolve(filePath);
          }
          //no need to call the reject here, already done in the 'error' stream;
        });
        response.data.pipe(wStream);
      });
    });
};
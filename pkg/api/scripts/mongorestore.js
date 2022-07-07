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
const { URL } = require('url');
const mongobackup = require('mongobackup');
const config = require('../src/config');

const db_url = new URL(config.MONGO_URL);
const db_name = db_url.pathname.slice(1);

const bkpDirectory = path.join(__dirname, '..', 'bkp');
const bkpFile = path.join(bkpDirectory, `${db_name}.dump`);

module.exports = async () => {
  await new Promise((resolve, reject) => {
    try {
      let cmd;
      if (fs.existsSync(bkpFile)) {
        cmd = mongobackup.restore({
          host: db_url.hostname,
          drop: true,
          gzip: true,
          archive: bkpFile,
        });
      } else {
        cmd = mongobackup.restore({
          db: db_name,
          host: db_url.hostname,
          drop: true,
          path: path.join(bkpDirectory, db_name),
        });
      }
      cmd.on('close', (code) => {
        resolve(code);
      });
      cmd.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};
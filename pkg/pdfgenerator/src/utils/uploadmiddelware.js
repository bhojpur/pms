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
const fs = require('fs-extra');
const os = require('os');
const multer = require('multer');
const config = require('../config');
const { sanitize, sanitizePath } = require('.');

const SUPPORTED_FILE_EXTENSIONS = {
  'image/gif': 'gif',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/jpe': 'jpe',
  'application/pdf': 'pdf',
};

const SUPPORTED_MIMETYPES = Object.keys(SUPPORTED_FILE_EXTENSIONS);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const orgName = sanitize(req.realm.name);
    const orgId = sanitize(req.realm._id);
    let s3Dir = `${orgName}-${orgId}`;
    let localDir = path.join(config.UPLOADS_DIRECTORY, `${orgName}-${orgId}`);

    if (req.body.folder) {
      const folder = sanitizePath(req.body.folder);
      localDir = path.join(localDir, folder);
      req.body.localDir = localDir;

      s3Dir = path.join(s3Dir, folder);
      if (os.platform() === 'win32') {
        s3Dir = s3Dir.replace(/\\/g, '/');
      }
      req.body.s3Dir = s3Dir;
    }

    fs.ensureDirSync(localDir);
    cb(null, localDir);
  },
  filename: function (req, file, cb) {
    if (!SUPPORTED_MIMETYPES.includes(file.mimetype)) {
      return cb(new Error('file not supported'));
    }
    const fileNameNoExt = req.body.fileName || 'noname';
    const suffix = Math.round(Math.random() * 1e9);
    const extension = SUPPORTED_FILE_EXTENSIONS[file.mimetype];
    const fileName = sanitize(`${fileNameNoExt}-${suffix}.${extension}`);
    req.body.fileName = fileName;
    cb(null, fileName);
  },
});

module.exports = multer({ storage: storage }).single('file');
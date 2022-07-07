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

const crypto = require('crypto');
const config = require('../config');

const key = config.CIPHER_KEY;
const iv_key = config.CIPHER_IV_KEY;

const iv = crypto.createHash('sha256').update(iv_key).digest();
const bufferedIV = Buffer.allocUnsafe(16);
iv.copy(bufferedIV);

function encrypt(text) {
  const hashedKey = crypto.createHash('sha256').update(key).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, bufferedIV);
  return [cipher.update(text, 'binary', 'hex'), cipher.final('hex')].join('');
}

function decrypt(encryptedText) {
  const hashedKey = crypto.createHash('sha256').update(key).digest();
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    hashedKey,
    bufferedIV
  );
  return [
    decipher.update(encryptedText, 'hex', 'binary'),
    decipher.final('binary'),
  ].join('');
}

module.exports = {
  encrypt,
  decrypt,
};
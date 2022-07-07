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

const mongoose = require('mongoose');
const Realm = require('./realm');
const Tenant = require('./tenant');
const Lease = require('./lease');
const Template = require('./template');

const DocumentSchema = mongoose.Schema({
  realmId: { type: String, ref: Realm },
  tenantId: { type: String, ref: Tenant },
  leaseId: { type: String, ref: Lease },
  templateId: { type: String, ref: Template },
  type: String, // one of 'text', 'file'
  name: String,
  description: String,
  mimeType: String, // used only when type === "file"
  expiryDate: Date, // used only when type === "file"
  contents: Object, // used only when type === "text"
  html: String, // used only when type === "text"
  url: String, // used only when type === "file"
  versionId: String, // used only when type === "file"
  createdDate: Date,
  updatedDate: Date,
});

DocumentSchema.pre('save', function (next) {
  const now = new Date();
  if (!this.createdDate) {
    this.createdDate = now;
  }
  this.updatedDate = now;
  next();
});

DocumentSchema.pre('findOneAndUpdate', function (next) {
  this.getUpdate().$set.updatedDate = new Date();
  next();
});

module.exports = mongoose.model('Document', DocumentSchema);
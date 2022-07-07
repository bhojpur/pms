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
const bcrypt = require('bcrypt');
const RealmModel = require('./realm');

const AccountSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  createdDate: Date,
});

// lowercase email
// hash user password before saving into database
AccountSchema.pre('save', function (next) {
  if (!this.createdDate) {
    this.createdDate = new Date();
  }
  this.email = this.email.toLowerCase();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

AccountSchema.post('save', function (account) {
  const name = `${account.firstname} ${account.lastname}`;
  RealmModel.updateMany(
    {
      members: {
        $elemMatch: { email: account.email },
      },
    },
    {
      $set: {
        'members.$.registered': true,
        'members.$.name': name,
      },
    },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
});

module.exports = mongoose.model('Account', AccountSchema);
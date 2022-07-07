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

const OF = require('./objectfilter');
const Model = require('./model');

class PropertyModel extends Model {
  constructor() {
    super('properties');
    this.schema = new OF({
      _id: String,
      type: String,
      name: String,
      description: String,
      surface: Number,
      phone: String,
      digicode: String,
      address: Object, // { street1, street2, zipCode, city, state, country }

      price: Number,

      // TODO moved in Occupant.properties model
      expense: Number,

      // TODO to remove, replaced by address
      building: String,
      level: String,
      location: String,
    });
  }

  findAll(realm, callback) {
    super.findAll(realm, (errors, properties) => {
      if (errors && errors.length > 0) {
        callback(errors);
        return;
      }

      callback(
        null,
        properties.sort((p1, p2) => {
          if (p1.type === p2.type) {
            return p1.name.localeCompare(p2.name);
          }
          return p1.type.localeCompare(p2.type);
        })
      );
    });
  }
}

module.exports = new PropertyModel();
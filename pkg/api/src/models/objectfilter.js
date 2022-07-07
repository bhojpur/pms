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

const sugar = require('sugar');
const moment = require('moment');
const logger = require('winston');
sugar.extend();

module.exports = class ObjectFilter {
  constructor(schema) {
    this.schema = schema;
  }

  filter(data) {
    return Object.keys(this.schema).reduce((filteredData, key) => {
      const type = this.schema[key];
      const value = data[key];

      if (typeof value != 'undefined') {
        if (type === Date) {
          filteredData[key] = null;
          if (typeof value == 'string') {
            const m = moment(value, 'DD/MM/YYYY');
            if (m.isValid()) {
              filteredData[key] = m.toDate();
            }
          } else if (value instanceof Date) {
            filteredData[key] = value;
          }
        } else if (type === Boolean) {
          if (
            typeof value == 'string' &&
            (value === 'true' || value === 'false')
          ) {
            filteredData[key] = value === 'true';
          } else if (typeof value == 'boolean') {
            filteredData[key] = value;
          }
        } else if (type === Number) {
          let number = value;
          if (typeof value == 'string') {
            number = Number(value.replace(',', '.'));
          }
          if (!isNaN(number)) {
            filteredData[key] = number;
          } else {
            filteredData[key] = 0;
          }
        } else if (type === Array) {
          if (Array.isArray(value)) {
            filteredData[key] = value;
          }
        } else if (type === Object) {
          if (typeof value == 'object') {
            filteredData[key] = value;
          }
        } else if (type === String) {
          if (key === '_id' && typeof value == 'object') {
            filteredData[key] = value.toString();
          } else if (typeof value == 'string') {
            filteredData[key] = value;
          }
        } else {
          logger.error(
            'type unsupported ' +
              type +
              ' for schema ' +
              JSON.stringify(this.schema)
          );
          //throw new Error('Cannot valid schema type unsupported ' + type);
        }
      } else {
        logger.silly(
          'undefined value for key ' +
            key +
            ' of schema ' +
            JSON.stringify(this.schema)
        );
      }
      return filteredData;
    }, {});
  }
};
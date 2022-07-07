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

const logger = require('winston');
const db = require('./db');

module.exports = class Model {
  constructor(collection) {
    this.collection = collection;
    db.addCollection(collection);
  }

  findOne(realm, id, callback) {
    db.findItemById(realm, this.collection, id, (errors, dbItems) => {
      if (errors && errors.length > 0) {
        callback(errors);
        return;
      }

      const item = dbItems && dbItems.length > 0 ? dbItems[0] : null;
      callback(null, this.schema ? this.schema.filter(item) : item);
    });
  }

  findAll(realm, callback) {
    this.findFilter(realm, {}, callback);
  }

  findFilter(realm, filter, callback) {
    db.listWithFilter(realm, this.collection, filter, (errors, dbItems) => {
      if (errors && errors.length > 0) {
        callback(errors);
        return;
      }
      const items = dbItems || [];
      if (this.schema) {
        items.forEach((item, index) => {
          items[index] = this.schema.filter(item);
        });
      }
      callback(null, items);
    });
  }

  upsert(realm, query, fieldsToSet, fieldsToSetOnInsert, callback) {
    const updateSchema = this.updateSchema || this.schema;

    if (!updateSchema.exists(fieldsToSet)) {
      logger.error('cannot update', this.collection, fieldsToSet, 'not valid');
      callback(['cannot update database fields not valid']);
      return;
    }

    db.upsert(
      realm,
      this.collection,
      query,
      fieldsToSet,
      this.schema.filter(fieldsToSetOnInsert),
      (errors) => {
        if (errors && errors.length > 0) {
          callback(errors);
          return;
        }
        callback(null);
      }
    );
  }

  update(realm, item, callback) {
    const updateSchema = this.updateSchema || this.schema;
    const itemToUpdate = updateSchema.filter(item);
    db.update(realm, this.collection, itemToUpdate, (errors, dbItem) => {
      if (errors && errors.length > 0) {
        return callback(errors);
      }
      callback(null, this.schema.filter(dbItem));
    });
  }

  add(realm, item, callback) {
    const addSchema = this.addSchema || this.schema;
    const itemToAdd = addSchema.filter(item);
    db.add(realm, this.collection, itemToAdd, (errors, dbItem) => {
      if (errors && errors.length > 0) {
        callback(errors);
        return;
      }
      callback(null, this.schema.filter(dbItem));
    });
  }

  remove(realm, ids, callback) {
    db.remove(realm, this.collection, ids, (errors) => {
      callback(errors && errors.length > 0 ? errors : null);
    });
  }
};
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

const config = require('../config');
const mongojs = require('mongojs');
const logger = require('winston');

require('sugar').extend();

function stringId2ObjectId(obj) {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (key === '_id') {
        if (typeof obj[key] == 'string') {
          obj[key] = mongojs.ObjectId(obj[key]);
        } else if (typeof obj[key] == 'object' && obj[key].$in) {
          obj[key].$in = obj[key].$in.map((_id) => mongojs.ObjectId(_id));
        }
      } else if (typeof obj[key] == 'object') {
        obj[key] = stringId2ObjectId(obj[key]);
      }
    });
  }
  return obj;
}

function buildFilter(realm, inputfilter) {
  const filter = stringId2ObjectId(inputfilter);
  if (realm) {
    const realmFilter = {
      realmId: realm._id,
    };
    const andArray = filter.$query ? filter.$query.$and : null;
    if (andArray) {
      andArray.push(realmFilter);
    } else {
      if (!filter.$query) {
        filter.$query = {};
      }
      filter.$query.$and = [realmFilter];
    }
  }
  return filter;
}

function logDBError(err) {
  logger.error(new Error().stack);
  logger.error(err);
}

const collections = [];
let db;

module.exports = {
  init() {
    if (!db) {
      return new Promise((resolve, reject) => {
        logger.debug(`connecting database ${config.MONGO_URL}...`);
        db = mongojs(config.MONGO_URL, collections);
        db.listCollections(() => {}); // Run this command to force connection a this stage
        db.on('connect', function () {
          logger.info(`connected to ${config.MONGO_URL}`);
          resolve(db);
        });

        db.on('error', function (err) {
          logger.error(`cannot connect to ${config.MONGO_URL}`);
          reject(err);
        });
      });
    }
    logger.debug('database already connected');
    return Promise.resolve(db);
  },

  exists() {
    return new Promise((resolve /*, reject*/) => {
      db.getCollectionNames((error, collectionNames) => {
        resolve(!(error || !collectionNames || collectionNames.length === 0));
      });
    });
  },

  addCollection(collection) {
    if (collections.indexOf(collection.toLowerCase()) >= 0) {
      logger.silly(`db collection ${collection} already added`);
      return;
    }
    collections.push(collection.toLowerCase());
    logger.silly(`db collections have been updated ${collections}`);
  },

  findItemById(realm, collection, id, callback) {
    logger.info(
      `find item by id in collection ${collection} ${
        realm && realm.length > 0 ? 'in realm: ' + realm.name : ''
      }`
    );
    const query = buildFilter(realm, {
      $query: {
        _id: id,
      },
    });
    logger.debug(`\tfilter is ${JSON.stringify(query)}`);

    db[collection].find(query, function (err, dbItems) {
      if (err || !dbItems || dbItems.length < 0) {
        if (err) {
          logDBError(err);
        }
        callback(['item has not been found in database']);
        return;
      }
      logger.silly('\treturned values', dbItems.join('\n'));
      callback([], dbItems);
    });
  },

  listWithFilter(realm, collection, filter, callback) {
    logger.info(
      `find items in collection: ${collection}${
        realm && realm.length > 0 ? ' in realm: ' + realm.name : ''
      }`
    );
    const query = buildFilter(realm, filter);
    if (query) {
      logger.debug(`\tfilter is ${JSON.stringify(query)}`);
    }
    db[collection].find(query, function (err, dbItems) {
      if (err) {
        logDBError(err);
        callback(['item has not been found in database']);
        return;
      }
      if (dbItems) {
        logger.silly('\treturned values', dbItems.join('\n'));
      } else {
        logger.silly('\treturned an empty list');
      }
      callback([], dbItems || []);
    });
  },

  add(realm, collection, item, callback) {
    logger.info(
      `insert item in collection ${collection} ${
        realm && realm.length > 0 ? 'in realm: ' + realm.name : ''
      }`
    );

    item._id = mongojs.ObjectId();
    if (realm) {
      item.realmName = realm.name;
      item.realmId = realm._id;
    }
    logger.debug('\titem is', item);
    db[collection].save(item, function (err, saved) {
      if (err || !saved) {
        if (err) {
          logDBError(err);
        }
        callback(['item not added in database']);
        return;
      }
      item._id = item._id.toString();
      logger.silly('\treturned values is', item);
      callback([], item);
    });
  },

  update(realm, collection, item, callback) {
    logger.info(
      `update items in collection: ${collection}${
        realm && realm.length > 0 ? ' in realm: ' + realm.name : ''
      }`
    );
    const _id = item._id.toString();
    delete item._id;
    const filter = buildFilter(null, { _id });
    const itemToUpdate = {
      $set: item,
    };
    if (realm) {
      itemToUpdate.$set = Object.merge(item, {
        realmName: realm.name,
        realmId: realm._id,
      });
    }
    logger.debug(`\tfilter is ${JSON.stringify(filter)}`);
    logger.silly(`\titem to update is ${JSON.stringify(itemToUpdate)}`);

    db[collection].update(
      filter,
      itemToUpdate,
      {
        multi: true,
      },
      (err, saved) => {
        if (err || !saved) {
          if (err) {
            logDBError(err);
          }
          callback(['item has not been updated in database']);
          return;
        }
        item._id = _id;
        logger.silly('\treturned value is', item);
        callback([], item);
      }
    );
  },

  upsert(realm, collection, query, fieldsToSet, fieldsToSetOnInsert, callback) {
    logger.info(
      `upsert in collection ${collection} ${
        realm && realm.length > 0 ? 'in realm: ' + realm.name : ''
      }`
    );

    const fieldsToUpdate = {
      $set: fieldsToSet,
      $setOnInsert: fieldsToSetOnInsert,
    };
    if (realm) {
      fieldsToUpdate.$set = Object.merge(fieldsToSet, {
        realmName: realm.name,
        realmId: realm._id,
      });
    }
    const options = {
      upsert: true,
    };

    logger.debug(`\tfilter is ${JSON.stringify(query)}`);
    logger.silly(`\titem to update is ${JSON.stringify(fieldsToSet)}`);
    logger.silly(`\titem to insert is ${JSON.stringify(fieldsToSetOnInsert)}`);
    db[collection].update(query, fieldsToUpdate, options, (err, saved) => {
      if (err || !saved) {
        if (err) {
          logDBError(err);
        }
        callback(['item has not been updated in database']);
        return;
      }
      callback([]);
    });
  },

  remove(realm, collection, items, callback) {
    logger.info(
      `remove items in collection: ${collection}${
        realm && realm.length > 0 ? 'in realm: ' + realm.name : ''
      }`
    );
    const filter = buildFilter(null, {
      $or: items.map((item) => {
        return { _id: item };
      }),
    });

    logger.debug(`\tfilter is ${JSON.stringify(filter)}`);
    db[collection].remove(filter, function (err, deleted) {
      if (err || !deleted) {
        if (err) {
          logDBError(err);
        }
        callback(['item has not been deleted in database']);
        return;
      }
      callback([]);
    });
  },
};
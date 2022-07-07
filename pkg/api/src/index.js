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
const i18n = require('i18n');
const path = require('path');
const mongoosedb = require('@bhojpur/common/models/db');

const config = require('./config');
const server = require('./server');
const db = require('./models/db');
const restoredb = require('../scripts/mongorestore');
const migratedb = require('../scripts/migration');

require('@bhojpur/common/utils/httpinterceptors')();

process.on('SIGINT', () => {
  //TODO disconnect db (mongojs)
  process.exit(0);
});

i18n.configure({
  locales: ['en', 'fr-FR', 'pt-BR', 'de-DE'],
  directory: path.join(__dirname, 'locales'),
  updateFiles: false,
});

async function startService() {
  try {
    if (config.restoreDatabase) {
      await restoredb();
      logger.debug('database restored');
    }

    // migrate db to the new models
    await migratedb();

    await db.init();
    await mongoosedb.connect();

    server.listen(config.appHttpPort, () => {
      config.log();
      logger.info('Listening port ' + config.appHttpPort);
      if (config.productive) {
        logger.info('In production mode');
      } else {
        logger.info('In development mode');
      }
    });
  } catch (err) {
    logger.error(err);
    try {
      await mongoosedb.disconnect();
    } catch (error) {
      logger.error(error);
    }
    process.exit(1);
  }
}

startService();
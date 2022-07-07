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

const express = require('express');
const cookieParser = require('cookie-parser');
const expressWinston = require('express-winston');
const logger = require('winston');
const mongoosedb = require('@bhojpur/common/models/db');
const config = require('./config');
const redis = require('@bhojpur/common/models/redis');
const apiRouter = require('./apirouter');

process.on('SIGINT', () => {
  process.exit(0);
});

const startApplication = async (apiRouter) => {
  // configure default logger
  logger.remove(logger.transports.Console);
  logger.add(logger.transports.Console, {
    level: config.LOGGER_LEVEL,
    colorize: true,
  });

  logger.debug('starting service...');
  const app = express();

  // Express log through out winston
  app.use(
    expressWinston.logger({
      transports: [
        new logger.transports.Console({
          json: false,
          colorize: true,
        }),
      ],
      meta: false, // optional: control whether you want to log the meta data about the request (default to true)
      msg: String, //'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
      colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
      //ignoreRoute: function( /*req, res*/ ) {
      //    return false;
      //} // optional: allows to skip some log messages based on request and/or response
    })
  );

  app.use(
    expressWinston.errorLogger({
      transports: [
        new logger.transports.Console({
          json: false,
          colorize: true,
        }),
      ],
    })
  );

  // parse cookies
  app.use(cookieParser());

  // parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }));

  // parse application/json
  app.use(express.json());

  // expose api
  app.use(apiRouter);

  await app.listen(config.PORT).on('error', (error) => {
    throw new Error(error);
  });

  return app;
};

///////////////////////////////////////////////////////////////////////////////
//  Main
///////////////////////////////////////////////////////////////////////////////
(async () => {
  // Connect to Redis
  try {
    await redis.connect();
    await redis.monitor();
  } catch (exc) {
    logger.error(exc);
    process.exit(1);
  }

  // Connect to Mongo
  try {
    await mongoosedb.connect();
  } catch (exc) {
    logger.error(exc);
    try {
      await redis.disconnect();
    } catch (error) {
      logger.error(error);
    }
    process.exit(1);
  }

  // Run server
  try {
    await startApplication(apiRouter);
    config.log();
    logger.debug(`Rest API listening on port ${config.PORT}`);
    logger.info('Authenticator service ready');
  } catch (exc) {
    logger.error(exc.message);
    try {
      await Promise.all[(redis.disconnect(), mongoosedb.disconnect())];
    } catch (error) {
      logger.error(error);
    }
    process.exit(1);
  }
})();
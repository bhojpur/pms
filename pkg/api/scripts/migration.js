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
const mongoosedb = require('@bhojpur/common/models/db');
const Template = require('@bhojpur/common/models/template');
const Document = require('@bhojpur/common/models/document');
const Tenant = require('@bhojpur/common/models/tenant');

async function withDB(job) {
  let failure = false;
  try {
    await mongoosedb.connect();
    await job();
  } catch (error) {
    logger.error(error);
    failure = true;
  } finally {
    try {
      await mongoosedb.disconnect();
    } catch (error) {
      logger.error(error);
    }
  }
  return failure;
}

// Main
module.exports = async (processExitOnCompleted = false) => {
  let failure = false;
  try {
    failure = await withDB(async () => {
      await Promise.all([
        Tenant.updateMany(
          { leaseId: 'undefined' },
          { $set: { leaseId: null } }
        ),
        Template.updateMany({ type: 'contract' }, { $set: { type: 'text' } }),
        Document.updateMany({ type: 'contract' }, { $set: { type: 'text' } }),
      ]);
    });
  } catch (error) {
    logger.error(error);
    failure = true;
  } finally {
    if (processExitOnCompleted) {
      process.exit(failure ? 1 : 0);
    }
  }
};
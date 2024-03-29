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

const { promisify } = require('util');
const moment = require('moment');
const axios = require('axios');
const logger = require('winston');
const config = require('../config');
const occupantModel = require('../models/occupant');

const _sendEmail = async (req, message) => {
  const postData = {
    templateName: message.document,
    recordId: message.tenantId,
    params: {
      term: message.term,
    },
  };

  try {
    const response = await axios.post(config.EMAILER_URL, postData, {
      headers: {
        authorization: req.headers.authorization,
        organizationid: req.headers.organizationid || String(req.realm._id),
        'Accept-Language': req.headers['accept-language'],
      },
    });

    logger.debug(`data sent: ${JSON.stringify(postData)}`);
    logger.debug(`response: ${JSON.stringify(response.data)}`);

    return response.data.map(
      ({ templateName, recordId, params, email, status /*, error*/ }) => ({
        document: templateName,
        tenantId: recordId,
        term: params.term,
        email,
        status,
      })
    );
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    logger.error(`POST ${config.EMAILER_URL} failed`);
    logger.error(`data sent: ${JSON.stringify(postData)}`);
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};

module.exports = {
  send: async (req, res) => {
    try {
      const realm = req.realm;
      const { document, tenantIds, terms, year, month } = req.body;
      const defaultTerm = moment(`${year}/${month}/01`, 'YYYY/MM/DD').format(
        'YYYYMMDDHH'
      );
      const findTenant = promisify(occupantModel.findOne).bind(occupantModel);

      // TODO: send emails in parallel not sequentially for better perf
      const statusList = [];
      for (let i = 0; i < tenantIds.length; i++) {
        const tenantId = tenantIds[i];
        const term = Number((terms && terms[i]) || defaultTerm);

        // Find tenant recipient
        let tenant;
        try {
          tenant = await findTenant(realm, tenantId);
        } catch (error) {
          logger.error(error);
          statusList.push({
            tenantId,
            document,
            term,
            error: {
              status: 404,
              message: `tenant ${tenantId} not found`,
            },
          });
          continue;
        }

        // Send email to tenant
        try {
          const status = await _sendEmail(req, {
            name: tenant.name,
            tenantId,
            document,
            term,
          });
          statusList.push({
            name: tenant.name,
            tenantId,
            document,
            term,
            ...status,
          });
        } catch (error) {
          logger.error(error);
          statusList.push({
            name: tenant.name,
            tenantId,
            document,
            term,
            error: error.response?.data || {
              status: 500,
              message: `Something went wrong when sending the email to ${tenant.name}`,
            },
          });
        }
      }

      res.json(statusList);
    } catch (error) {
      logger.error(error);
      res.status(500).send('an unexpected error occured when sending emails');
    }
  },
};
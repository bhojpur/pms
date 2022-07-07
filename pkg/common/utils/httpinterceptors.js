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

const axios = require('axios');
const logger = require('winston');

module.exports = () => {
  // For logging purposes
  axios.interceptors.request.use(
    (config) => {
      if (config?.method && config?.url) {
        logger.info(`${config.method.toUpperCase()} ${config.url}`);
      }
      logger.info(config.headers);
      return config;
    },
    (error) => {
      logger.error(error?.message || error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      if (
        response?.config?.method &&
        response?.config?.url &&
        response?.status
      ) {
        logger.info(
          `${response.config.method.toUpperCase()} ${response.config.url} ${
            response.status
          }`
        );
      }
      return response;
    },
    (error) => {
      if (
        error?.config?.method &&
        error?.response?.url &&
        error?.response?.status
      ) {
        logger.error(
          `${error.config.method.toUpperCase()} ${error.config.url} ${
            error.response.status
          }`
        );
      } else {
        logger.error(error?.message || error);
      }
      return Promise.reject(error);
    }
  );
};
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

const crypto = require('crypto');
const clui = require('clui');
const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const Spinner = clui.Spinner;

const generateRandomToken = (size = 64) => {
  return crypto.randomBytes(size).toString('hex');
};

const removeEndLineBreak = (log) => {
  return log.replace(/\s$/g, '');
};

const loadEnv = (wd, runMode) => {
  dotenv.config(); // load .env config
  const env = dotenv.config({
    // complete environment variables with 'dev.env" or "prod.env"
    path: path.resolve(
      wd || process.cwd(),
      runMode === 'prod' ? 'prod.env' : 'dev.env'
    ),
  });
  dotenvExpand.expand(env); // expand env variables which reference env variable
};

const runCommand = async (cmd, parameters = [], options = {}, waitLog = '') => {
  let spinner;
  if (waitLog) {
    spinner = new Spinner(waitLog);
    spinner.start();
  }
  return new Promise((resolve, reject) => {
    const errors = [];
    try {
      const shellCommand = spawn(cmd, parameters, {});

      shellCommand.stdout.on('data', (data) => {
        spinner && spinner.stop();
        console.log(removeEndLineBreak(data.toString()));
        spinner && spinner.start();
      });
      shellCommand.stderr.on('data', (data) => {
        if (options.logErrorsDuringExecution) {
          console.error(chalk.red(removeEndLineBreak(data.toString())));
        } else {
          errors.push(removeEndLineBreak(data.toString()));
        }
      });
      shellCommand.on('error', (data) => {
        if (options.logErrorsDuringExecution) {
          console.error(chalk.red(removeEndLineBreak(data.toString())));
        } else {
          errors.push(removeEndLineBreak(data.toString()));
        }
      });
      shellCommand.on('close', (exitCode) => {
        spinner && spinner.stop();
        if (exitCode !== 0 && errors.length) {
          errors.forEach((error) => console.error(chalk.red(error)));
        }

        if (exitCode !== 0) {
          reject(exitCode);
        } else {
          resolve(exitCode);
        }
      });
    } catch (error) {
      spinner && spinner.stop();
      console.error(chalk.red(error));
    }
  });
};

const runCompose = async (
  composeCmd,
  composeOptions = { runMode: 'dev' },
  commandOptions = { logErrorsDuringExecution: false },
  waitLog = ''
) => {
  const prodComposeArgs = [
    '-f',
    'docker-compose.microservices.base.yml',
    '-f',
    'docker-compose.microservices.prod.yml',
  ];
  const devComposeArgs = [
    '-f',
    'docker-compose.microservices.base.yml',
    '-f',
    'docker-compose.microservices.dev.yml',
    '-f',
    'docker-compose.microservices.test.yml',
  ];

  loadEnv(composeOptions.wd, composeOptions.runMode);
  await runCommand(
    'docker-compose',
    [
      ...(composeOptions.runMode === 'prod' ? prodComposeArgs : devComposeArgs),
      ...composeCmd,
    ],
    commandOptions,
    waitLog
  );
};

const computeUrl = (baseUrl) => {
  const url = new URL(baseUrl);
  return {
    baseUrl: `${url.protocol}//${url.hostname}`,
    basePath: url.pathname !== '/' ? url.pathname : '',
    port: url.port,
  };
};

module.exports = {
  generateRandomToken,
  loadEnv,
  runCompose,
  computeUrl,
};
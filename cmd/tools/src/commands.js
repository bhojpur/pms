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

const fs = require('fs');
const path = require('path');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { generateRandomToken, runCompose, computeUrl } = require('./utils');

const initDirectories = () => {
  const mongoDir = path.join('.', 'data', 'mongodb');
  if (!fs.existsSync(mongoDir)) {
    fs.mkdirSync(mongoDir, { recursive: true });
  }
};

const displayHeader = () => {
  clear();
  console.log(
    chalk.white(
      figlet.textSync('BhojpurPMS', {
        horizontalLayout: 'full',
      })
    )
  );
  console.log(
    chalk.white(
      'The Bhojpur PMS application helps landlords manage their real-estate properties efficiently'
    )
  );
  console.log('');
};

const build = async () => {
  try {
    await runCompose(
      ['build', '--no-cache', '--force-rm', '--quiet'],
      { runMode: 'prod' },
      {},
      'building containers...'
    );

    console.log(chalk.green('build completed'));
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const start = async () => {
  try {
    initDirectories();
    await runCompose(
      ['up', '-d', '--force-recreate', '--remove-orphans'],
      { runMode: 'prod' },
      {},
      'starting the application...'
    );

    console.log(
      chalk.green(`Front-end ready and accessible on ${process.env.APP_URL}`)
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const stop = async (runConfig = { runMode: 'prod' }) => {
  try {
    await runCompose(
      ['rm', '--stop', '--force'],
      { runMode: runConfig.runMode },
      {},
      'stopping current running application...'
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const dev = async () => {
  try {
    initDirectories();
    await runCompose(
      ['up', '--build', '--force-recreate', '--remove-orphans', '--no-color'],
      {
        runMode: 'dev',
      },
      {
        logErrorsDuringExecution: true,
      }
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const status = async () => {
  try {
    await runCompose(
      ['ps'],
      {
        runMode: 'prod',
      },
      {
        logErrorsDuringExecution: true,
      }
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const config = async (runMode) => {
  try {
    await runCompose(
      ['config'],
      {
        runMode,
      },
      {
        logErrorsDuringExecution: true,
      }
    );
  } catch (error) {
    console.log(chalk.red(error));
  }
};

const displayHelp = () => {
  console.log(
    chalk.white('Usage: pmsutl [option...] {dev|build|status|start|stop|config}')
  );
};

const askForEnvironmentVariables = () => {
  const questions = [
    {
      name: 'dbData',
      type: 'list',
      message: 'Do you want the database to be populated with?',
      choices: [
        { name: 'empty data', value: 'empty_data' },
        { name: 'demonstration data', value: 'demo_data' },
      ],
      default: 'empty_data',
    },
    {
      name: 'mailgunConfig',
      type: 'confirm',
      message:
        'Have you created a mailgun account for sending emails (https://www.mailgun.com/)?',
    },
    {
      name: 'mailgunApiKey',
      type: 'input',
      message: 'Enter the mailgun API key:',
      when: (answers) => answers.mailgunConfig,
    },
    {
      name: 'mailgunDomain',
      type: 'input',
      message: 'Enter the mailgun domain:',
      when: (answers) => answers.mailgunConfig,
    },
    {
      name: 'mailgunFromEmail',
      type: 'input',
      message: 'Enter the sender email address (from):',
      when: (answers) => answers.mailgunConfig,
    },
    {
      name: 'mailgunReplyToEmail',
      type: 'input',
      message: 'Enter the reply to email address (reply to):',
      when: (answers) => answers.mailgunConfig,
    },
    {
      name: 'appUrl',
      type: 'input',
      message: 'Enter the URL to use to access the front-end:',
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch (error) {
          return false;
        }
      },
      default: 'http://localhost:8080/app',
    },
  ];
  return inquirer.prompt(questions);
};

const askRunMode = () => {
  const questions = [
    {
      name: 'runMode',
      type: 'list',
      message: 'How do you want to run?',
      choices: [
        { name: 'production mode', value: 'prod' },
        { name: 'development mode', value: 'dev' },
      ],
      default: 'prod',
    },
  ];
  return inquirer.prompt(questions);
};

const writeDotEnv = (config) => {
  const cipherKey = generateRandomToken(32);
  const cipherIvKey = generateRandomToken(32);
  const tokenDbPassword = generateRandomToken(64);
  const accessTokenSecret = generateRandomToken(64);
  const refreshTokenSecret = generateRandomToken(64);
  const resetTokenSecret = generateRandomToken(64);
  const { baseUrl, basePath, port } = computeUrl(config.appUrl);
  const mailgunApiKey = config.mailgunApiKey || '';
  const mailgunDomain = config.mailgunDomain || '';
  const mailgunFromEmail = config.mailgunFromEmail || '';
  const mailgunReplyToEmail = config.mailgunReplyToEmail || '';
  const mailgunBccEmails = config.mailgunBccEmails || '';
  const demoMode = config.dbData === 'demo_data';
  const restoreDb = demoMode;
  const dbName = demoMode ? 'demodb' : 'pms';
  const sendEmails = !!config.mailgunConfig;
  const content = `
## mongo
BASE_DB_URL=mongodb://mongo/${dbName}
CIPHER_KEY=${cipherKey}
CIPHER_IV_KEY=${cipherIvKey}

## authenticator
AUTHENTICATOR_TOKEN_DB_PASSWORD=${tokenDbPassword}
AUTHENTICATOR_ACCESS_TOKEN_SECRET=${accessTokenSecret}
AUTHENTICATOR_REFRESH_TOKEN_SECRET=${refreshTokenSecret}
AUTHENTICATOR_RESET_TOKEN_SECRET=${resetTokenSecret}

## emailer
ALLOW_SENDING_EMAILS=${sendEmails}
MAILGUN_API_KEY=${mailgunApiKey}
MAILGUN_DOMAIN=${mailgunDomain}
EMAIL_FROM=${mailgunFromEmail}
EMAIL_REPLY_TO=${mailgunReplyToEmail}
EMAIL_BCC=${mailgunBccEmails}

## api
DEMO_MODE=${demoMode}
RESTORE_DB=${restoreDb}

## frontend
${basePath ? `BASE_PATH=${basePath}` : ''}
${port ? `NGINX_PORT=${port}` : ''}
APP_URL=${baseUrl}:$\{NGINX_PORT}$\{BASE_PATH}
API_URL=${baseUrl}:$\{NGINX_PORT}/api/v2
`;
  fs.writeFileSync('.env', content);
};

module.exports = {
  config,
  status,
  build,
  dev,
  start,
  stop,
  displayHeader,
  displayHelp,
  askForEnvironmentVariables,
  askRunMode,
  writeDotEnv,
};
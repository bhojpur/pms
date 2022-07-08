# Bhojpur PMS - Property Management System

The `Bhojpur PMS` is a comprehensive *property management* system applied within
the [Bhojpur.NET Platform](https://github.com/bhojpur/platform/) ecosystem for
delivery of distributed `applications` or `services`. It is based on scalable,
micro-services architecture.

## Key Features

- Launch a Realtor's web portal
- Store information of the properties and the tenants in one place
- Create rent leases from templates
- Follow the rent payments and manage the rent overdues
- Create custom documents to communicate with tenants
- Manage the real estate business with several collaborators and in different organizations

## Simple Usage

You need to have `Bhojpur PMS` command line interface tool (i.e. [pmsutl](./bin/pmsutl))
installed on the target system. After that, you can run the server using following command.

```bash
pmsutl start
```

then, open `http://localhost:8080/app` in a web-browser to access frontend application.
It runs different services as a collection of Containers in your cluster. To stop the
server, type the following

```bash
pmsutl stop
```

## Pre-requisites

You must have the following installed on the target computer.

- [Docker](https://www.docker.com/) container engine
- [Docker Compose](https://docs.docker.com/compose/install/) for building images
- [Node.js](https://nodejs.org/) runtime engine
- [Yarn](https://yarnpkg.com/) package manager
- [MongoDB](https://www.mongodb.com/) NoSQL database engine
- [Redis](https://redis.io/) *in-memory* data caching engine
- [Express](https://expressjs.com/) web application framework
- [NGINX](https://www.nginx.com/) proxy server

Also, please install the `pkg` tool globally using the following command.

```bash
npm install -g pkg
```

## Build Source Code

You can issue the following commands in a new Terminal window to install the
`Yarn` package manager and `Node.js` package dependencies.

```bash
yarn install
task install-packages
```

### Command Line Interface

Simply issue the following commands (e.g., `task build-tools`) in a new Terminal
window to creates [pmsutl](./bin/pmsutl) command line interface utility for your
operating system.

```bash
cd cmd/tools && npm i
pkg cmd/tools/package.json --output bin/pmsutl
mv bin/pmsutl-macos bin/pmsutl
mv bin/pmsutl-win.exe bin/pmsutl.exe
```

### Microservices Container

All the container images could be built automatically by [pmsutl](./bin/pmsutl)
tool using following command.

```bash
pmsutl build
```

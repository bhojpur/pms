# Bhojpur PMS - Property Management System

The `Bhojpur PMS` is a comprehensive *property management* system applied within
the [Bhojpur.NET Platform](https://github.com/bhojpur/platform/) ecosystem for
delivery of distributed `applications` or `services`. It is based on a scalable,
micro-services architecture.

## Key Features

- Launch a *web portal* or *marketplace8 for Realtor's (e.g. Builder, Broker)
- Provides virtual tour of listed properties to propspective clients
- Booking Management of Properties (e.g. Studio, Apartment, Office, Store)
- Ability to manage construction Projects, Financial, and Resources
- IoT/M2M enabled Building Automation and Remote Management solution
- Document Assembly for  legal agreements, leases, contracts, etc
- Store information of rented Properties and the Tenants in one place
- Create and modify rent leases from document templates
- Follow the rent payments and manage the rent overdues
- Create custom documents to communicate with Tenants
- Manage real estate business with several collaborators and in different organizations

## Simple Usage

### Rental Management

You need to have `Bhojpur PMS` command line interface tool (i.e. [pmsutl](./bin/pmsutl))
installed on the target system. After that, you can run the server using following command.

```bash
pmsutl start
```

then, open `http://localhost:8080/app` in a web-browser to access frontend application.
It runs different services as a collection of `Containers` in your cluster. To stop the
Bhojpur PMS rental server instance, type the following

```bash
pmsutl stop
```

### Project Management

To start the `Bhojpur PMS` - *Project Office* frontend web application, issue the
following commands in a new Terminal window.

```bash
cd pkg/project
yarn start
```

The project server requires access to MySQL database instance. After project server has
started succeffully, you can issue the following command.

```bash
cd pkg/builder
yarn start
```

then, open `http://localhost:8081/` URL in your web-browser to access application.

## Pre-requisites

You must have the following software installed on the target computer.

- [Docker](https://www.docker.com/) container engine
- [Docker Compose](https://docs.docker.com/compose/install/) for building images
- [Node.js](https://nodejs.org/) runtime engine
- [Yarn](https://yarnpkg.com/) package manager
- [MySQL](https://www.mysql.com/) database
- [MongoDB](https://www.mongodb.com/) NoSQL database engine
- [Redis](https://redis.io/) *in-memory* data caching engine
- [Express](https://expressjs.com/) web application framework
- [NGINX](https://www.nginx.com/) proxy server

Also, please install the `pkg` tool globally using the following command.

```bash
npm install -g pkg
```

### Database Configuration

You need to create a database (namely `bhojpur`) in your MySQL server instance. Type
the following commands to create the database and grant required level of access.

```bash
mysql -u root -p
mysql> create database bhojpur;
mysql> grant all on bhojpur.* to 'root'@'localhost';
mysql> exit;
```

## Build Source Code

You can issue the following commands in a new Terminal window to install the
`Yarn` package manager and `Node.js` package dependencies.

```bash
ncu -u
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

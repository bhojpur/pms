# Bhojpur PMS - Property Management System

The `Bhojpur PMS` is a comprehensive property management system applied within
the [Bhojpur.NET Platform](https://github.com/bhojpur/platform/) ecosystem for
delivery of distributed `applications` or `services`.

## Simple Usage

You need to have `pmsutl` tools installed. Run the server using following command.

```bash
pmsutl start
```

then, open `http://localhost:8080/app` in a web-browser to access frontend application.

## Pre-requisites

You must have the following installed on the target computer.

- `Node.js` runtime engine
- `Express` framework
- `Docker` and [Docker Compose](https://docs.docker.com/compose/install/)

Also, please install the `pkg` tool globally.

```bash
npm install -g pkg
```

## Build Source Code

You can issue the following commands in a new Terminal window to install the
`Yarn` and `Node.js` package dependencies.

```bash
yarn install
```

### Command Line Interface

Simply issue the following commands in a new Terminal window.

```bash
cd cmd/tools && npm i
pkg cmd/tools/package.json --output bin/pmsutl
mv bin/pmsutl-macos bin/pmsutl
mv bin/pmsutl-win.exe bin/pmsutl.exe
```

It creates `pmsutl` command line interface tool for your operating system.

# server helper

[![npm version](https://badge.fury.io/js/%40gustavnikolaj%2Fserver-helper.svg)](https://www.npmjs.com/package/@gustavnikolaj/server-helper)
[![Build Status](https://travis-ci.com/gustavnikolaj/server-helper.svg?branch=master)](https://travis-ci.com/gustavnikolaj/server-helper)

Simple node.js server helper module.

- It will run your server, and allow you to have a clean main application file,
  which won't be cluttered with bootstrap code.
- It can be used to restart your server on file change for a nice development
  experience.

## Example

```js
// app.js

const express = require("express");

module.exports = function appFactory() {
  const app = express();

  app.get("/", (req, res, next) => {
    res.send(`Hello, world!`);
  });

  return app;
};
```

```
$ server-helper app.js
```

## CLI Options

- `--watch` / `-w`: Enable automatic restarting on file changes.
- `--port` / `-p`: Change the port number. [Default: 3000]
- `--host` / `-h`: Change the host.

## Programmatic use:

```js
// start.js

const serverHelper = require("@gustavnikolaj/server-helper");

serverHelper({
  entrypoint: require.resolve("./app.js"),
  port: 5000
});
```

```
$ node start.js
```

The command line flags are still supported.

## Config

Configuration can be given in multiple different ways, to support different
use-cases. See [doc/background/configuration.md](doc/background/configuration).

Options given as cli flags are used before options given as environment
variables, which are used before options given in the programmatic interface.

### Configuration through cli flags

- `--watch` / `-w`: Enable automatic restarting on file changes.
- `--port` / `-p`: Change the port number. [Default: 3000]
- `--host` / `-h`: Change the host.

The path to the entrypoint file is given as the only non-flag argument.

### Configuration through environment variables.

Configuration can also be passed through environment variables.

- `PORT`: The port number to listen to.
- `SERVERHELPER_PORT`: Same as `PORT`, but higher specificity.
- `SERVERHELPER_HOST`: What host to bind to.

### Configuration through options in api mode

You call serverHelper with an options object as the only argument. This can only
be done when invoking it programatically.

Supported properties:

- `entrypoint`: The path to the file that implements the server handler.
- `port`: The port number to listen to. (number)
- `host`: The host to bind to. (string)
- `watch`: Enables watch mode. (boolean)

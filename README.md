# server helper

[![Build Status](https://travis-ci.com/gustavnikolaj/server-helper.svg?branch=master)](https://travis-ci.com/gustavnikolaj/server-helper)

Simple node.js server helper module.

- It will run your server, and allow you to have a clean main application file,
  which won't be cluttered with bootstrap code.
- It can be used to restart your server on file change for a nice development
  experience.
- It can be set up to run the process in band, making it easier to attach
  debuggers.
- It will work with both koa and express. (Any server that exposes a `listen`
  method, really)

## Example

```js
// server-start.js

const serverHelper = require("@gustavnikolaj/server-helper");
const { resolve } = require("path");

serverHelper({
  inBand: !!process.argv.find(x => x === "--debug"),
  appFileName: resolve(__dirname, "../lib/app"),
  config: {
    port: 5000,
    typeOfWorld: "Express-world"
  }
});
```

```js
// app.js

const express = require("express");

module.exports = function appFactory(config) {
  const app = express();

  app.get("/", (req, res, next) => {
    res.send(`Hello, ${config.typeOfWorld || "world"}!`);
  });

  return app;
};
```

## Options

### `options.inBand`

Accepts a boolean. If set to true the application will be run in the same
process as server-helper itself. False by default.

### `options.appFileName`

Required. Absolute path to the main application file. The main application
file must export a single function, which must return an application. When
called it will be passed the configuration.

### `options.configFileName`

An absolute path to a javascript or json file that can be required. This is the
configuration that will be passed to the application file. Either this option
or the `options.config` option must be passed.

### `options.config`

The same as `options.configFileName` except that this allows you to pass in a
plain old javascript object directly.

## Config

Parts of the configuration will also be read by server-helper.

### `config.port`

By default the server will start on port 3000. By setting `config.port` you can
control what port you want it to start on. The value, if provided, must be a
number.

### `config.watch`

Glob patterns for files that you want the server to watch for changes in order
to trigger restarts.

If you set it as true, it will use the pattern `**/*.js` in the folder that
contains the application file.

If you set `options.appFileName` to `/Users/gustav/Projects/foo/server/app.js`
it will watch all files matching `/Users/gustav/Projects/foo/server/**/*.js`.

Instead of a boolean, you can also pass in your own patterns. A single string,
or an array of strings.

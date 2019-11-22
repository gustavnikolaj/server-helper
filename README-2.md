# Example

```js
// In start.js

const serverHelper = require("server-helper");

serverHelper({
  app: require.resolve("./app"),
  config: require.resolve("./config")
});

// In config.js

module.exports = function resolveConfiguration(opts, env) {
  // `opts` would contain the options as resolved from serverHelper
  // e.g. a boolean property watch, or a port number as resolved by
  // serverHelper.

  // `env` would contain process.env.

  return {
    apiKey: env.MY_SECRET_API_KEY
  };
};

// app.js

const express = require("express");

module.exports = function createApp(config) {
  // config is the object returned from config.js

  const app = express();

  // ...

  return app;
};
```

# Example

```
$ node start.js
> No port number given, defaulting to port 5000.
> Now listening on port 5000. http://localhost:5000/

$ PORT=3000 node start.js
> Now listening on port 3000. http://localhost:3000/

$ PORT=3000 node start.js --port 4000
> Now listening on port 4000. http://localhost:4000/
```

```js
// In start.js

const serverHelper = require("server-helper");

serverHelper({
  app: require.resolve("./app")
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

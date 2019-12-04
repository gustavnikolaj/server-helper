# API vs CLI mode

`server-helper` can be used in two ways, either by invoking the cli command or
by the programmatic api.

Both modes have the same interface. You are supposed to implement your
entrypoint as a single javascript file that exports a function, that when called
returns a http handler.

E.g. using express:

```js
const express = require("express");

module.exports = () => {
  const app = express();

  app.use("/", (req, res) => res.end("Hello, World!"));

  return app;
};
```

## Using the cli

Implement your server in a file called app.js. Invoke it with the cli tool.

```
$ server-helper app.js
```

This will start the application listening on port 3000 by default.

If you want it to reload whenever `app.js` changes, (or any other javascript
file in the same directory), you just pass it the `--watch` flag, or the short
hand `-w`.

```
$ server-helper app.js
```

If you need to bind to a specific host, you can use the `--host`/`-h` flags, and
to change the port you use `--port`/`-p`.

## Using the api

As with the cli approach, you implement your server in a file called app.js. But
instead of invoking it with the cli, we create another file which could be
called `start.js`.

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

Even when wrapped up like this, `server-helper` will still look for and respect
the command line flags that it supports in cli-mode. So if you want to pop into
watch mode, you can just do it like you would with the cli.

```
$ node start.js -w
```

## Which mode should I use?

It is purely a matter of taste. The API mode gives you a bit more control, and
you can do your own arguments passing if you want to, or start multiple servers
from the same process. The CLI mode is easier to get up and running with, but
does not give you a lot of flexibility.

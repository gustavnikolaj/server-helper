I want a slim http server wrapper that can take care of the most basic wiring
and allow me to just implement my http servers as a function that takes some
args and returns an express-like application.

```js
const express = require("express");

module.exports = opts => {
  const app = express();

  // ...

  return app;
};
```

The wrapper should be just enough glue to start up the process and start
listening on a given port.

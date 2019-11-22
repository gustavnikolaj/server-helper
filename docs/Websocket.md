Include a reference to the httpServer in the createServer args.

```js
const createApp = require(options.appFileName);
const http = require("http");

let app = (req, res) => res.end("Booting...");
const httpServer = http.createServer((req, res) => app(req, res));

app = createApp({
  httpServer
});

const app = create;

httpServer.listen(port, host);
console.log("Server running");
```

When dealing with websockets it's often required to have a reference to the
HttpServer instance.

`server-helper` accomodates that by passing a reference to the http server
instance in the arguments.

```js
// my-app.js

module.exports = function(opts) {
  setupWebSocketHandling(opts.httpServer);
  return myHttpHandler();
};
```

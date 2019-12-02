var http = require("http");

module.exports = serverHelperConfig => {
  var server = http.createServer(function(request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello, World!\n");
  });

  return server;
};

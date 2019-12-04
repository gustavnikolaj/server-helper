/**
 * Run a server.
 *
 * @param {{
 *  entrypoint: string,
 *  port: number,
 *  host?: string
 * }} options
 */
function runNormal(options) {
  const { entrypoint, port, host } = options;

  const createApp = require(entrypoint);
  const http = require("http");

  let app = (req, res) => res.end("Booting...");
  const httpServer = http.createServer((req, res) => app(req, res));

  app = createApp({ httpServer, serverHelperConfig: options });

  const listenArgs = [port];

  if (host) {
    listenArgs.push(host);
  }

  httpServer.listen(...listenArgs);

  if (host) {
    console.log("> Server running listening on %s:%s", host, port);
  } else {
    console.log("> Server listening on port %s", port);
  }
}

module.exports = runNormal;

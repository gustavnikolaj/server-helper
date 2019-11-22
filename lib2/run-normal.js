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
  console.log("Running normal mode with options", options);

  throw new Error("Normal mode NYI");
}

module.exports = runNormal;

/* This file is spawned by `./run-watch.js`. It will load options from argv and
 * then load the entrypoint the same way as is done in normal mode.
 */

const runNormal = require("./run-normal");
const validateOptions = require("./validate-options");

const args = process.argv.slice(2);

const options = {
  entrypoint: args[0],
  port: parseInt(args[1], 10),
};

if (args[3]) {
  options.host = args[3];
}

validateOptions(options);
runNormal(options);

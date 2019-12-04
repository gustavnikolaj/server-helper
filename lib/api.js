const run = require("./run");
const combineOptions = require("./combine-options");
const parseApiOptions = require("./parse-api-options");
const parseCliOptions = require("./parse-cli-options");
const parseEnvOptions = require("./parse-env-options");

function api(options) {
  const combinedOptions = combineOptions({
    api: parseApiOptions(options),
    cli: parseCliOptions(process.cwd(), process.argv.slice(2)),
    env: parseEnvOptions(process.env)
  });

  return run(combinedOptions);
}

module.exports = api;

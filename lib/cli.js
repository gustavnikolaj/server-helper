const run = require("./run");
const combineOptions = require("./combine-options");
const parseCliOptions = require("./parse-cli-options");
const parseEnvOptions = require("./parse-env-options");

module.exports = function cli(cwd, args) {
  const combinedOptions = combineOptions({
    cli: parseCliOptions(cwd, args),
    env: parseEnvOptions(process.env),
  });

  return run(combinedOptions);
};

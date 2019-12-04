const validateOptions = require("./validate-options");
const runNormal = require("./run-normal");
const runWatch = require("./run-watch");

function run(rawOpts) {
  const options = validateOptions(rawOpts);

  if (options.watch) {
    return runWatch(options);
  } else {
    return runNormal(options);
  }
}

module.exports = run;

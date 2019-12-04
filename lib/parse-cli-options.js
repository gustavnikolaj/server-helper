const getopts = require("getopts");
const path = require("path");

function parseCliOptions(cwd, argv) {
  if (typeof cwd !== "string") {
    throw new Error("cwd must be a string");
  }

  if (!Array.isArray(argv)) {
    throw new Error("argv must be an Array");
  }

  const options = getopts(argv, {
    alias: {
      port: "p",
      host: "h",
      watch: "w"
    },
    default: {
      port: null,
      host: null,
      watch: null
    }
  });

  const parsedOptions = {};

  if (typeof options.port === "number") {
    parsedOptions.port = options.port;
  } else if (options.port !== null) {
    throw new Error("Unexpected value for --port");
  }

  if (typeof options.watch === "boolean") {
    parsedOptions.watch = options.watch;
  } else if (options.watch !== null) {
    throw new Error("Unexpected value for --watch");
  }

  if (typeof options.host === "string") {
    parsedOptions.host = options.host;
  } else if (options.host !== null) {
    throw new Error("Unexpected value for --host");
  }

  if (
    options._[0] &&
    options._.length === 1 &&
    typeof options._[0] === "string"
  ) {
    parsedOptions.entrypoint = path.resolve(cwd, options._[0]);
  }

  if (typeof options.host === "string") {
    parsedOptions.host = options.host;
  } else if (options.host !== null) {
    throw new Error("Unexpected value for --host");
  }

  return parsedOptions;
}

module.exports = parseCliOptions;

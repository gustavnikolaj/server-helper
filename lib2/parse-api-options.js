function parseApiOptions(options) {
  if (typeof options === "string") {
    options = {
      entrypoint: options
    };
  }

  if (!(typeof options === "object" && !!options)) {
    throw new Error("options must be an object");
  }

  const unexpectedKeys = Object.keys(options).filter(
    x => x !== "entrypoint" && x !== "watch"
  );

  if (unexpectedKeys.length !== 0) {
    throw new Error(
      `Got unexpected options values: ${unexpectedKeys.join(", ")}`
    );
  }

  const parsedOptions = {};

  if ("entrypoint" in options) {
    if (typeof options.entrypoint !== "string") {
      throw new Error("Expected entrypoint to be a string");
    }

    parsedOptions.entrypoint = options.entrypoint;
  }

  if (typeof options.watch === "boolean") {
    parsedOptions.watch = options.watch;
  }

  return parsedOptions;
}

module.exports = parseApiOptions;

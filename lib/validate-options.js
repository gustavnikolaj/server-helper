/**
 * @param {any} options An options object
 * @throws
 * @returns {{
 *  entrypoint: string,
 *  port: number,
 *  watch: boolean,
 *  host?: string
 * }}
 */
function validateOptions(options) {
  if (!(typeof options === "object" && !!options)) {
    throw new Error("options must be an object");
  }

  if (!("entrypoint" in options)) {
    throw new Error("No entrypoint script");
  }

  if (typeof options.entrypoint !== "string") {
    throw new Error("entrypoint must be a string");
  }

  if (!("port" in options)) {
    throw new Error("No port option given");
  }

  if ("host" in options) {
    if (typeof options.host !== "string") {
      throw new Error("host must be a string");
    }
  }

  if ("watch" in options) {
    if (typeof options.watch !== "boolean") {
      throw new Error("watch must be boolean");
    }
  }

  return options;
}

module.exports = validateOptions;

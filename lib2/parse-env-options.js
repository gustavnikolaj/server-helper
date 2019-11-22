function ensurePort(port) {
  if (typeof port !== "string") {
    throw new Error("Expected string value");
  }

  if (port.length === 0) {
    throw new Error("Invalid port value.");
  }

  const portNumber = parseInt(port, 10);

  if (isNaN(portNumber)) {
    throw new Error("Non number value for port.");
  }

  return port;
}

function ensureHost(host) {
  if (typeof port !== "string") {
    throw new Error("Expected string value");
  }

  if (host.length === 0) {
    throw new Error("Invalid host value.");
  }

  return host;
}

function parseEnvOptions(env) {
  if (!(typeof env === "object" && !!env)) {
    throw new Error("You must pass in an object.");
  }

  const envOptions = {};

  if ("PORT" in env) {
    envOptions.port = ensurePort(env.PORT);
  }

  if ("SERVERHELPER_PORT" in env) {
    envOptions.port = ensurePort(env.SERVERHELPER_PORT);
  }

  if ("SERVERHELPER_HOST" in env) {
    envOptions.host = ensureHost(env.SERVERHELPER_HOST);
  }

  return envOptions;
}

module.exports = parseEnvOptions;

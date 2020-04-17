const defaults = {
  port: 3000,
  watch: false,
};

/**
 * Combines multiple partial configuration objects to a single one with the
 * highest precedent options picked out.
 *
 * @param {{
 *  cli?: Object,
 *  env?: Object,
 *  api?: Object
 * }} optionsBySource
 * @returns {{
 *  entrypoint?: any,
 *  port?: any,
 *  watch?: any,
 *  host?: any
 * }}
 */
function combineOptions(optionsBySource = {}) {
  const resolvedOptions = { ...defaults };

  const cliOpts = optionsBySource.cli || {};
  const envOpts = optionsBySource.env || {};
  const apiOpts = optionsBySource.api || {};

  if (cliOpts.port) {
    resolvedOptions.port = cliOpts.port;
  } else if (envOpts.port) {
    resolvedOptions.port = envOpts.port;
  } else if (apiOpts.port) {
    resolvedOptions.port = apiOpts.port;
  }

  if (cliOpts.host) {
    resolvedOptions.host = cliOpts.host;
  } else if (envOpts.host) {
    resolvedOptions.host = envOpts.host;
  } else if (apiOpts.host) {
    resolvedOptions.host = apiOpts.host;
  }

  if (cliOpts.watch) {
    resolvedOptions.watch = cliOpts.watch;
  } else if (apiOpts.watch) {
    resolvedOptions.watch = apiOpts.watch;
  }

  if (cliOpts.entrypoint) {
    resolvedOptions.entrypoint = cliOpts.entrypoint;
  } else if (apiOpts.entrypoint) {
    resolvedOptions.entrypoint = apiOpts.entrypoint;
  }

  return resolvedOptions;
}

module.exports = combineOptions;

const path = require("path");
const semver = require("semver");
const readPkgUp = require("read-pkg-up");

function nodeVersionSupportsModules(nodeVersion) {
  // 13.2.0 is the first node version with unflagged support for esm. It might
  // be backported to v12, but it hasn't happened yet (December 5th, 2019).
  return semver.gte(nodeVersion, "13.2.0");
}

const CJS_MODE = "cjs";
const ESM_MODE = "esm";

async function resolveUserCodeMode(entrypoint, nodeVersion = process.version) {
  if (!nodeVersionSupportsModules(nodeVersion)) {
    return CJS_MODE;
  }

  if (path.extname(entrypoint) === ".mjs") {
    return ESM_MODE;
  }

  if (path.extname(entrypoint) === ".js") {
    // We support modules, and we have no hint in the file type need to check if
    // the package.json files defaults to modules or cjs.

    const pkg = await readPkgUp({ cwd: path.dirname(entrypoint) });

    if (pkg.packageJson.type === "module") {
      return ESM_MODE;
    }
  }

  return CJS_MODE;
}

async function loadUserCode(entrypoint) {
  const mode = await resolveUserCodeMode(entrypoint);

  if (mode === ESM_MODE) {
    const createApp = await import(entrypoint);
    return createApp.default;
  } else {
    return require(entrypoint);
  }
}

module.exports = loadUserCode;
module.exports.resolveUserCodeMode = resolveUserCodeMode;

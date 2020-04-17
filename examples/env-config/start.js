const serverHelper = require("../../lib/api");
const { resolve } = require("path");

serverHelper({
  entrypoint: resolve(__dirname, "./app"),
});

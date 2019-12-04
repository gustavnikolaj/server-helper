const serverHelper = require("../../lib2/api");
const { resolve } = require("path");

serverHelper({
  entrypoint: resolve(__dirname, "./app")
});

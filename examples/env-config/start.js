const serverHelper = require("../../");
const { resolve } = require("path");

serverHelper({
  appFileName: resolve(__dirname, "./app"),
  configFileName: resolve(__dirname, "./config")
});

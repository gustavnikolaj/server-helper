const serverHelper = require("../../lib2/api");
const { resolve } = require("path");

serverHelper({
  app: resolve(__dirname, "./app")
});

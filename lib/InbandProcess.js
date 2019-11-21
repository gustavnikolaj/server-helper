const { EventEmitter } = require("events");
const invariant = require("invariant");

class InbandProcess extends EventEmitter {
  constructor({ config, appFileName, isEsm } = {}) {
    super();
    invariant(
      typeof appFileName === "string",
      "MonitoredProcess: You must pass a path to the app file in the options."
    );
    invariant(
      config && typeof config === "object",
      "MonitoredProcess: You must pass a config object in the options."
    );

    this.config = config;
    this.appFileName = appFileName;

    this.state = "stopped";
  }

  start() {
    if (this.state === "stopped") {
      let appFactory = require(this.appFileName);

      if (
        appFactory &&
        typeof appFactory !== "function" &&
        typeof appFactory.default === "function"
      ) {
        // Compensate for ES6 module being imported in cjs.
        appFactory = appFactory.default;
      }

      const app = appFactory(this.config);

      const callback = () => {
        this.state = "started";
        this.emit("start");
      };

      const port = this.config.port || 3000;

      const listenArgs = [port];

      if (this.config.hostname) {
        listenArgs.push(this.config.hostname);
      }

      listenArgs.push(callback);

      app.listen(...listenArgs);
    }

    return this;
  }

  restart() {
    throw new Error("Cannot restart an InbandProcess");
  }

  stop() {
    if (this.state === "started") {
      this.state = "stopped";
      this.emit("stop", 0);
    }

    return this;
  }
}

module.exports = InbandProcess;

const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const path = require("path");
const invariant = require("invariant");

class MonitoredProcess extends EventEmitter {
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

    let args = [
      path.resolve(__dirname, "bootstrapWorker.js"),
      "--app",
      appFileName,
      "--config",
      JSON.stringify(this.config)
    ];

    if (isEsm) {
      args = ["-r", "esm", ...args];
    }

    this.command = "node";
    this.args = args;
    this.state = "stopped";
    this.process = null;
  }

  start() {
    if (this.state === "stopped") {
      this.process = spawn(this.command, this.args);

      for (const streamName of ["stdout", "stderr"]) {
        this.process[streamName].on("data", data =>
          this.emit("output", data, streamName)
        );
      }

      this.process.on("error", err => {
        this.state = "stopped";
        this.emit("crash", err, "spawn");
      });

      this.process.on("exit", (exitCode, signalName) => {
        this.state = "stopped";
        this.emit("crash", exitCode, signalName);
      });

      this.state = "started";
      this.emit("start");
    }
    return this;
  }

  restart() {
    if (this.state === "started") {
      this.once("stop", () => this.start());
      this.stop();
    } else if (this.state === "stopped") {
      this.start();
    }
    return this;
  }

  stop() {
    if (this.state === "started") {
      this.process.removeAllListeners();

      let exited = false;

      this.process.on("exit", exitCode => {
        exited = true;
        this.state = "stopped";
        this.emit("stop", exitCode);
      });

      this.process.kill("SIGTERM");

      setTimeout(() => {
        if (!exited) {
          this.process.kill("SIGKILL");
        }
      }, 1000);
    }
    return this;
  }
}

module.exports = MonitoredProcess;

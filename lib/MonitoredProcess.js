const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const invariant = require("invariant");

class MonitoredProcess extends EventEmitter {
  constructor({ command, args } = {}) {
    super();
    invariant(
      typeof command === "string",
      "MonitoredProcess: You must pass a command in the options."
    );
    invariant(
      Array.isArray(args),
      "MonitoredProcess: You must pass an array as args in the options."
    );

    this.command = command;
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

const { spawn } = require("child_process");
const { EventEmitter } = require("events");
const path = require("path");
const fs = require("fs");
const findFilesToWatch = require("./find-files-to-watch");

class MonitoredProcess extends EventEmitter {
  constructor({ entrypoint, port, host }) {
    super();

    const args = [
      path.resolve(__dirname, "run-watch-process.js"),
      entrypoint,
      port
    ];

    if (host) {
      args.push(host);
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

async function setupWatchers(entrypoint, callback) {
  const filesToWatch = await findFilesToWatch(entrypoint);

  const dirsToWatch = [];
  for (const dirName of filesToWatch.map(path.dirname)) {
    if (!dirsToWatch.includes(dirName)) {
      dirsToWatch.push(dirName);
    }
  }

  for (const dirname of dirsToWatch) {
    try {
      fs.watch(dirname, (eventName, fileName) => {
        if (!(fileName && /^\.#/.test(fileName))) {
          callback();
        }
      });
    } catch (e) {
      if (e.code === "ENOSPC") {
        console.warn(e.stack);
      } else {
        console.warn(e.stack);
        throw e;
      }
    }
  }
}

/**
 * Run a server in watch mode.
 *
 * @param {{
 *  entrypoint: string,
 *  port: number,
 *  host?: string
 * }} options
 */
function runWatch(options) {
  const monitoredProcess = new MonitoredProcess(options);

  let restarting = false;
  let restartTimeout = null;

  monitoredProcess
    .on("start", () => {
      if (restarting) {
        console.log("> Worker restarted.");
      } else {
        console.log("> Worker started.");
      }
    })
    .on("stop", () => !restarting && console.log("> Worker stopped."))
    .on("output", (output, streamName) => process[streamName].write(output))
    .on("crash", (exitCode, signalName) => {
      console.log(
        `\n> Worker crashed with exitCode ${exitCode} and signal ${signalName}`
      );
    });

  process.on("SIGINT", () => {
    console.log("\n> Shutting down...");
    monitoredProcess.stop().once("stop", exitCode => {
      process.exit(128 + exitCode);
    });
  });

  setupWatchers(options.entrypoint, () => {
    if (restartTimeout !== null) {
      clearTimeout(restartTimeout);
    } else {
      console.warn("\n> Source file(s) changed, restarting...");
    }

    if (!restarting) {
      restarting = true;

      monitoredProcess.once("start", () => {
        restarting = false;
      });
    }

    restartTimeout = setTimeout(() => {
      monitoredProcess.restart();
      restartTimeout = null;
    }, 250);
  });

  monitoredProcess.start();
}

module.exports = runWatch;

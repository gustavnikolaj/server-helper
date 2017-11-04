const invariant = require("invariant");
const path = require("path");
const fs = require("fs");
const MonitoredProcess = require("./MonitoredProcess");
const findFilesToWatch = require("./findFilesToWatch");

class Manager {
  constructor(options = {}) {
    invariant("appFileName" in options, "You must pass a path in appFileName");
    invariant(
      "configFileName" in options,
      "You must pass a path in configFileName"
    );

    this.appFileName = options.appFileName;
    this.config = require(options.configFileName);
    this.restarting = false;

    this.worker = new MonitoredProcess({
      command: "node",
      args: [
        path.resolve(__dirname, "bootstrapWorker.js"),
        "--app",
        options.appFileName,
        "--config",
        JSON.stringify(this.config)
      ]
    });

    this.worker
      .on("start", () => console.log("worker started"))
      .on("stop", () => console.log("worker stopped"))
      .on("output", (output, streamName) =>
        console.log(`${streamName}: ${output}`)
      )
      .on("crash", (exitCode, signalName) => {
        console.log(
          `Worker crashed with exitCode ${exitCode} and signal ${signalName}`
        );
      });

    this.worker.start();

    if (this.config.server && this.config.server.watch) {
      this.setupWatchers();
    }
  }

  restartWorker() {
    if (!this.restarting) {
      console.warn("Source file(s) changed, restarting.");
      this.restarting = true;
      this.worker.once("start", () => {
        this.restarting = false;
      });
      this.worker.restart();
    }
  }

  async setupWatchers() {
    const filesToWatch = await findFilesToWatch(
      this.appFileName,
      this.config.watch
    );

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
            this.restartWorker();
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
}

module.exports = Manager;

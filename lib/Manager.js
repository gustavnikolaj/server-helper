const invariant = require("invariant");
const path = require("path");
const fs = require("fs");
const MonitoredProcess = require("./MonitoredProcess");
const InbandProcess = require("./InbandProcess");
const findFilesToWatch = require("./findFilesToWatch");

function isEsmEnabled() {
  const cacheKey = Object.keys(require.cache).find(x => /\/esm.js$/.test(x));
  return !!cacheKey;
}

const isEsm =
  (process._preload_modules && process._preload_modules.includes("esm")) ||
  isEsmEnabled();

class Manager {
  constructor(options = {}) {
    invariant("appFileName" in options, "You must pass a path in appFileName");
    invariant(
      "configFileName" in options || "config" in options,
      "You must pass a path in configFileName or a config object in the key config"
    );

    this.appFileName = options.appFileName;
    this.config = options.config || require(options.configFileName);
    this.restarting = false;

    const processOptions = {
      config: this.config,
      appFileName: this.appFileName,
      esm: isEsm
    };

    this.worker = options.inBand
      ? new InbandProcess(processOptions)
      : new MonitoredProcess(processOptions);

    this.worker
      .on("start", () => !this.restarting && console.log("> Worker started."))
      .on("stop", () => !this.restarting && console.log("> Worker stopped."))
      .on("output", (output, streamName) => process[streamName].write(output))
      .on("crash", (exitCode, signalName) => {
        console.log(
          `\n> Worker crashed with exitCode ${exitCode} and signal ${signalName}`
        );
      });

    this.worker.start();

    if (this.config && this.config.watch) {
      this.setupWatchers();
    }

    this.restartWorkerTimeout = null;
  }

  actuallyRestartWorker() {
    if (!this.restarting) {
      console.warn("\n> Source file(s) changed, restarting...");
      this.restarting = true;
      this.worker.once("start", () => {
        this.restarting = false;
      });
      this.worker.restart();
    }
  }

  restartWorker() {
    if (this.restartWorkerTimeout !== null) {
      clearTimeout(this.restartWorkerTimeout);
    }

    this.restartWorkerTimestamp = Date.now();
    this.restartWorkerTimeout = setTimeout(() => {
      this.actuallyRestartWorker();
      this.restartWorkerTimeout = null;
    }, 50);
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

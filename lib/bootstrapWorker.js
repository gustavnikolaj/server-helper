const parseArgv = argv => {
  let rest = argv.slice(2);
  const options = {};

  while (rest.length > 0) {
    rest = rest.slice(0);
    if (/^--/.test(rest[0]) && !/^--/.test(rest[1])) {
      const name = rest[0].replace(/^--/, "");
      options[name] = rest[1];
      rest = rest.slice(2);
    } else {
      throw new Error(`Cannot parse remaining arguments ${rest}`);
    }
  }

  if (options.config) {
    options.config = JSON.parse(options.config);
  }

  return options;
};

const options = parseArgv(process.argv);

let appFactory = require(options.app);

if (
  appFactory &&
  typeof appFactory !== "function" &&
  typeof appFactory.default === "function"
) {
  // Compensate for ES6 module being imported in cjs.
  appFactory = appFactory.default;
}

const app = appFactory(options.config);

const port = options.config.port || 3000;
const host = options.config.host || "localhost";

const callback = () => {
  console.log(
    "> Now listening on port %s. (%s)",
    port,
    `http://${host}:${port}/`
  );
};

const listenArgs = [port];

if (options.config.hostname) {
  listenArgs.push(options.config.hostname);
}

listenArgs.push(callback);

app.listen(...listenArgs);

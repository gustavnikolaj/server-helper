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

const app = require(options.app)(options.config);

app.listen(options.config.port);
